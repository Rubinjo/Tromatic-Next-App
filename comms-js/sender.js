const fs = require("fs");
const md5 = require("md5");
require("log-timestamp");
const { firebaseConfig } = require("./helper/key");
const { EMAIL, PASSWORD } = require("./helper/login");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, update } = require("firebase/database");

/**
 * Location of folder that will be scanned.
 * @type {string}
 */
const folder = "./folder";

/**
 * @param {{apiKey: string, authDomain: string, databaseUrl: string, projectId: string, storageBucket: string, messagingSenderId: string, appId: string}} firebaseConfig
 * @param {string} email - Email of concerned user
 * @param {string} password - Password of concerned user
 */
function setupFirebase(firebaseConfig, email, password) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    console.error(e.message);
  }
  return getDatabase(app);
}

console.log(`Watching for file changes on ${folder}`);

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

const db = setupFirebase(firebaseConfig, EMAIL, PASSWORD);

/**
 * Send drychamber values to firebase constantly.
 * Done by watching machine outputted .json files that are located in specified folder location.
 * @param {string} folder - Location of folder that will be watched.
 * @param {string} event - Type of event that happened.
 * @param {string} filename - Name of file that has changed.
 */
fs.watch(folder, (event, filename) => {
  if (filename.split(".").pop() === "json") {
    if (fsWait) return;
    // Debounce function
    // Protection against a file triggering multiple times for a single action
    fsWait = setTimeout(() => {
      fsWait = false;
    }, 100);
    // Use MD5 hash for checksum
    // Extra protection against a file triggering multiple times for a single action
    md5Current = md5(fs.readFileSync(folder + "/" + filename));
    if (md5Current === md5Previous) {
      return;
    }
    md5Previous = md5Current;
    console.log(`${filename} file recorded`);
    try {
      jsonString = fs.readFileSync(folder + "/" + filename);
      jsonData = JSON.parse(jsonString)
      update(ref(db, "machines/" + jsonData.DryChamberID), {
        Timestamp: jsonData.DateTimeMessage,
        Status: jsonData.Status,
        CurrentTemp: jsonData.CurrentTemp,
        SetPointTemp: jsonData.SetPointTemp,
        CurrentHum : jsonData.CurrentHum,
        SetPointHum : jsonData.SetPointHum,
        RemainingTime : jsonData.RemainingTime,
        NumOfWmProbes : jsonData.NumOfWmProbes,
        WMValue1 : jsonData.WMValue1,
        WMValue2 : jsonData.WMValue2,
        WMValue3 : jsonData.WMValue3,
        WMValue4 : jsonData.WMValue4,
        WMValue5 : jsonData.WMValue5,
        WMValue6 : jsonData.WMValue6,
        WMValue7 : jsonData.WMValue7,
        WMValue8 : jsonData.WMValue8,
        WMValue9 : jsonData.WMValue9,
        WMValue10 : jsonData.WMValue10,
        HeatingValvePos : jsonData.HeatingValvePos,
        DamperPos : jsonData.DamperPos,
        SprayPos : jsonData.SprayPos,
        RPM : jsonData.RPM,
        FanDirection : jsonData.FanDirection,
        TempOffest : jsonData.TempOffest,
        EMCOffset : jsonData.EMCOffset,
        WMActive1 : jsonData.WMActive1,
        WMActive2 : jsonData.WMActive2,
        WMActive3 : jsonData.WMActive3,
        WMActive4 : jsonData.WMActive4,
        WMActive5 : jsonData.WMActive5,
        WMActive6 : jsonData.WMActive6,
        WMActive7 : jsonData.WMActive7,
        WMActive8 : jsonData.WMActive8,
        WMActive9 : jsonData.WMActive9,
        WMActive10 : jsonData.WMActive10,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`${filename} file has no .json extension and is ignored`);
  }
});
