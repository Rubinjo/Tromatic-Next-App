import * as dotenv from "dotenv"
import fs from "fs"
import md5 from "md5"
import { ref, update } from "firebase/database"

import setupFirebase from "./helper/auth.js"

dotenv.config()

/**
 * Location of folder that will be scanned.
 * @type {string}
 */
const FOLDER = "../sender";

console.log(`Watching for file changes on ${FOLDER}`);

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
let jsonData, jsonString, md5Current

const [db, auth] = await setupFirebase({
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID,
}, process.env.EMAIL, process.env.PASSWORD);

/**
 * Send drychamber values to firebase constantly.
 * Done by watching machine outputted .json files that are located in specified folder location.
 * @param {string} folder - Location of folder that will be watched.
 * @param {string} event - Type of event that happened.
 * @param {string} filename - Name of file that has changed.
 */
fs.watch(FOLDER, (event, filename) => {
  if (filename.split(".").pop() === "json") {
    if (fsWait) return;
    // Debounce function
    // Protection against a file triggering multiple times for a single action
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    // Use MD5 hash for checksum
    // Extra protection against a file triggering multiple times for a single action
    md5Current = md5(fs.readFileSync(FOLDER + "/" + filename));
    if (md5Current === md5Previous) {
      return;
    }
    md5Previous = md5Current;
    console.log(`${filename} file recorded`);
    try {
      jsonString = fs.readFileSync(FOLDER + "/" + filename);
      jsonData = JSON.parse(jsonString)
      const updates = {};
      updates["machines/m" + auth.currentUser.uid + "_" + jsonData.DryChamberID] = {
        DateTimeMessage: jsonData.DateTimeMessage,
        Status: jsonData.Status,
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
        LastEditor: "m" + auth.currentUser.uid + "_" + jsonData.DryChamberID,
        DeviceName: jsonData.DeviceName
      }
      for (let i = 1; i <= jsonData.NumOfWmProbes; i++) {
        updates["machines/m" + auth.currentUser.uid + "_" + jsonData.DryChamberID]["WMValue" + i] = jsonData["WMValue" + i];
        updates["machines/m" + auth.currentUser.uid + "_" + jsonData.DryChamberID]["WMActive" + i] = jsonData["WMActive" + i];
      }
      for (let i = 1; i <= jsonData.NumOfCTProbes; i++) {
        updates["machines/m" + auth.currentUser.uid + "_" + jsonData.DryChamberID]["CTValue" + i] = jsonData["CTValue" + i];
      }
      update(ref(db), updates);
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`${filename} file has no .json extension and is ignored`);
  }
});
