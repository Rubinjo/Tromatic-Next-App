"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import { getDatabase, ref, onValue, get } from "firebase/database";

import { withProtected } from "@/context/Route";
import Machine from "../../../models/machine";
import Status from "../../../models/status";
import Table from "@/components/Table";

function Machines({ user, role, cid }) {
	const [data, setData] = useState([]);

	useEffect(() => {
		if (user) {
			const db = getDatabase();
			if (role === "owner") {
				const companyRef = ref(db, "companies/");
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
										db,
										"machines/" + key + "/DeviceName"
									);
									const remainingTimeRef = ref(
										db,
										"machines/" + key + "/RemainingTime"
									);
									const statusRef = ref(
										db,
										"machines/" + key + "/Status"
									);
									const dateTimeMessageRef = ref(
										db,
										"machines/" + key + "/DateTimeMessage"
									);
									const lastEditorRef = ref(
										db,
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
									machine.dateTimeMessage = results[3].val();
									const lastEditorId = results[4].val();
									if (lastEditorId === key) {
										machine.lastEditor =
											machine.machineName;
									} else {
										const lastEditorUserRef = ref(
											db,
											"users/" +
												lastEditorId +
												"/fullName"
										);
										machine.lastEditor = (
											await get(lastEditorUserRef)
										).val();
									}

									// Find the machine index in the fetchedData array
									const machineIndex = fetchedData.findIndex(
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
				const machinesRef = ref(db, "companies/" + cid + "/machines");
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
										db,
										"machines/" + childKey + "/DeviceName"
									)
								).then((snapshot) => {
									return snapshot.val();
								}),
								get(
									ref(
										db,
										"machines/" +
											childKey +
											"/RemainingTime"
									)
								).then((snapshot) => {
									return true ? snapshot.val() : false;
								}),
								get(
									ref(db, "machines/" + childKey + "/Status")
								).then((snapshot) => {
									return new Status(snapshot.val())
										.statusStrings;
								}),
								get(
									ref(
										db,
										"machines/" +
											childKey +
											"/DateTimeMessage"
									)
								).then((snapshot) => {
									return snapshot.val();
								}),
								get(
									ref(
										db,
										"machines/" + childKey + "/LastEditor"
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
												db,
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
							machineList.filter((machine) => machine !== null)
						);
					});
				});
			}
		}
	}, [user]);

	const commonColumns = [
		{
			header: "Active",
			accessorKey: "active",
		},
		{
			header: "ID",
			accessorKey: "id",
		},
		{
			header: "Display Name",
			accessorKey: "machineName",
		},
		{
			header: "Status Code",
			accessorKey: "status",
		},
		{
			header: "Last Editor",
			accessorKey: "lastEditor",
		},
		{
			header: "Last Edited",
			accessorKey: "dateTimeMessage",
			cell: (info) =>
				new Date(info.getValue()).toLocaleDateString(undefined, {
					year: "numeric",
					month: "long",
					day: "numeric",
				}),
		},
		{
			header: "Creation",
			accessorKey: "creation",
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
				<title>Machines</title>
				<link rel="icon" href="bes_bollmann_icon_white.svg" />
			</Head>
			<div className="w-11/12">
				<Table data={data} columns={columns} />
			</div>
		</div>
	);
}

export default withProtected(Machines);
