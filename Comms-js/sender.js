import * as dotenv from "dotenv";
import fs from "fs";
import md5 from "md5";
import { ref, update, get, set, serverTimestamp } from "firebase/database";
import { EventLogger } from "node-windows";

import setupFirebase from "./helper/auth.js";

dotenv.config();

const log = new EventLogger("Tromatic Next Sender");

/**
 * Location of folder that will be scanned.
 * @type {string}
 */
const FOLDER = "../sender";

log.info(`Watching for file changes on ${FOLDER}`, 0);

/**
 * MD5 hash of previous found params in .txt file.
 * @type {string}
 */
let md5Previous = null;

let oldStatus = 1;
let newStatus = 0;
let numStatusChanges = 0;

const { auth, db } = await setupFirebase(
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

const registeredMachines = [];

function waitForStableFile(filePath, stableTime = 1000, checkInterval = 500) {
    return new Promise((resolve, reject) => {
        let lastSize = -1;
        let stableCounter = 0;

        const interval = setInterval(() => {
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    clearInterval(interval);
                    return reject(err);
                }

                if (stats.size === lastSize) {
                    stableCounter += checkInterval;
                    if (stableCounter >= stableTime) {
                        clearInterval(interval);
                        resolve(true);
                    }
                } else {
                    lastSize = stats.size;
                    stableCounter = 0;
                }
            });
        }, checkInterval);
    });
}

/**
 * Send drychamber values to firebase constantly.
 * Done by watching machine outputted .json files that are located in specified folder location.
 * @param {string} folder - Location of folder that will be watched.
 * @param {string} event - Type of event that happened.
 * @param {string} filename - Name of file that has changed.
 */
fs.watch(FOLDER, async (event, filename) => {
    if (filename.split(".").pop() === "json") {
        const filePath = `${FOLDER}/${filename}`;

        // Wait for file size to stabilize
        await waitForStableFile(filePath);

        const fileContent = fs.readFileSync(filePath);

        // Use MD5 hash for checksum
        // Extra protection against a file triggering multiple times for a single action
        const md5Current = md5(fileContent);
        if (md5Current === md5Previous) return;
        md5Previous = md5Current;
        log.info(`${filename} file recorded`, 0);
        try {
            const jsonData = JSON.parse(fileContent);
            if (newStatus === jsonData.Status) {
                numStatusChanges++;
                if (numStatusChanges > 2) {
                    oldStatus = newStatus;
                }
            } else {
                newStatus = jsonData.Status;
                numStatusChanges = 0;
            }
            if (
                !registeredMachines.includes(
                    `m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                )
            ) {
                get(
                    ref(
                        db,
                        `companies/${process.env.CID}/machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                    )
                ).then((snapshot) => {
                    if (snapshot.exists()) {
                        update(
                            ref(
                                db,
                                `companies/${process.env.CID}/machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                            ),
                            {
                                lastRestart: serverTimestamp(),
                            }
                        );
                    } else {
                        set(
                            ref(
                                db,
                                `companies/${process.env.CID}/machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                            ),
                            {
                                creation: serverTimestamp(),
                                type: "Demo",
                            }
                        );
                    }
                });

                registeredMachines.push(
                    `m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                );
            }
            const updates = {};
            updates[
                `machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
            ] = {
                CID: process.env.CID,
                DateTimeMessage: jsonData.DateTimeMessage,
                Status: oldStatus,
                CurrentTemp: jsonData.CurrentTemp,
                SetPointTemp: jsonData.SetPointTemp,
                CurrentHum: jsonData.CurrentHum,
                SetPointHum: jsonData.SetPointHum,
                RemainingTime: jsonData.RemainingTime,
                TotalTime: jsonData.TotalTime,
                NumOfWmProbes: jsonData.NumOfWmProbes,
                HeatingValvePos: jsonData.HeatingValvePos,
                DamperPos: jsonData.DamperPos,
                SprayPos: jsonData.SprayPos,
                RPM: jsonData.RPM,
                FanDirection: jsonData.FanDirection,
                TempOffset: jsonData.TempOffset,
                EMCOffset: jsonData.EMCOffset,
                NumOfCTProbes: jsonData.NumOfCTProbes,
                DamperOpMode: jsonData.DamperOpMode,
                HeaterOpMode: jsonData.HeaterOpMode,
                SprayOpMode: jsonData.SprayOpMode,
                FansOpMode: jsonData.FansOpMode,
                LastEditor: `m${auth.currentUser.uid}_${jsonData.DryChamberID}`,
                DeviceName: jsonData.DeviceName,
                CurrentPhase: jsonData.CurrentPhase,
                NumOfPhases: jsonData.NumOfPhases,
                PhaseType: jsonData.PhaseType,
                AppInputBlocked: jsonData.AppInputBlocked,
            };
            for (let i = 1; i <= jsonData.NumOfWmProbes; i++) {
                updates[
                    `machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                ][`WMValue${i}`] = jsonData[`WMValue${i}`];
                updates[
                    `machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                ][`WMActive${i}`] = jsonData[`WMActive${i}`];
            }
            for (let i = 1; i <= jsonData.NumOfCTProbes; i++) {
                updates[
                    `machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                ][`CTValue${i}`] = jsonData[`CTValue${i}`];
            }
            if (jsonData.CurrentWM) {
                updates[
                    `machines/m${auth.currentUser.uid}_${jsonData.DryChamberID}`
                ]["CurrentWM"] = jsonData.CurrentWM;
            }
            update(ref(db), updates);
        } catch (e) {
            const errorMessage =
                typeof e === "string" ? e : e.message || JSON.stringify(e);
            log.error(errorMessage, 58);
        }
    } else {
        log.warn(
            `${filename} file has no .json extension and is ignored`,
            1630
        );
    }
});
