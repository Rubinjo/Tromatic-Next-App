import React, { useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { FaMagnifyingGlass } from "react-icons/fa6";

export default function Table({ data, columns }) {
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState("");
	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			sorting: sorting,
			globalFilter: filtering,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
	});
	return (
		<div class="relative overflow-x-auto sm:rounded">
			<div class="flex p-2 justify-end">
				<label for="table-search" class="sr-only">
					Search
				</label>
				<div class="relative mt-1">
					<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<FaMagnifyingGlass
							class="w-4 h-4 text-gray-500 dark:text-gray-400"
							aria-hidden="true"
						/>
					</div>
					<input
						id="table-search"
						type="text"
						placeholder="Search"
						class="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-secondary focus:border-secondary"
						value={filtering}
						onChange={(e) => setFiltering(e.target.value)}
					/>
				</div>
			</div>
			<table class="w-full text-sm text-left shadow-md">
				<thead class="w-full text-xs text-white uppercase bg-primary">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									scope="col"
									class="px-6 py-3"
								>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
									{
										{ asc: "🔼", desc: "🔽" }[
											header.column.getIsSorted() ?? null
										]
									}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr
							key={row.id}
							class="bg-white border-b text-gray-700"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} class="px-6 py-4">
									{flexRender(
										cell.column.columnDef.cell,
										cell.getContext()
									)}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
			<div class="text-center flex justify-center text-sm">
				<button
					class="px-4 py-2 my-4 shadow text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-l"
					onClick={() => table.setPageIndex(0)}
				>
					First page
				</button>
				<button
					class={
						"px-4 py-2 my-4 shadow text-gray-700 " +
						(!table.getCanPreviousPage()
							? "bg-gray-200"
							: "hover:text-gray-900 hover:bg-gray-50")
					}
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					Previous page
				</button>
				<button
					class={
						"px-4 py-2 my-4 shadow text-gray-700 " +
						(!table.getCanNextPage()
							? "bg-gray-200"
							: "hover:text-gray-900 hover:bg-gray-50")
					}
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					Next page
				</button>
				<button
					class="px-4 py-2 my-4 shadow text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-r"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				>
					Last page
				</button>
			</div>
		</div>
	);
}
