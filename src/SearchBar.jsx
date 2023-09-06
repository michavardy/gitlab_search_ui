import SearchIcon from "./SearchIcon";
import SearchIconLoading from "./SearchIconLoading"
import Table from "./Table"
import React, { useState, useEffect } from "react";

export default function SearchBar() {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState({})

  useEffect(() => {
    console.log("Loading state has changed:", loading);
  }, [loading]);

    const handleSearch = async(event) => {
        event.preventDefault();
        const SearchObject = {
          search_prompt:event.target.elements.searchTerm.value,
          branch: event.target.elements.branch.value,
          script_name_black_list: event.target.elements.blackList.value
        }
        console.log("SearchObject")
        console.log(SearchObject)
        setLoading(true);
        try {
          const response = await fetch(`http://${window.location.host}/gitlab_search_ui/fetch`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(SearchObject)
          });
    
          if (response.ok) {
            const data = await response.json();
            console.log("Search results:", data);
            setSearchResults(data)
          } else {
            console.error("Error:", response.statusText);
          }
        } catch (error) {
          console.error("Error:", error);
        }
    
        setLoading(false);
      };

      return (
        <div className="flex justify-center items-stretch w-screen h-screen">
          <div className="flex justify-around items-center w-full h-full">
            <div className="border-2 border-blue-300 p-8 rounded-lg shadow-md">
            {loading ? (
            <SearchIconLoading className="w-50 h-50 mx-auto mb-4" />
          ) : (
            <SearchIcon className="w-50 h-50 mx-auto mb-4" />
          )}
              <form
            onSubmit={handleSearch}
            className="text-center"
            disabled={loading}
          >
                <label className="block mb-2 text-lg font-semibold text-left">Search Prompt:</label>
                <input
                  type="text"
                  name="searchTerm"
                  className="w-300 p-2 text-lg rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                  placeholder="Search..."
                />
                <label className="block mb-2 text-lg font-semibold text-left">Branch:</label>
                <input
                  type="text"
                  name="branch"
                  defaultValue="development"
                  className="w-300 p-2 text-lg rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                />
                <div className="flex flex-col items-center">
                  <label className="block mb-2 text-lg font-semibold text-left">Black List (comma-separated):</label>
                  <textarea
                    name="blackList"
                    rows="3"
                    className="w-300 p-2 text-lg rounded-lg shadow-md focus:outline-none focus:ring focus:border-blue-300 mb-4"
                  />
            <div className="flex flex-col items-center">
            <button
              type="submit"
              className="w-300 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              disabled={loading}
            >
                {loading ? "searching ..." : "search"}
            </button>
            </div>
                </div>
              </form>
            </div>
            <div className="flex flex-col justify-between mt-8">
              {Object.keys(searchResults).length > 0 && <Table data={searchResults}/>}
            </div>
          </div>
        </div>
      );
  }
  
  