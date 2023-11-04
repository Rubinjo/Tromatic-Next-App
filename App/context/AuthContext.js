import React, { useContext, createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	signOut,
	sendPasswordResetEmail,
	onAuthStateChanged,
} from "firebase/auth";
import {
	getDatabase,
	ref,
	set,
	update,
	serverTimestamp,
	get,
} from "firebase/database";

import i18n from "../utils/i18n";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [role, setRole] = useState(null);
	const [cid, setCid] = useState(null);

	const auth = getAuth();

	/**
	 * Register user account
	 *
	 * @param {string} companyID - ID of the company
	 * @param {string} fullName - Full name of user
	 * @param {string} email - Email of user
	 * @param {string} password - Password of user
	 * @param {string} language - Language of user
	 */
	const registration = async (
		companyID,
		fullName,
		email,
		password,
		language
	) => {
		try {
			const newUser = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const db = getDatabase();
			set(ref(db, `users/${newUser.user.uid}`), {
				email: newUser.user.email,
				fullName: fullName,
				cid: companyID,
				lastActivity: serverTimestamp(),
				language: language,
			});
		} catch (error) {
			throw new Error(error.message);
		}
	};

	/**
	 * Sign in user
	 *
	 * @param {string} email - Email of user
	 * @param {string} password - Password of user
	 * @param {string} language - Language of user
	 */
	const signInAccount = async (email, password, language) => {
		try {
			const currentUser = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);
			const db = getDatabase();
			if (currentUser && currentUser.user) {
				update(ref(db, `users/${currentUser.user.uid}`), {
					lastActivity: serverTimestamp(),
					language: language,
				});
				// if (!currentUser.user.emailVerified) {
				// 	signOutAccount();
				// 	Alert.alert(
				// 		i18n.t("authentication.error.notVerifiedTitle"),
				// 		i18n.t("authentication.error.notVerifiedMessage"),
				// 		[
				// 			{
				// 				text: "OK",
				// 				onPress: () => console.log("OK Pressed"),
				// 			},
				// 		],
				// 		{ cancelable: true }
				// 	);
				// }
				if (
					!(
						(await checkPrivilege("owner")) ||
						(await checkPrivilege("admin")) ||
						(await checkPrivilege("editor")) ||
						(await checkPrivilege("viewer"))
					)
				) {
					signOutAccount();
					Alert.alert(
						i18n.t("authentication.error.notApprovedTitle"),
						i18n.t("authentication.error.notApprovedMessage"),
						[
							{
								text: "OK",
								onPress: () => console.log("OK Pressed"),
							},
						],
						{ cancelable: true }
					);
				}
			}
		} catch (error) {
			throw new Error(i18n.t("authentication.error.incorrectSignIn"));
		}
	};

	/**
	 * Sign out user
	 */
	const signOutAccount = async () => {
		try {
			const db = getDatabase();
			await update(ref(db, "users/" + auth.currentUser.uid), {
				lastActivity: serverTimestamp(),
			});
			await signOut(auth);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	/**
	 * Send password reset link to user account email
	 *
	 * @param {string} email - Email of concerned user
	 * @param {string} language - Language to receive the reset email in
	 */
	const resetPasswordAccount = async (email, language) => {
		try {
			auth.languageCode = language;
			await sendPasswordResetEmail(auth, email);
		} catch (error) {
			throw new Error(error.message);
		}
	};

	/**
	 * Check if user has some type of privilege
	 * @param {string} role Privilege type
	 * @return {Promise<boolean>} Whether the user has the specified privilege.
	 */
	const checkPrivilege = async (role) => {
		try {
			const db = getDatabase();
			const snapshot = await get(
				ref(db, `${role}/${auth.currentUser.uid}`)
			);
			return snapshot.exists();
		} catch (error) {
			return false;
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				setRole(null);
				setCid(null);
			} else {
				if (await checkPrivilege("owner")) {
					setRole("owner");
				} else if (await checkPrivilege("admin")) {
					setRole("admin");
				} else if (await checkPrivilege("editor")) {
					setRole("editor");
				} else if (await checkPrivilege("viewer")) {
					setRole("editor");
				} else {
					logOut();
					toast.warn(
						"Your account does not have the required privileges",
						toastOptions
					);
				}
				const db = getDatabase();
				get(ref(db, `users/${auth.currentUser.uid}/cid`)).then(
					(snapshot) => {
						setCid(snapshot.val());
					}
				);
			}
		});
		return () => unsubscribe();
	}, []);

	return (
		<AuthContext.Provider
			value={{
				user,
				role,
				cid,
				signInAccount,
				signOutAccount,
				resetPasswordAccount,
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
