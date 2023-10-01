import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { getAuth } from "firebase-admin/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [role, setRole] = useState(null);

	/**
	 * Register user account
	 * @param {string} companyID - ID of the concerned company
	 * @param {string} fullName - Fullname of concerned user
	 * @param {string} email - Email of concerned user
	 * @param {string} password - Password of concerned user
	 */
	async function registration(
		companyID,
		fullName,
		email,
		password,
		language,
		role
	) {
		try {
			const db = getDatabase();
			const userRecord = await getAuth().createUser({
				email: email,
				emailVerified: false,
				password: password,
				displayName: fullName,
				disabled: false,
			});
			set(ref(db, "users/" + userRecord.uid), {
				email: userRecord.email,
				fullName: fullName,
				cid: companyID,
				lastActivity: serverTimestamp(),
				language: language,
			});
			set(ref(db, role + "/" + userRecord.uid), {
				assignmentDate: serverTimestamp(),
				givenBy: auth.currentUser.uid,
			});
		} catch (err) {
			throw new Error(err.message);
		}
	}

	/**
	 * Check if user has admin privilege
	 * @returns {boolean}
	 */
	async function checkAdmin() {
		try {
			const db = getDatabase();
			return await get(ref(db, "admin/" + auth.currentUser.uid)).then(
				(snapshot) => {
					return snapshot.exists();
				}
			);
		} catch (err) {
			throw new Error("Your admin privileges couldn't be confirmed");
		}
	}

	/**
	 * Check if user has editor privilege
	 * @returns {boolean}
	 */
	async function checkEditor() {
		try {
			const db = getDatabase();
			return await get(ref(db, "editor/" + auth.currentUser.uid)).then(
				(snapshot) => {
					return snapshot.exists();
				}
			);
		} catch (err) {
			throw new Error("Your editor privileges couldn't be confirmed");
		}
	}

	const logIn = async (email, password) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			if (error.code == "auth/user-not-found") {
				toast.error("Invalid login credentials", {
					position: "top-center",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: false,
					progress: undefined,
					theme: "colored",
				});
			} else {
				throw new Error("Something went wrong");
			}
			return;
		}
		if (await checkAdmin()) {
			setRole("admin");
		} else if (await checkEditor()) {
			setRole("editor");
		} else {
			toast.warn("Your account does not have the required privileges", {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: false,
				progress: undefined,
				theme: "colored",
			});
			logOut();
		}
	};

	const logOut = () => {
		signOut(auth);
	};

	const passwordResetEmail = (email) => {
		sendPasswordResetEmail(auth, email);
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				setRole(null);
			}
		});
		return () => unsubscribe();
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				role,
				logIn,
				logOut,
				passwordResetEmail,
				registration,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
