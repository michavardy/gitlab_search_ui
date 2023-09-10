import './index.css';
import {useState, useEffect} from 'react'
import SearchBar2 from './SearchBar2'
import ResultsBar from './ResultsBar'

function Search() {
    const [projectData, setProjectData] = useState([])
    const [searchPrompt, setSearchPrompt] = useState("")
    const [searchBranch, setSearchBranch] = useState("")
    const [searchResults, setSearchResults] = useState([])
    useEffect(()=>{
    },[projectData, searchResults])
    return (
    <div className="App">
        <SearchBar2 setProjectData={setProjectData} setResults={setSearchResults} setSearchBranch={setSearchBranch} setSearchPrompt={setSearchPrompt}/>
        {Object.keys(searchResults).length > 0 && <ResultsBar projectData={projectData} searchResults={searchResults} searchBranch={searchBranch} searchPrompt={searchPrompt}/>}
    </div>
  );
}

export default Search;