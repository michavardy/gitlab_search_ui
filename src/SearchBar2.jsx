import './index.css';
import useGitlabClient from './useGitlabClient';
import { useForm} from 'react-hook-form';
import {useEffect} from 'react'


export default function SearchBar2(props) {
    const DefaultGroup="8708408"
    const { register, handleSubmit} = useForm();
    const { projects, setGroup, searchAllProjects} = useGitlabClient(DefaultGroup);
    useEffect(()=>{setGroup(DefaultGroup)},[setGroup])

    const onSubmit = async (data) => {
        console.log('submit button pressed')
        const results = await searchAllProjects(data.search_prompt, data.branch, data.group);
        props.setSearchBranch(data.branch)
        props.setSearchPrompt(data.search_prompt)
        props.setResults(results) 
        props.setProjectData(projects)

      };
  
      return (
        
        <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="text-black text-center text-6xl font-bold mb-4 p-4">Gitlab Search</div>
            <div className="flex justify-evenly">
                <div className="flex flex-col items-start">
                <label htmlFor="search_prompt" className="block text-gray-600">
                    Search Prompt:
                </label>
                <input 
                    id="search_prompt"
                    className="border-black border-2 rounded-md p-2 text-gray-400"
                    defaultValue="MINIO_PS_FILES_SYNC_BUCKET" 
                    {...register("search_prompt")} />
                </div>
                <div className="flex flex-col items-start">
                <label htmlFor="branch" className="block text-gray-600">
                    Branch:
                </label>
                <input 
                    id="branch"
                    className="border-black border-2 rounded-md p-2 text-gray-400"
                    defaultValue="development" 
                    {...register("branch")} />
                </div>
                <div className="flex flex-col items-start">
                <label htmlFor="group" className="block text-gray-600">
                    Group:
                </label>
                <input 
                    id="group"
                    className="border-black border-2 rounded-md p-2 text-gray-400"
                    defaultValue="8708408" 
                    {...register("group")} />
                </div>
                <button className="bg-turq text-white rounded-md p-3 font-bold hover:bg-blue-400 active:bg-green-700 focus:ring focus:ring-green-400 w-36 h-12 mt-5">
                    Search
                </button>
            </div>
        </form>

    );
    }

