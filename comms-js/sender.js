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
async function setupFirebase(firebaseConfig, email, password) {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  try {
    await signInWithEmailAndPassword(auth, email, password);
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
    const md5Current = md5(fs.readFileSync(folder + "/" + filename));
    if (md5Current === md5Previous) {
      return;
    }
    md5Previous = md5Current;
    console.log(`${filename} file recorded`);
    try {
      const jsonData = require(folder + "/" + filename);
      update(ref(db, "machines/" + jsonData.drychamber_id), {
        timestamp: jsonData.datetime_message,
        status: jsonData.drychamber_status,
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(`${filename} file has no .json extension and is ignored`);
  }
});
