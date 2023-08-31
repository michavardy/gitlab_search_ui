import os
from dotenv import load_dotenv
import requests
import logging
from tqdm import tqdm

# Load environment variables from .env
load_dotenv()
# Set up logger
logging.basicConfig(level=logging.ERROR)
logger = logging.getLogger(__name__)


class GitlabClient:
    def __init__(self, group:str=None):
        # Access environmental variables
        self.token:str = os.getenv("TOKEN")
        self.group:str = group if group is not None else os.getenv("GROUP")
        self.base_url:str = "https://gitlab.com"
        self.requests_per_page:int = os.getenv("REQUESTS_PER_PAGE")
        self.project_name_blacklist = ['test','shani','daniel','tal','shay','joey','project','rami','demo','chris']
        # Check if the variables were loaded
        if not self.token or not self.group or not self.requests_per_page:
            raise ValueError("all variables must be set in .env")


    def _request_all_items(self, method:str, uri:str, expected_status_codes:int=200)->list[dict]:
        # response
        all_items = []
        if method == "GET":
            params = {"per_page": self.requests_per_page}
            response = self._make_get_request(uri, params)
            all_items.extend(response)
            # Paging
            page = 2
            while True:
                if len(response) > 0:
                    logger.debug(f"query page: {page}")
                    params = {"per_page": self.requests_per_page, "page": page}
                    response = self._make_get_request(uri, params)
                    all_items.extend(response)
                    page = page + 1
                else:
                    logger.warning(f"last page: {page - 2}")
                    break

        return all_items

    def _make_get_request(self, uri:str, params:dict=None)->dict:
        logger.debug(f"make get request: {uri}")
        try:
            response = requests.get(
                uri, headers={"PRIVATE-TOKEN": self.token}, params=params
            )
        except Exception as e:
            logger.error(f"response was not received: error: {e}")
            raise e
        logger.debug(f"response recieved")
        return response.json()

    def get_all_projects(self)-> list[dict]:
        logger.info(f"get all projects")
        projects_api:str = f"{self.base_url}/api/v4/groups/{self.group}/projects"
        all_projects:list[dict] = self._request_all_items(method="GET", uri=projects_api)
        return all_projects

    def extract_project_list(self)->list[dict]:
        # [{"name":<project_name>, "id":<project-id>}, ...]
        all_projects = self.get_all_projects()
        project_list = [{"name": project["name"], "id":project["id"]} 
                        for project in all_projects 
                        if not any(black in project['name'] for black in self.project_name_blacklist)]
        return project_list

    
    def search_project(self, project:dict, search_prompt:str, branch:str)->list[dict]:
        ## project = {'name':<project-name>, 'id':<project-id>}
        logger.info(f"search through project: {project['name']} for search_prompt: {search_prompt}")
        search_api:str = f"{self.base_url}/api/v4/projects/{project['id']}/search?scope=blobs&ref={branch}&search={search_prompt}"
        search_results:list[dict] = self._request_all_items(method="GET", uri=search_api)
        return search_results


    def search_all_projects(self, search_prompt:str, branch:str='development')->list[dict]:
        logger.info(f'search through all projects for prompt: {search_prompt}')
        project_list = self.extract_project_list()
        results=[]
        for project in tqdm(project_list, total=len(project_list), desc="Searching projects"):
            search_result = self.search_project(project, branch=branch, search_prompt=search_prompt)
            if len(search_result) > 0:
                results.extend(search_result)
        return results
    
    def extract_search_results_dict(self, search_prompt:str, script_name_black_list:list=None, branch:str='development')->list[dict]:
        # [{'path':<script-path>, 'name':<project-name>, 'id':<project-id>}]
        search_results = self.search_all_projects(search_prompt=search_prompt)
        project_list = self.extract_project_list()
        search_results_dict_list = []
        for res in search_results:
            if type(res) == dict:
                search_results_dict = {}
                search_results_dict['path'] = res['path']
                search_results_dict['id'] = res['project_id']
                search_results_dict['name'] = [project['name'] for project in project_list if project['id']==res['project_id']][0]
                search_results_dict_list.append(search_results_dict)
       
        # filter search results using script_name black list
        if script_name_black_list:
            print(f'script_name_black_list: {script_name_black_list}, search_results_dict_list: {search_results_dict_list}')
            search_results_dict_list = [sr for sr in search_results_dict_list if not any(script_name in sr['path'] for script_name in script_name_black_list)]
        return search_results_dict_list


if __name__ == "__main__":
    glb = GitlabClient()
    search_results = glb.extract_search_results_dict(search_prompt='MINIO_PS_FILES_SYNC_BUCKET')
    logger.debug(f'search results dict: {search_results}')

