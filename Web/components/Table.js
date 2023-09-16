import React, { useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";

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
		<div>
			<input
				type="text"
				placeholder="Search"
				value={filtering}
				onChange={(e) => setFiltering(e.target.value)}
			/>
			<table>
				{table.getHeaderGroups().map((headerGroup) => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map((header) => (
							<th
								key={header.id}
								onClick={header.column.getToggleSortingHandler()}
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
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
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
			<div>
				<button onClick={() => table.setPageIndex(0)}>
					First page
				</button>
				<button
					disabled={!table.getCanPreviousPage()}
					onClick={() => table.previousPage()}
				>
					Previous page
				</button>
				<button
					disabled={!table.getCanNextPage()}
					onClick={() => table.nextPage()}
				>
					Next page
				</button>
				<button
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				>
					Last page
				</button>
			</div>
		</div>
	);
}
