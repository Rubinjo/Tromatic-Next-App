import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

/**
 * @param {{APIKEY: string, AUTHDOMAIN: string, DATABASEURL: string, PROJECTID: string, STORAGEBUCKET: string, MESSAGINGSENDERID: string, APPID: string}} firebaseConfig
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
    throw new Error(`Failed to sign in: ${e.message}`);
  }
  return [auth, getDatabase(app), getFirestore(app)];
}

export default setupFirebase;
