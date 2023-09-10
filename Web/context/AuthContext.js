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

	const logIn = (email, password) => {
		signInWithEmailAndPassword(auth, email, password);
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
		});
		return () => unsubscribe();
	}, [user]);

	return (
		<AuthContext.Provider
			value={{ user, logIn, logOut, passwordResetEmail }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
