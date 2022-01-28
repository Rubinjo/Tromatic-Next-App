import { getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

class AuthService {
  constructor(firebaseApp) {
    this.auth = getAuth(firebaseApp);
  }

  waitForUser(callback) {
    return onAuthStateChanged(this.auth, (userCred) => {
      callback(userCred);
    });
  }

  login(email, password) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCred) => {
        return {
          user: userCred.user,
        };
      })
      .catch((error) => {
        return {
          error: error.message,
        };
      });
  }
  async logout() {
    await signOut(this.auth);
  }
}

export default new AuthService(getApp());
