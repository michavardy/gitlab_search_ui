import  { useEffect, useState, useMemo } from 'react';

export default function useGitlabClient(initialGroup){
    const [projects, setProjects] = useState([]);
    const [group, setGroup] = useState(initialGroup)

    const token = 'glpat-MLCWEiLurnzkqHsZ3QJR';
    const base_url = "https://gitlab.com";
    const requests_per_page = 100;
    const project_name_blacklist = useMemo(() => ['test', 'shani', 'daniel', 'tal', 'shay', 'joey', 'project', 'rami', 'demo', 'chris'],[])
    
    useEffect(()=>{
        if (!token || !group || !requests_per_page ) {
            throw new Error("All variables must be set.");
          }
        async function getProjects(){
            try{
                const response = await fetch(
                    `${base_url}/api/v4/groups/${group}/projects?per_page=${requests_per_page}`,
                    {
                        headers: {
                          'PRIVATE-TOKEN': token,
                        },
                    }
                    );
                if (!response.ok){
                    throw new Error(`Error fetching projects: ${response.status}`)
                }
                const data = await response.json();
                const filteredData = data.filter((proj) => 
                    !project_name_blacklist.some((black) => proj.name.includes(black))
                    ); 
                setProjects(filteredData)
            }
            catch(error){
                console.error("Error fetching projects:", error)
            }
            
        }
        getProjects()
    },[group, token, requests_per_page, project_name_blacklist])

    async function searchAllProjects (search_prompt, branch, group){
        await setGroup(group)
        
        const searchPromises = projects.map((project)=>{
            return searchProject(project, search_prompt, branch)
        })
        try{
            const searchResults = await Promise.all(searchPromises);
            console.log('search results')
            console.log(searchResults)
            return searchResults
            
        } 
        catch(error){
            console.error("Error searching projects:", error)
        }
    }
    
    const searchProject = async (project, search_prompt, branch) => {
        try {
          const response = await fetch(
            `${base_url}/api/v4/projects/${project.id}/search?scope=blobs&ref=${branch}&search=${search_prompt}`,
            {
              headers: {
                'PRIVATE-TOKEN': token,
              },
            }
          );

          if (!response.ok) {
            throw new Error(`Error searching project: ${response.status}`);
          }
    
          const data = await response.json();
          return data;
        } catch (error) {
          console.error(`Error searching project ${project.name}:`, error);
          return [];
        }
      };



    return {
        projects, setGroup, searchAllProjects,  group
    }
}