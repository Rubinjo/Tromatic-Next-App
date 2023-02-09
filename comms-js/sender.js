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
const FOLDER = "./folder";

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

const db = await setupFirebase({
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
      update(ref(db, "machines/" + jsonData.DryChamberID), {
        Timestamp: jsonData.DateTimeMessage,
        Status: jsonData.Status,
        CurrentTemp: jsonData.CurrentTemp,
        SetPointTemp: jsonData.SetPointTemp,
        CurrentHum: jsonData.CurrentHum,
        SetPointHum: jsonData.SetPointHum,
        RemainingTime: jsonData.RemainingTime,
        NumOfWmProbes: jsonData.NumOfWmProbes,
        WMValue1: jsonData.WMValue1,
        WMValue2: jsonData.WMValue2,
        WMValue3: jsonData.WMValue3,
        WMValue4: jsonData.WMValue4,
        WMValue5: jsonData.WMValue5,
        WMValue6: jsonData.WMValue6,
        WMValue7: jsonData.WMValue7,
        WMValue8: jsonData.WMValue8,
        WMValue9: jsonData.WMValue9,
        WMValue10: jsonData.WMValue10,
        HeatingValvePos: jsonData.HeatingValvePos,
        DamperPos: jsonData.DamperPos,
        SprayPos: jsonData.SprayPos,
        RPM: jsonData.RPM,
        FanDirection: jsonData.FanDirection,
        TempOffest: jsonData.TempOffest,
        EMCOffset: jsonData.EMCOffset,
        WMActive1: jsonData.WMActive1,
        WMActive2: jsonData.WMActive2,
        WMActive3: jsonData.WMActive3,
        WMActive4: jsonData.WMActive4,
        WMActive5: jsonData.WMActive5,
        WMActive6: jsonData.WMActive6,
        WMActive7: jsonData.WMActive7,
        WMActive8: jsonData.WMActive8,
        WMActive9: jsonData.WMActive9,
        WMActive10: jsonData.WMActive10,
        LastEditor: jsonData.DryChamberID
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`${filename} file has no .json extension and is ignored`);
  }
});
