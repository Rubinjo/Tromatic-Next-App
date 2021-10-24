const fs = require("fs");
const md5 = require("md5");
require("log-timestamp");
const { firebaseConfig } = require("./helper/key");
const { email, password } = require("./helper/login");
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");
const { getDatabase, ref, set } = require("firebase/database");

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
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
  const db = getDatabase();
}

console.log(`Watching for file changes on ${folder}`);

/**
 * MD5 hash of previous found params in .txt file.
 * @type {string}
 */
let md5Previous = null;

/**
 * Check if timeout period is over.
 * @type {boolean}
 */
let fsWait = false;

setupFirebase(firebaseConfig, email, password);

/**
 * Constantly watch machine outputted .txt files that are located in specified folder location.
 * Send outputted params to firebase.
 * @param {string} folder - Location of folder that will be watched.
 * @param {string} event - Type of event that happened.
 * @param {string} filename - Name of file that has changed.
 */
fs.watch(folder, (event, filename) => {
  if (filename) {
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
    console.log(`${filename} file Changed`);

    // Get a new key
    const newKey = push(
      child(
        ref(db),
        "companies/" + companyId + "/machines/" + machineId + "/params"
      )
    ).key;

    set(
      ref(
        db,
        "companies/" +
          companyId +
          "/machines/" +
          machineId +
          "/params/" +
          newKey
      ),
      {
        time: new Date().toTimeString(),
      }
    );
  }
});
