import * as dotenv from "dotenv";
import fs from "fs";
import { ref, onValue, get } from "firebase/database";
import { EventLogger } from "node-windows";

import setupFirebase from "./helper/auth.js";

dotenv.config();

const log = new EventLogger("Tromatic Next Receiver");

let mids;

function sendData(mid, dateTime, lastEditor, changeItem, changeValue) {
	const machineData = {
		DryChamberID: mid,
		DateTimeMessage: dateTime.toISOString(),
		LastEditor: lastEditor,
	};
	if (changeItem === "RemainingTime") {
		machineData["stop_program"] = true;
	} else {
		machineData[changeItem] = changeValue;
	}
	const jsonString = JSON.stringify(machineData);
	fs.writeFile(
		"../receiver/" +
			mid +
			"_" +
			dateTime.toJSON().slice(0, 19).replaceAll(":", "-") +
			".json",
		jsonString,
		function (e) {
			if (e) {
				log.error(e, 82);
			} else {
				log.info(mid + ".json was added/updated", 0);
			}
		}
	);
}

const [db, auth] = await setupFirebase(
	{
		apiKey: process.env.APIKEY,
		authDomain: process.env.AUTHDOMAIN,
		databaseURL: process.env.DATABASEURL,
		projectId: process.env.PROJECTID,
		storageBucket: process.env.STORAGEBUCKET,
		messagingSenderId: process.env.MESSAGINGSENDERID,
		appId: process.env.APPID,
	},
	process.env.EMAIL,
	process.env.PASSWORD
);

try {
	onValue(
		ref(db, "companies/" + process.env.CID + "/machines"),
		(snapshot) => {
			const machines = snapshot.val();
			mids = Object.keys(machines);
			for (const mid of mids) {
				for (const changeItem of [
					"RemainingTime",
					"TempOffset",
					"EMCOffset",
					"WMActive1",
					"WMActive2",
					"WMActive3",
					"WMActive4",
					"WMActive5",
					"WMActive6",
					"WMActive7",
					"WMActive8",
					"WMActive9",
				]) {
					onValue(
						ref(db, "machines/" + mid + "/" + changeItem),
						async (snapshot) => {
							const changeValue = snapshot.val();
							const lastEditor = (
								await get(
									ref(db, "machines/" + mid + "/LastEditor")
								)
							).val();
							if (lastEditor.startsWith("u")) {
								sendData(
									mid.split("_").slice(-1)[0],
									new Date(),
									lastEditor,
									changeItem,
									changeValue
								);
							} else {
								log.info(
									"Registered update was not from user",
									0
								);
							}
						}
					);
				}
			}
		}
	);
} catch (e) {
	log.error(e, 58);
}
