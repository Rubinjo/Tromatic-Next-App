import * as dotenv from "dotenv";
import fs from "fs";
import md5 from "md5";
import { writeBatch, doc } from "firebase/firestore";
import { EventLogger } from "node-windows";

import setupFirebase from "./helper/auth.js";

dotenv.config();

const log = new EventLogger("Tromatic Next Gatherer");

/**
 * Location of folder that will be scanned.
 * @type {string}
 */
const FOLDER = "../../dat";

log.info(`Watching for file changes on ${FOLDER}`, 0);

/**
 * MD5 hash of previous found params in .txt file.
 * @type {string}
 */
let md5Previous = null;

/**
 * Variable to check if timeout period is over.
 * @type {boolean}
 */
let fsWait = false;
let noSpaceFilename,
    textDataArrayPhases,
    textDataArrayHeader,
    textDataArray,
    textData,
    textString,
    md5Current;

const { firestore } = await setupFirebase(
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

/**
 * Process data from .dat file and send it to firebase.
 * @param {string} filename - Name of file that has changed.
 */
function processData(filename) {
    if (filename.split(".").pop() === "dat") {
        if (fsWait) return;
        // Debounce function
        // Protection against a file triggering multiple times for a single action
        fsWait = setTimeout(() => {
            fsWait = false;
        }, 100);
        // Use MD5 hash for checksum
        // Extra protection against a file triggering multiple times for a single action
        md5Current = md5(fs.readFileSync(`${FOLDER}/${filename}`));
        if (md5Current === md5Previous) {
            return;
        }
        md5Previous = md5Current;
        log.info(`${filename} file recorded`, 0);
        try {
            textString = fs.readFileSync(`${FOLDER}/${filename}`);
            textData = textString.toString();
            textDataArray = textData.split("$");
            if (textDataArray.length === 2) {
                noSpaceFilename = filename.replace(/ /g, "_");
                textDataArrayHeader = textDataArray[0].split("|");
                textDataArrayPhases = textDataArray[1].split("|");
                const batch = writeBatch(firestore);
                batch.set(
                    doc(
                        firestore,
                        "companies",
                        process.env.CID,
                        noSpaceFilename,
                        "header"
                    ),
                    {
                        version: textDataArrayHeader[0].trim(),
                        dialog: textDataArrayHeader[1].trim(),
                        programType: textDataArrayHeader[2].trim(),
                        woodType: textDataArrayHeader[3].trim(),
                        botanicWoodType: textDataArrayHeader[4].trim(),
                        woodIDNumber: textDataArrayHeader[5].trim(),
                        woodGroup: textDataArrayHeader[6].trim(),
                        woodThickness: textDataArrayHeader[7].trim(),
                        startMoisture: textDataArrayHeader[8].trim(),
                        switchoffMoisture: textDataArrayHeader[9].trim(),
                        dryingTime: textDataArrayHeader[10].trim(),
                        woodDensity: textDataArrayHeader[11].trim(),
                        driedWeight: textDataArrayHeader[12].trim(),
                        amountOfWood: textDataArrayHeader[13].trim(),
                        woodSaturationPointDensity:
                            textDataArrayHeader[14].trim(),
                        numberOfPhases: textDataArrayHeader[15].trim(),
                        programEditStatus: textDataArrayHeader[16].trim(),
                        continent: textDataArrayHeader[17].trim(),
                    }
                );
                for (let i = 0; i < textDataArrayPhases.length / 18 - 1; i++) {
                    batch.set(
                        doc(
                            firestore,
                            "companies",
                            process.env.CID,
                            noSpaceFilename,
                            "phases",
                            "list",
                            i.toString()
                        ),
                        {
                            phaseType: textDataArrayPhases[i * 18 + 0].trim(),
                            phaseRunTime:
                                textDataArrayPhases[i * 18 + 1].trim(),
                            phaseEndWoodMoisture:
                                textDataArrayPhases[i * 18 + 2].trim(),
                            phaseEndPotential:
                                textDataArrayPhases[i * 18 + 3].trim(),
                            phaseEndUGL: textDataArrayPhases[i * 18 + 4].trim(),
                            phaseEndTemperature:
                                textDataArrayPhases[i * 18 + 5].trim(),
                            phaseEndRPM: textDataArrayPhases[i * 18 + 6].trim(),
                            phaseEndPhantom:
                                textDataArrayPhases[i * 18 + 7].trim(),
                            phaseHeating:
                                textDataArrayPhases[i * 18 + 8].trim(),
                            phaseHatch: textDataArrayPhases[i * 18 + 9].trim(),
                            phaseSpray: textDataArrayPhases[i * 18 + 10].trim(),
                            phaseOptionalRelais1:
                                textDataArrayPhases[i * 18 + 11].trim(),
                            phaseOptionalRelais2:
                                textDataArrayPhases[i * 18 + 12].trim(),
                            phaseOptionalRelais3:
                                textDataArrayPhases[i * 18 + 13].trim(),
                            phaseID: textDataArrayPhases[i * 18 + 14].trim(),
                            phaseHeatingValue:
                                textDataArrayPhases[i * 18 + 15].trim(),
                            phaseHatchValue:
                                textDataArrayPhases[i * 18 + 16].trim(),
                            phaseSprayValue:
                                textDataArrayPhases[i * 18 + 17].trim(),
                        }
                    );
                }
                batch.commit();
            } else {
                log.warn(
                    `${filename} file has incorrect format and is ignored`,
                    1630
                );
            }
        } catch (e) {
            const errorMessage = typeof e === "string" ? e : e.message;
            log.error(errorMessage, 58);
        }
    } else {
        log.warn(`${filename} file has no .dat extension and is ignored`, 1630);
    }
}

// Get all current files in the directory
const oldFiles = fs.readdirSync(FOLDER);

// Process each .dat file
oldFiles.forEach((file) => {
    processData(file);
});

/**
 * Send dryprograms values to firebase constantly.
 * Done by watching .dat files that are located in specified folder location.
 * @param {string} folder - Location of folder that will be watched.
 * @param {string} event - Type of event that happened.
 * @param {string} filename - Name of file that has changed.
 */
fs.watch(FOLDER, (event, filename) => {
    processData(filename);
});
