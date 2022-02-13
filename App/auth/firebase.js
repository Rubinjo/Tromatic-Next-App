import { Alert } from "react-native";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import {
  getDatabase,
  ref,
  set,
  update,
  serverTimestamp,
  get,
} from "firebase/database";

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
      lastActivity: serverTimestamp(),
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
      lastActivity: serverTimestamp(),
    });
    if (
      !((await checkAdmin()) || (await checkEditor()) || (await checkViewer()))
    ) {
      signOutAccount();
      Alert.alert(
        "Account not verified",
        "Your account has not been verified by the specified company yet",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: true }
      );
    }
  } catch (err) {
    console.log(err.message);
    throw new Error(err.message);
  }
}

export async function signOutAccount() {
  try {
    const auth = getAuth();
    const db = getDatabase();
    await update(ref(db, "users/" + auth.currentUser.uid), {
      lastActivity: serverTimestamp(),
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

export async function checkAdmin() {
  try {
    const auth = getAuth();
    const db = getDatabase();
    return await get(ref(db, "admin/" + auth.currentUser.uid)).then(
      (snapshot) => {
        return snapshot.exists();
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function checkEditor() {
  try {
    const auth = getAuth();
    const db = getDatabase();
    return await get(ref(db, "editor/" + auth.currentUser.uid)).then(
      (snapshot) => {
        return snapshot.exists();
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function checkViewer() {
  try {
    const auth = getAuth();
    const db = getDatabase();
    return await get(ref(db, "viewer/" + auth.currentUser.uid)).then(
      (snapshot) => {
        return snapshot.exists();
      }
    );
  } catch (err) {
    throw new Error(err.message);
  }
}
