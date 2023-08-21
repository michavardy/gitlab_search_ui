import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getPaginationRowModel,
  } from '@tanstack/react-table' 

import {useState, useEffect} from 'react'

  const columnHelper = createColumnHelper()
  const columns = [

      columnHelper.accessor('name',{
          header: ()=>'project-name',
          cell: info => info.renderValue()
      }),
      columnHelper.accessor('path',{
          header: ()=>'path',
          cell: info => info.renderValue()
      })
  ]


export default function Table(props) {
    const [data, setData] = useState({})

    useEffect(()=>{
        setData(props.data)
        console.log('table results')
        console.log(props.data)
    },[props])

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
      })



  return (
    <div>
    <div className="p-2">
        <table className="border-collapse w-full border-2 border-blue-300 p-8 rounded-lg shadow-md">
            {/* table - head */}
            <thead className="bg-blue-600 text-white">
            {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                        <th key={header.id}>
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
            {/* table - body */}
            {table.getRowModel().rows.map(row=>(
                <tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="py-5 px-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                    ))}
                </tr>
            ))}
            <tbody>
            </tbody>
        </table>
    </div>
          <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>
          <span className="flex items-center gap-1">
            | Go to page:
            <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16"
            />
          </span>
          <select
            value={table.getState().pagination.pageSize}
            onChange={e => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
        </div>
  );
}
