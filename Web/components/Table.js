import React, { useState } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";

import Modal from "@/components/Modal";

export default function Table({ data, columns, onAdd }) {
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState("");
	const [modalOpen, setModalOpen] = useState(false);
	const [putData, setPutData] = useState(null);

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

	const handleModalOpen = (data) => {
		console.log(data);
		setPutData(data);
		setModalOpen(true);
	};

	const handleModalClose = () => {
		setModalOpen(false);
		setPutData(null);
	};

	return (
		<div className="relative overflow-x-auto sm:rounded">
			<div className="flex p-2 justify-end">
				<label htmlFor="add" className="sr-only">
					Add
				</label>
				<div className="relative mt-1">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<FaPlus
							className="w-4 h-4 text-green-200"
							aria-hidden="true"
						/>
					</div>
					<button
						id="add"
						type="button"
						className="block py-2 pl-4 mr-5 text-sm text-green-200 transition-colors bg-green-600 rounded-lg w-24 focus:shadow-outline hover:bg-green-700"
						onClick={onAdd}
					>
						ADD
					</button>
				</div>
				<label htmlFor="table-search" className="sr-only">
					Search
				</label>
				<div className="relative mt-1">
					<div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
						<FaMagnifyingGlass
							className="w-4 h-4 text-gray-400"
							aria-hidden="true"
						/>
					</div>
					<input
						id="table-search"
						type="text"
						placeholder="Search"
						className="block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-secondary focus:border-secondary"
						value={filtering}
						onChange={(e) => setFiltering(e.target.value)}
					/>
				</div>
			</div>
			<table className="w-full text-sm text-left shadow-md">
				<thead className="w-full text-xs text-white uppercase bg-primary">
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th
									key={header.id}
									onClick={header.column.getToggleSortingHandler()}
									scope="col"
									className="px-6 py-3"
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
							onClick={() => handleModalOpen(row.original)}
							className="bg-white border-b text-gray-700"
						>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id} className="px-6 py-4">
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
			<div className="text-center flex justify-center text-sm">
				<button
					className="px-4 py-2 my-4 shadow text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-l"
					onClick={() => table.setPageIndex(0)}
				>
					First page
				</button>
				<button
					className={
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
					className={
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
					className="px-4 py-2 my-4 shadow text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-r"
					onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				>
					Last page
				</button>
			</div>
			{modalOpen && putData && (
				<Modal
					isOpen={modalOpen}
					handleClose={() => handleModalClose()}
				>
					<div className="flex flex-col justify-between h-full w-full">
						<form>
							<label for="externalID">Edit Machine</label>
						</form>
					</div>
				</Modal>
			)}
		</div>
	);
}
