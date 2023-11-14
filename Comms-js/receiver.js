import * as dotenv from "dotenv";
import fs from "fs";
import { ref, onValue, get } from "firebase/database";
import { EventLogger } from "node-windows";

import setupFirebase from "./helper/auth.js";

dotenv.config();

const valuesToWatch = [
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
];

const log = new EventLogger("Tromatic Next Receiver");

let mids;

function sendData(mid, dateTime, lastEditor, changedDict) {
	const machineData = {
		DryChamberID: mid,
		DateTimeMessage: dateTime.toISOString(),
		LastEditor: lastEditor,
	};
	if (changedDict.hasOwnProperty("RemainingTime")) {
		machineData["stop_program"] = true;
		delete changedDict["RemainingTime"];
	}
	const jsonString = JSON.stringify(
		{ ...machineData, ...changedDict },
		null,
		" "
	);
	fs.writeFile(
		`../receiver/${mid}_${dateTime
			.toJSON()
			.slice(0, 19)
			.replaceAll(":", "-")}.json`,
		jsonString,
		function (e) {
			if (e) {
				log.error(e, 82);
			} else {
				log.info(`${mid}.json was added/updated`, 0);
			}
		}
	);
}

// Function to get the keys with changed values
function getChangedValues(previousData, currentData) {
	const changedValues = {};

	for (const key in currentData) {
		if (
			currentData.hasOwnProperty(key) &&
			previousData[key] !== currentData[key]
		) {
			changedValues[key] = currentData[key];
		}
	}

	return changedValues;
}

function filterDictionaryByKeys(dictionary) {
	const result = {};

	for (const key of valuesToWatch) {
		if (key in dictionary) {
			result[key] = dictionary[key];
		}
	}

	return result;
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
	onValue(ref(db, `companies/${process.env.CID}/machines`), (snapshot) => {
		const machines = snapshot.val();
		mids = Object.keys(machines);
		for (const mid of mids) {
			let previousMachineData = null;
			onValue(ref(db, `machines/${mid}`), async (snapshot) => {
				const machineData = snapshot.val();
				// Check if this is not the first invocation
				if (previousMachineData !== null) {
					const lastEditor = machineData.LastEditor;
					if (lastEditor.startsWith("u")) {
						const changedValues = getChangedValues(
							previousMachineData,
							machineData
						);
						const filteredData =
							filterDictionaryByKeys(changedValues);
						if (Object.keys(filteredData).length !== 0) {
							const uid = lastEditor
								.split("_")
								.slice(0)[0]
								.slice(1);
							const fullName = (
								await get(ref(db, `users/${uid}/fullName`))
							).val();
							sendData(
								mid.split("_").slice(-1)[0],
								new Date(),
								fullName,
								filteredData
							);
						}
					} else {
						log.info("Registered update was not from user", 0);
					}
				}
				// Update the previous state with the current state for the next invocation
				previousMachineData = machineData;
			});
		}
	});
} catch (e) {
	log.error(e, 58);
}
