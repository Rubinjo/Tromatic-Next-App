"use client";

import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

import { withProtected } from "@/context/Route";
import Machine from "../../../models/machine";
import Status from "../../../models/status";
import Table from "@/components/Table";
import Modal from "@/components/Modal";

function Machines({ user }) {
	const [data, setData] = useState([]);
	const [modalOpen, setModalOpen] = useState(false);

	useEffect(() => {
		if (user) {
			const db = getDatabase();
			const userRef = ref(db, "users/" + user.uid + "/cid");
			onValue(userRef, (snapshot) => {
				const cid = snapshot.val();
				const machinesRef = ref(db, "companies/" + cid + "/machines");
				onValue(machinesRef, (snapshot) => {
					const fetchedData = [];
					snapshot.forEach((childSnapshot) => {
						const childKey = childSnapshot.key;
						const childData = childSnapshot.val();
						const parsRef = ref(db, "machines/" + childKey);
						onValue(parsRef, (snapshot) => {
							const parData = snapshot.val();
							const machineData = new Machine(
								childKey,
								cid,
								parData.DeviceName,
								childData.Creation,
								parData.CurrentHum,
								parData.CurrentTemp,
								parData.DamperPos,
								parData.EMCOffset,
								parData.FanDirection,
								parData.HeatingValvePos,
								parData.NumOfWmProbes,
								parData.RPM,
								parData.RemainingTime,
								parData.TotalTime,
								parData.SetPointHum,
								parData.SetPointTemp,
								parData.SprayPos,
								new Status(parData.Status),
								parData.TempOffset,
								new Date(parData.DateTimeMessage),
								parData.NumOfCTProbes,
								parData.DamperOpMode,
								parData.HeaterOpMode,
								parData.SprayOpMode,
								parData.FansOpMode,
								parData.WMValue1,
								parData.WMValue2,
								parData.WMValue3,
								parData.WMValue4,
								parData.WMValue5,
								parData.WMValue6,
								parData.WMValue7,
								parData.WMValue8,
								parData.WMValue9,
								parData.WMValue10,
								parData.WMActive1,
								parData.WMActive2,
								parData.WMActive3,
								parData.WMActive4,
								parData.WMActive5,
								parData.WMActive6,
								parData.WMActive7,
								parData.WMActive8,
								parData.WMActive9,
								parData.WMActive10,
								parData.CurrentWM,
								parData.CTValue1,
								parData.CTValue2,
								parData.CTValue3,
								parData.CTValue4,
								parData.CTValue5,
								parData.CTValue6,
								parData.CTValue7,
								parData.CTValue8,
								parData.CTValue9,
								parData.CTValue10,
								parData.CTValue11,
								parData.CTValue12
							);
							const index = fetchedData.findIndex(
								(i) => i.id === childKey
							);
							if (index > -1) {
								fetchedData.splice(index, 1, machineData);
							} else {
								fetchedData.push(machineData);
							}
							setData([...fetchedData]);
						});
					});
				});
			});
		}
	}, [user]);

	const columns = [
		{
			header: "ID",
			accessorKey: "id",
		},
		{
			header: "Type",
			accessorKey: "type",
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

	return (
		<div className="flex justify-center">
			<div className="w-11/12">
				<Table
					data={data}
					columns={columns}
					onAdd={() => setModalOpen(true)}
				/>
			</div>
			<div>
				{modalOpen && (
					<Modal
						isOpen={modalOpen}
						handleClose={() => setModalOpen(false)}
					>
						<div className="flex flex-col justify-between h-full w-full">
							<form>
								<label for="externalID">PC ID:</label>
								<input
									type="text"
									id="externalID"
									name="externalID"
								/>
								<label for="controllerType">
									Controller type:
								</label>
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
		</div>
	);
}

export default withProtected(Machines);
