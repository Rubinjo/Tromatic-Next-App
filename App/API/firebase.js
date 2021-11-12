import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";

export async function registration(companyID, fullName, email, password) {
  try {
    const auth = getAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    const currentUser = auth.currentUser;
    const db = getDatabase();
    set(ref(db, "users/" + currentUser.uid), {
      email: currentUser.email,
      fullName: fullName,
      cid: companyID,
      lastActivity: new Date().toString(),
    });
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

export async function resetPasswordAccount(email, language) {
  try {
    const auth = getAuth();
    auth.languageCode = language;
    await sendPasswordResetEmail(auth, email);
  } catch (err) {
    throw new Error(err.message);
  }
}
