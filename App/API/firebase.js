import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";

export async function registration(companyID, fullName, email, password) {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = auth.currentUser;
    const db = getDatabase();
    const updates = {};
    updates["users/" + currentUser.uid] = {
      email: currentUser.email,
      fullName: fullName,
      companyID: companyID,
    };
    updates["companies/" + companyID + "/users/" + currentUser.uid] = {
      creation: new Date().toString(),
      new: true,
    };
    update(ref(db), updates);
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function signInAccount(email, password) {
  try {
    const auth = getAuth();
    await signInWithEmailAndPassword(auth, email, password);
    const db = getDatabase();
    update(ref(db, "users/" + auth.currentUser.uid), {
      lastActivity: new Date().toString(),
    });
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function signOutAccount() {
  try {
    const auth = getAuth();
    const db = getDatabase();
    update(ref(db, "users/" + auth.currentUser.uid), {
      lastActivity: new Date().toString(),
    });
    await signOut(auth);
  } catch (err) {
    throw new Error(err.message);
  }
}
