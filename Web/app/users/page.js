"use client";

import React, { useState, useEffect } from "react";
import {
	getDatabase,
	ref,
	get,
	onValue,
	remove,
	set,
	serverTimestamp,
} from "firebase/database";

import { withProtected } from "@/context/Route";
import User from "../../models/user";
import Table from "@/components/Table";
import Modal from "@/components/Modal";

function Users({ user }) {
	const [data, setData] = useState([]);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [editModalData, setEditModalData] = useState({});
	const [error, setError] = useState();

	const handleEditUser = async (event) => {
		event.preventDefault();
		try {
			const formData = new FormData(event.target);
			const values = Object.fromEntries(formData);
			if (values.role !== editModalData.role) {
				const db = getDatabase();
				if (editModalData.role !== "Unassigned") {
					const currentRoleRef = ref(
						db,
						editModalData.role + "/" + editModalData.id
					);
					remove(currentRoleRef);
				}
				const newRoleRef = ref(
					db,
					values.role + "/" + editModalData.id
				);
				set(newRoleRef, {
					assignedAt: serverTimestamp(),
				});
				setData((prevData) =>
					prevData.map((user) =>
						user.id === editModalData.id
							? { ...user, role: values.role }
							: user
					)
				);
			}
		} catch (error) {
			setError(() => {
				throw error;
			});
		}
	};

	const handleEditModalOpen = (data) => {
		console.log(data);
		setEditModalData(data);
		setEditModalOpen(true);
	};

	useEffect(() => {
		if (user) {
			const db = getDatabase();
			const userRef = ref(db, "users/" + user.uid + "/cid");
			onValue(userRef, (snapshot) => {
				const cid = snapshot.val();
				const usersRef = ref(db, "companies/" + cid + "/users");
				onValue(usersRef, (snapshot) => {
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
								const role =
									admin || editor || viewer || "unassigned";
								return new User(
									childKey,
									cid,
									role,
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
			});
		}
	}, [user]);

	const columns = [
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

	return (
		<div className="flex justify-center">
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
							className="flex flex-col"
						>
							<div className="mb-6">
								<label
									for="fullName"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Full Name
								</label>
								<input
									type="text"
									id="fullName"
									name="fullName"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
									value={editModalData.fullName}
									disabled
								/>
							</div>
							<div className="mb-6">
								<label
									for="email"
									className="block mb-2 text-sm font-medium text-gray-900"
								>
									Email
								</label>
								<input
									type="email"
									id="email"
									name="email"
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 cursor-not-allowed"
									value={editModalData.email}
									disabled
								/>
							</div>
							<div className="mb-6">
								<label
									for="roles"
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
							<button
								type="submit"
								className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-2 focus:outline-none focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
							>
								Edit
							</button>
						</form>
					</div>
				</Modal>
			)}
			{addModalOpen && (
				<Modal
					isOpen={addModalOpen}
					handleClose={() => setAddModalOpen(false)}
				>
					<div className="flex flex-col justify-between h-full w-full">
						<form>
							<label for="externalID">PC ID:</label>
							<input
								type="text"
								id="externalID"
								name="externalID"
							/>
							<label for="controllerType">Controller type:</label>
							<input
								type="text"
								id="controllerType"
								name="controllerType"
							/>
						</form>
					</div>
				</Modal>
			)}
		</div>
	);
}

export default withProtected(Users);
