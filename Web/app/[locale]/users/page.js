"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { getDatabase, ref, get, onValue } from "firebase/database";

import { withProtected } from "@/context/Route";
import User from "../../../models/user";
import Table from "@/components/Table";
import Modal from "@/components/Modal";

function Users({ user, cid, role, registration, editUser, deleteUser }) {
	const [data, setData] = useState([]);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [isDeleteConfirmationOpen, setDeleteConfirmationOpen] =
		useState(false);
	const [editModalData, setEditModalData] = useState({});
	const [error, setError] = useState();

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

	useEffect(() => {
		if (user) {
			const db = getDatabase();
			if (role === "owner") {
				const usersRef = ref(db, "users/");
				onValue(usersRef, async (snapshot) => {
					const promises = [];
					snapshot.forEach((childSnapshot) => {
						const childKey = childSnapshot.key;
						const userData = childSnapshot.val();
						promises.push(
							Promise.all([
								get(ref(db, "admin/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "admin" : null
								),
								get(ref(db, "editor/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "editor" : null
								),
								get(ref(db, "viewer/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "viewer" : null
								),
							]).then(([admin, editor, viewer]) => {
								const userRole =
									admin || editor || viewer || "unassigned";
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
				const usersRef = ref(db, "companies/" + cid + "/users");
				onValue(usersRef, async (snapshot) => {
					const promises = [];
					snapshot.forEach((childSnapshot) => {
						const childKey = childSnapshot.key;
						promises.push(
							Promise.all([
								get(ref(db, "admin/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "admin" : null
								),
								get(ref(db, "editor/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "editor" : null
								),
								get(ref(db, "viewer/" + childKey)).then(
									(snapshot) =>
										snapshot.exists() ? "viewer" : null
								),
								get(ref(db, "users/" + childKey)).then(
									(snapshot) => snapshot.val()
								),
							]).then(([admin, editor, viewer, parData]) => {
								const userRole =
									admin || editor || viewer || "unassigned";

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
	}, [user]);

	const commonColumns = [
		{
			header: "Full Name",
			accessorKey: "fullName",
		},
		{
			header: "Email",
			accessorKey: "email",
		},
		{
			header: "Role",
			accessorKey: "role",
		},
		{
			header: "Last Activity",
			accessorKey: "lastActivity",
			cell: (info) =>
				new Date(info.getValue()).toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
		},
	];

	const columns =
		role === "owner"
			? [
					{
						header: "Company",
						accessorKey: "companyId",
					},
					...commonColumns,
			  ]
			: commonColumns;

	return (
		<div className="flex justify-center">
			<Head>
				<title>Users</title>
				<link rel="icon" href="bes_bollmann_icon_white.svg" />
			</Head>
			<div className="w-11/12">
				<Table
					data={data}
					columns={columns}
					onAdd={setAddModalOpen}
					onEdit={handleEditModalOpen}
				/>
			</div>
			{editModalOpen && (
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

			{addModalOpen && (
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
		</div>
	);
}

export default withProtected(Users);
