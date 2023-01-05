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
        RemaingTime : jsonData.RemaingTime,
        NumOfWmPProbes : jsonData.NumOfWmPProbes,
        WMValue_1 : jsonData.WMValue_1,
        WMValue_2 : jsonData.WMValue_2,
        WMValue_3 : jsonData.WMValue_3,
        WMValue_4 : jsonData.WMValue_4,
        WMValue_5 : jsonData.WMValue_5,
        WMValue_6 : jsonData.WMValue_6,
        WMValue_7 : jsonData.WMValue_7,
        WMValue_8 : jsonData.WMValue_8,
        WMValue_9 : jsonData.WMValue_9,
        WMValue_10 : jsonData.WMValue_10,
        HeatingValvePos : jsonData.HeatingValvePos,
        DamperPos : jsonData.DamperPos,
        SprayPos : jsonData.SprayPos,
        RPM : jsonData.RPM,
        FanDirection : jsonData.FanDirection,
        TempOffest : jsonData.TempOffest,
        EMCOffset : jsonData.EMCOffset,
        WM_Active_1 : jsonData.WM_Active_1,
        WM_Active_2 : jsonData.WM_Active_2,
        WM_Active_3 : jsonData.WM_Active_3,
        WM_Active_4 : jsonData.WM_Active_4,
        WM_Active_5 : jsonData.WM_Active_5,
        WM_Active_6 : jsonData.WM_Active_6,
        WM_Active_7 : jsonData.WM_Active_7,
        WM_Active_8 : jsonData.WM_Active_8,
        WM_Active_9 : jsonData.WM_Active_9,
        WM_Active_10 : jsonData.WM_Active_10,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`${filename} file has no .json extension and is ignored`);
  }
});
