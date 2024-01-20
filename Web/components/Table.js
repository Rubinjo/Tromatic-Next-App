"use client";

import React, { useState, useEffect } from "react";
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	getPaginationRowModel,
	getSortedRowModel,
	getFilteredRowModel,
} from "@tanstack/react-table";
import { FaPlus, FaMagnifyingGlass } from "react-icons/fa6";
import { ref, get, onValue } from "firebase/database";

import Modal from "./Modal";
import { firebase } from "@/firebase";
import { withProtected } from "@/context/Route";
import Machine from "@/models/machine";
import Status from "@/models/status";
import User from "@/models/user";

const Table = ({
	user,
	cid,
	role,
	registration,
	editUser,
	deleteUser,
	type,
	commonColumns,
}) => {
	const [data, setData] = useState([]);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
		useState(false);
	const [editModalData, setEditModalData] = useState({});
	const [error, setError] = useState();
	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState("");

	let columns =
		role === "owner"
			? [
					{
						header: "Company",
						accessorKey: "companyId",
					},
					...commonColumns,
			  ]
			: commonColumns;

	columns =
		type === "machines"
			? [
					{
						header: "Last Edited",
						accessorKey: "dateTimeMessage",
						cell: (info) =>
							new Date(info.getValue()).toLocaleDateString(
								undefined,
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							),
					},
					{
						header: "Creation",
						accessorKey: "creation",
						cell: (info) =>
							new Date(info.getValue()).toLocaleDateString(
								undefined,
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							),
					},
					...columns,
			  ]
			: [
					{
						header: "Last Activity",
						accessorKey: "lastActivity",
						cell: (info) => (
							"use server",
							new Date(info.getValue()).toLocaleDateString(
								undefined,
								{
									year: "numeric",
									month: "long",
									day: "numeric",
								}
							)
						),
					},
					...columns,
			  ];

	useEffect(() => {
		if (user) {
			if (type === "machines") {
				if (role === "owner") {
					const companyRef = ref(firebase, "companies/");
					onValue(companyRef, (snapshot) => {
						const fetchedData = [];
						snapshot.forEach((childSnapshot) => {
							const companyKey = childSnapshot.key;
							const companyVal = childSnapshot
								.child("machines")
								.val();
							companyVal &&
								Object.entries(companyVal).forEach(
									async ([key, value]) => {
										const machine = new Machine({
											id: key,
											companyId: companyKey,
											creation: value.Creation,
										});
										const machineNameRef = ref(
											firebase,
											"machines/" + key + "/DeviceName"
										);
										const remainingTimeRef = ref(
											firebase,
											"machines/" + key + "/RemainingTime"
										);
										const statusRef = ref(
											firebase,
											"machines/" + key + "/Status"
										);
										const dateTimeMessageRef = ref(
											firebase,
											"machines/" +
												key +
												"/DateTimeMessage"
										);
										const lastEditorRef = ref(
											firebase,
											"machines/" + key + "/LastEditor"
										);
										const results = await Promise.all([
											get(machineNameRef),
											get(remainingTimeRef),
											get(statusRef),
											get(dateTimeMessageRef),
											get(lastEditorRef),
										]);

										machine.machineName = results[0].val();
										machine.active = true
											? results[1].val()
											: false;
										machine.status = new Status(
											results[2].val()
										).statusStrings;
										machine.dateTimeMessage =
											results[3].val();
										const lastEditorId = results[4].val();
										if (lastEditorId === key) {
											machine.lastEditor =
												machine.machineName;
										} else {
											const lastEditorUserRef = ref(
												firebase,
												"users/" +
													lastEditorId +
													"/fullName"
											);
											machine.lastEditor = (
												await get(lastEditorUserRef)
											).val();
										}

										// Find the machine index in the fetchedData array
										const machineIndex =
											fetchedData.findIndex(
												(m) => m.id === key
											);

										// If the machine is found in the array, update it; otherwise, push it
										if (machineIndex !== -1) {
											fetchedData[machineIndex] = machine;
										} else {
											fetchedData.push(machine);
										}
										setData([...fetchedData]);
									}
								);
						});
					});
				} else {
					const machinesRef = ref(
						firebase,
						"companies/" + cid + "/machines"
					);
					onValue(machinesRef, async (snapshot) => {
						const fetchedData = [];
						const promises = [];
						console.log(snapshot.val());

						snapshot.forEach((childSnapshot) => {
							const childKey = childSnapshot.key;
							const childData = childSnapshot.val();

							promises.push(
								Promise.all([
									get(
										ref(
											firebase,
											"machines/" +
												childKey +
												"/DeviceName"
										)
									).then((snapshot) => {
										return snapshot.val();
									}),
									get(
										ref(
											firebase,
											"machines/" +
												childKey +
												"/RemainingTime"
										)
									).then((snapshot) => {
										return true ? snapshot.val() : false;
									}),
									get(
										ref(
											firebase,
											"machines/" + childKey + "/Status"
										)
									).then((snapshot) => {
										return new Status(snapshot.val())
											.statusStrings;
									}),
									get(
										ref(
											firebase,
											"machines/" +
												childKey +
												"/DateTimeMessage"
										)
									).then((snapshot) => {
										return snapshot.val();
									}),
									get(
										ref(
											firebase,
											"machines/" +
												childKey +
												"/LastEditor"
										)
									).then((snapshot) => {
										return snapshot.val();
									}),
								]).then(
									async ([
										machineName,
										active,
										status,
										dateTimeMessage,
										lastEditor,
									]) => {
										if (lastEditor === childKey) {
											lastEditor = machineName;
										} else {
											lastEditor = (
												await get(
													firebase,
													`users/${lastEditor}/fullName`
												)
											).val();
										}
										return new Machine({
											id: childKey,
											companyId: cid,
											machineName: machineName,
											creation: childData.Creation,
											active: active,
											status: status,
											dateTimeMessage: dateTimeMessage,
											lastEditor: lastEditor,
										});
									}
								)
							);
						});
						await Promise.all(promises).then((machineList) => {
							setData(
								machineList.filter(
									(machine) => machine !== null
								)
							);
						});
					});
				}
			} else if (type === "users") {
				if (role === "owner") {
					const usersRef = ref(firebase, "users/");
					onValue(usersRef, async (snapshot) => {
						const promises = [];
						snapshot.forEach((childSnapshot) => {
							const childKey = childSnapshot.key;
							const userData = childSnapshot.val();
							promises.push(
								Promise.all([
									get(
										ref(firebase, "admin/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "admin" : null
									),
									get(
										ref(firebase, "editor/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "editor" : null
									),
									get(
										ref(firebase, "viewer/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "viewer" : null
									),
								]).then(([admin, editor, viewer]) => {
									const userRole =
										admin ||
										editor ||
										viewer ||
										"unassigned";
									return new User(
										childKey,
										userData.cid,
										userRole,
										userData.email,
										userData.fullName,
										userData.lastActivity
									);
								})
							);
						});

						await Promise.all(promises).then((userList) => {
							setData(userList.filter((user) => user !== null));
						});
					});
				} else {
					const usersRef = ref(
						firebase,
						"companies/" + cid + "/users"
					);
					onValue(usersRef, async (snapshot) => {
						const promises = [];
						snapshot.forEach((childSnapshot) => {
							const childKey = childSnapshot.key;
							promises.push(
								Promise.all([
									get(
										ref(firebase, "admin/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "admin" : null
									),
									get(
										ref(firebase, "editor/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "editor" : null
									),
									get(
										ref(firebase, "viewer/" + childKey)
									).then((snapshot) =>
										snapshot.exists() ? "viewer" : null
									),
									get(
										ref(firebase, "users/" + childKey)
									).then((snapshot) => snapshot.val()),
								]).then(([admin, editor, viewer, parData]) => {
									const userRole =
										admin ||
										editor ||
										viewer ||
										"unassigned";

									return new User(
										childKey,
										cid,
										userRole,
										parData.email,
										parData.fullName,
										parData.lastActivity
									);
								})
							);
						});

						Promise.all(promises).then((userList) => {
							setData(userList.filter((user) => user !== null));
						});
					});
				}
			}
		}
	}, [user]);

	const handleDeleteUser = async () => {
		try {
			await deleteUser(editModalData);
			setEditModalOpen(false);
			setDeleteConfirmationOpen(false);
		} catch (error) {
			setError(() => {
				throw error;
			});
		}
	};

	const handleEditUser = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData(event.target);
			const values = Object.fromEntries(formData);

			const isRoleChanged = values.role !== editModalData.role;
			const isFullNameChanged =
				values.fullName !== editModalData.fullName;
			const isEmailChanged = values.email !== editModalData.email;
			const isCompanyIdChanged =
				values.companyId !== editModalData.companyId;
			if (
				isRoleChanged ||
				isFullNameChanged ||
				isEmailChanged ||
				isCompanyIdChanged
			) {
				const updatedUserData = {
					id: editModalData.id,
					role: isRoleChanged ? values.role : editModalData.role,
					fullName: isFullNameChanged
						? values.fullName
						: editModalData.fullName,
					email: isEmailChanged ? values.email : editModalData.email,
					companyId: isCompanyIdChanged
						? values.companyId
						: editModalData.companyId,
				};

				await editUser(updatedUserData, editModalData);

				// Update the user data in the state with the edited values
				setData((prevData) =>
					prevData.map((user) =>
						user.id === editModalData.id
							? { ...user, ...updatedUserData }
							: user
					)
				);
			}
		} catch (error) {
			console.log(error);
			setError(() => {
				throw error;
			});
		}
	};

	const handleEditModalOpen = (data) => {
		setEditModalData(data);
		setEditModalOpen(true);
	};

	const handleAddUser = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData(event.target);
			const values = Object.fromEntries(formData);
			await registration(
				values.companyId || cid,
				values.fullName,
				values.email,
				values.role
			);
		} catch (error) {
			setError(() => {
				throw error;
			});
		}
	};

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
		<>
			<div className="relative overflow-x-auto sm:rounded">
				<div className="flex p-2 justify-end">
					{type === "users" && setAddModalOpen && (
						<div className="relative mt-1">
							<label htmlFor="add" className="sr-only">
								Add
							</label>
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
								onClick={() => setAddModalOpen(true)}
							>
								ADD
							</button>
						</div>
					)}
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
												header.column.getIsSorted() ??
													null
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
								onClick={() =>
									type === "users" &&
									handleEditModalOpen &&
									handleEditModalOpen(row.original)
								}
								className={`bg-white border-b text-gray-700 ${
									type === "users" &&
									handleEditModalOpen &&
									"cursor-pointer"
								}`}
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
						onClick={() =>
							table.setPageIndex(table.getPageCount() - 1)
						}
					>
						Last page
					</button>
				</div>
			</div>
			{type === "users" && editModalOpen && (
				<Modal
					isOpen={editModalOpen}
					handleClose={() => setEditModalOpen(false)}
				>
					<div className="flex justify-between h-full w-full">
						<form
							onSubmit={handleEditUser}
							className="flex flex-col w-full mx-8"
						>
							<div className="flex flex-row justify-between my-4">
								<h1 className="text-3xl font-semibold text-gray-900 ">
									Edit User
								</h1>
								<button
									onClick={() => setEditModalOpen(false)}
									className="py-2 px-8 self-end font-bold border rounded"
								>
									Close
								</button>
							</div>
							{role === "owner" && (
								<div className="my-4">
									<label
										htmlFor="companyId"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Company ID
									</label>
									<input
										type="text"
										id="companyId"
										name="companyId"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
										defaultValue={editModalData.companyId}
									/>
								</div>
							)}
							<div className="my-4">
								<label
									htmlFor="fullName"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Full Name
								</label>
								<input
									type="text"
									id="fullName"
									name="fullName"
									className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
										role !== "owner"
											? "cursor-not-allowed"
											: ""
									}`}
									defaultValue={editModalData.fullName}
									disabled={role !== "owner"}
								/>
							</div>
							<div className="my-4">
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
										role !== "owner"
											? "cursor-not-allowed"
											: ""
									}`}
									defaultValue={editModalData.email}
									disabled={role !== "owner"}
								/>
							</div>
							<div className="my-4">
								<label
									htmlFor="roles"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Role
								</label>
								<select
									id="roles"
									name="role"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									defaultValue={editModalData.role}
								>
									<option value="admin">Admin</option>
									<option value="editor">Editor</option>
									<option value="viewer">Viewer</option>
									<option value="unassigned">
										Unassigned
									</option>
								</select>
							</div>
							{isDeleteConfirmationOpen ? (
								<div className="flex flex-col justify-center items-center my-8">
									<p>
										Are you sure you want to delete this
										user?
									</p>
									<div className="flex flex-row justify-center">
										<button
											type="button"
											onClick={() => {
												setDeleteConfirmationOpen(
													false
												);
											}}
											className="text-white bg-gray-400 hover:bg-gray-500 focus:ring-2 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
										>
											Cancel
										</button>
										<button
											type="button"
											onClick={handleDeleteUser}
											className="text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
										>
											Confirm Delete
										</button>
									</div>
								</div>
							) : (
								<div className="flex flex-col my-8">
									<button
										type="submit"
										className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-24 my-2"
									>
										Edit
									</button>
									<button
										type="button"
										onClick={() =>
											setDeleteConfirmationOpen(true)
										}
										className="text-white bg-red-500 hover:bg-red-600 focus:ring-2 focus:outline-none focus:ring-red-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-24 my-2"
									>
										Delete
									</button>
								</div>
							)}
						</form>
					</div>
				</Modal>
			)}

			{type === "users" && addModalOpen && (
				<Modal
					isOpen={addModalOpen}
					handleClose={() => setAddModalOpen(false)}
				>
					<div className="flex justify-between h-full w-full">
						<form
							onSubmit={handleAddUser}
							className="flex flex-col w-full mx-8"
						>
							<div className="flex flex-row justify-between my-4">
								<h1 className="text-3xl font-semibold text-gray-900 ">
									Add User
								</h1>
								<button
									onClick={() => setAddModalOpen(false)}
									className="py-2 px-8 self-end font-bold border rounded"
								>
									Close
								</button>
							</div>
							{role === "owner" && (
								<div className="my-4">
									<label
										htmlFor="companyId"
										className="block mb-2 text-sm font-medium text-gray-900"
									>
										Company ID
									</label>
									<input
										type="text"
										id="companyId"
										name="companyId"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									/>
								</div>
							)}
							<div className="my-4">
								<label
									htmlFor="fullName"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Full Name
								</label>
								<input
									type="text"
									id="fullName"
									name="fullName"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								/>
							</div>
							<div className="my-4">
								<label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
								/>
							</div>
							<div className="my-4">
								<label
									htmlFor="roles"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Role
								</label>
								<select
									id="roles"
									name="role"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
									defaultValue="viewer"
								>
									<option value="admin">Admin</option>
									<option value="editor">Editor</option>
									<option value="viewer">Viewer</option>
									<option value="unassigned">
										Unassigned
									</option>
								</select>
							</div>
							<div className="flex flex-col my-8">
								<button
									type="submit"
									className="text-white bg-green-500 hover:bg-green-600 focus:ring-2 focus:outline-none focus:ring-green-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-24 my-2"
								>
									Add
								</button>
							</div>
						</form>
					</div>
				</Modal>
			)}
		</>
	);
};

export default withProtected(Table);
