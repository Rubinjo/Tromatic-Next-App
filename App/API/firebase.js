import * as firebase from "firebase";
import "firebase/firestore";

export async function registration(companyID, fullName, email, password) {
  try {
    await firebase.auth().createUserWithEmailAndPassword(email, password);
    const currentUser = firebase.auth().currentUser;
    firebase
      .database()
      .ref("users/" + currentUser.uid)
      .set({
        companyID: companyID,
        email: currentUser.email,
        fullName: fullName,
        new: true,
      });
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function signIn(email, password) {
  try {
    await firebase.auth().signInWithEmailAndPassword(email, password);
  } catch (err) {
    throw new Error(err.message);
  }
}

export async function loggingOut() {
  try {
    await firebase.auth().signOut();
  } catch (err) {
    throw new Error(err.message);
  }
}
