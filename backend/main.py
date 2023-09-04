from typing import Union, Any
from .gitlabClient import GitlabClient
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Import the CORSMiddleware
from fastapi.staticfiles import StaticFiles  # Import StaticFiles
import json
import re
import uvicorn

app = FastAPI()


# Configure CORS settings
origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "*"
]

# Add the CORSMiddleware to your app with the configured origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchObject(BaseModel):
    search_prompt:str
    branch:str='development'
    script_name_black_list:str

#class SPAStaticFiles(StaticFiles):
#    async def get_response(self, path: str, scope):
#        try:
#            return await super().get_response(path, scope)
#        except HTTPException as ex:
#            if ex.status_code == 404:
#                return await super().get_response("index.html", scope)
#            else:
#                raise ex

@app.get("/gitlab_search_ui/test")
def read_root():
    return {"Hello": "World"}


@app.post("/gitlab_search_ui/fetch")
async def search(SearchObject: SearchObject):
    """
    curl -X POST "http://127.0.0.1:8000/search" -H "accept: application/json" -H "Content-Type: application/json" -d "{\"search_prompt\":\"MINIO_PS\",\"script_name_black_list\":[\"pscli\"]}"

    """
    glb = GitlabClient()

    # convert script name black list into a list
    SearchObject.script_name_black_list = re.split(',', SearchObject.script_name_black_list)
    if SearchObject.script_name_black_list == ['']:
        SearchObject.script_name_black_list = None

    search_results = glb.extract_search_results_dict(
        search_prompt=SearchObject.search_prompt,
        branch=SearchObject.branch,
        script_name_black_list=SearchObject.script_name_black_list
        )
    print(search_results)
    return search_results


class SPAStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 404:
            response = await super().get_response('.', scope)
        return response

# Mount the static files directory (built React files) to the URL path "/"
app.mount("/gitlab_search_ui/", SPAStaticFiles(directory="/app/frontend/build", html=True), name="static")


def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("backend.main:app", host="0.0.0.0", port=80, reload=True)