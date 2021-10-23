import firebaseConfig from "./helper/key";
import { email, password } from "./helper/login";
import * as firebase from "firebase";

// The built-in File system module
const fs = require("fs");
// Hash function
const md5 = require("md5");
// Time logging package
// Automatically being used
require("log-timestamp");

const folder = "./folder";

// Initizialize
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.getAuth();
firebase.auth().signInWithEmailAndPassword(email, password);
const currentUser = firebase.auth().currentUser;

console.log(`Watching for file changes on ${folder}`);

let md5Previous = null;
let fsWait = false;
fs.watch(folder, (event, filename) => {
  if (filename) {
    if (fsWait) return;
    // Debounce function
    // Set fsWait to true for a small ammount of time
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

    firebase
      .database()
      .ref("users/" + currentUser.uid)
      .set({
        companyID: companyID,
        email: currentUser.email,
        fullName: fullName,
        new: true,
      });
  }
});
