import { useContext, createContext, useState, useEffect } from "react";
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from "firebase/auth";

import { auth } from "../firebase";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [role, setRole] = useState(null);

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
			throw new Error(err.message);
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
			throw new Error(err.message);
		}
	}

	const logIn = async (email, password) => {
		await signInWithEmailAndPassword(auth, email, password);
		if (await checkAdmin()) {
			setRole("admin");
		} else if (await checkEditor()) {
			setRole("editor");
		} else {
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
			value={{ user, role, logIn, logOut, passwordResetEmail }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
