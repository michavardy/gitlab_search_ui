import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  //Column,
  //Table,
  //ColumnFiltersState,
  //getFilteredRowModel,
  //getFacetedRowModel,
  //getFacetedUniqueValues,
  //getFacetedMinMaxValues,
  //sortingFns,
} from "@tanstack/react-table";

import { useState, useEffect } from "react";

const columnHelper = createColumnHelper();

const columns = [
  columnHelper.accessor("Name", {
    header: () => (<div className="min-w-[300px]">Project Name</div>),
    cell: (info) => (
    <div className="flex justify-center font-bold">
        {info.renderValue()}
    </div>),
  }),
  columnHelper.accessor("Use", {
    header: () => "Use",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("Path", {
    header: () => "Link",
    cell: (info) => {
      const link = info.row.original.Link;
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          {info.renderValue()}
        </a>
      );
    },
  }),
];

export default function Table2(props) {
  const [data, setData] = useState([]);
  const [origData, setOrigData] = useState([]);
  const [blackListFilterArray, setBlackListFilterArray] = useState([]);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    /* 
        CreatorID: 6252883
          Link: "https://gitlab.com/tufinps/tos2/customers/swisscom/-/blob/development/scripts/targets_suggestions20.py?ref_type=heads"
          Name: "swisscom"
           Path: "scripts/targets_suggestions20.py"
           Use: "import logging\nimport shlex\nfrom netaddr import IPNetwork, IPRange, IPAddress, IPSet\n\nfrom Secure_Common.Base_Types import XML_List\n"
        */
    const buildData = props.searchResults
      .map((resultsArray) => {
        if (!resultsArray.length) {
          return null;
        }
        const data = resultsArray.map((result) => {
          const [project] = props.projectData.filter((project) => {
            return project.id === result.project_id;
          });
          return {
            Name: project.name,
            Use: result.data,
            Path: result.path,
            Link: `${project.web_url}/-/blob/${props.searchBranch}/${result.path}?ref_type=heads`,
            CreatorID: project.creator_id,
          };
        });
        return data;
      })
      .filter((data) => data !== null)
      .reduce((acc, currentArray) => acc.concat(currentArray), []);
    setData(buildData);
    setOrigData(buildData);
  }, [props]);

  useEffect(() => {
    console.log("blacklist");
    console.log(blackListFilterArray);
    function filterDataArray() {
      console.log(`blackListFilterArray: ${blackListFilterArray}`);
      if (blackListFilterArray.length === 0) {
        // If blackListFilterArray is empty, set filteredData to origData
        setData(origData);
      } else {
        const filteredData = origData.filter((item) => {
          // Check if any of the blacklist patterns match in item.Use, item.Name, or item.Link
          const use = item.Use.toLowerCase();
          const name = item.Name.toLowerCase();
          const link = item.Link.toLowerCase();
    
          return !blackListFilterArray.some((blacklistItem) => {
            // Escape special characters in the blacklistItem
            const escapedKeyword = blacklistItem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedKeyword, "i");
    
            return regex.test(use) || regex.test(name) || regex.test(link);
          });
        });
        setData(filteredData);
      }
    }
    filterDataArray();
  }, [blackListFilterArray, origData]);

  useEffect(() => {
    console.log("data");
    console.log(data);
  }, [data]);

  function handleApplyClick() {
    if (inputValue.trim() !== "") {
      setBlackListFilterArray([...blackListFilterArray, inputValue]);
      setInputValue("");
    }
  }

  function handleRemoveClick(itemToRemove) {
    const updatedFilter = blackListFilterArray.filter(
      (item) => item !== itemToRemove
    );
    setBlackListFilterArray(updatedFilter);
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="my-5">
      <div className="flex flex-row">
        {/* blackListFilter array input */}
        <div className="my-2 mx-4 flex flex-col">
          <label className="block text-gray-600">Black List:</label>
          <input
            type="text"
            className="border-2 border-black rounded-lg p-2"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <button
          className="bg-turq text-white rounded-md p-3 font-bold hover:bg-blue-400 active:bg-green-700 focus:ring focus:ring-green-400 w-36 h-12 mt-7"
          onClick={handleApplyClick}
        >
          Apply
        </button>
        <div className="flex flex-wrap items-center gap-2 mt-7 mx-2 my-1">
          {blackListFilterArray.map((item, index) => (
            <div
              key={index}
              className="bg-gray-300 rounded-md p-2 flex items-center"
            >
              {item}
              <button
                onClick={() => handleRemoveClick(item)}
                className="ml-2 text-gray-600 hover:text-red-500 cursor-pointer"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-2">
        <table className="border-collapse w-full border-2 p-8 rounded-lg shadow-md">
          {/* table - head */}
          <thead className="bg-turq text-white ">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-4">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {/* table - body */}
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="py-5 px-4 text-left text-black">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2 justify-center">
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="border rounded p-1"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[5, 10, 20, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
