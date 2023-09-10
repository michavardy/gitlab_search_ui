import './index.css';
import Table2 from './Table2'

export default function ResultsBar(props) {
  
    return (
    <div className="">
        <Table2  projectData={props.projectData} searchResults={props.searchResults} searchBranch={props.searchBranch}/>
    </div>
  );
}
