from typing import Union, Any
from .gitlabClient import GitlabClient
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  # Import the CORSMiddleware
import json
import re
import uvicorn

app = FastAPI()


# Configure CORS settings
origins = [
    "http://localhost",
    "http://localhost:3001",  # Add the URLs of your frontend here
    # Add more origins if needed
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


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.post("/search")
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

def start():
    """Launched with `poetry run start` at root level"""
    uvicorn.run("fast.main:app", host="0.0.0.0", port=8000, reload=True)