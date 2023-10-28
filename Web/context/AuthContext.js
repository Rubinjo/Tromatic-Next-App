import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
	signInWithEmailAndPassword,
	signOut,
	onAuthStateChanged,
	sendPasswordResetEmail,
} from "firebase/auth";
import {
	getDatabase,
	ref,
	get,
	set,
	remove,
	serverTimestamp,
} from "firebase/database";
import { getFunctions, httpsCallable } from "firebase/functions";

import { auth } from "../firebase";

const functions = getFunctions();

const AuthContext = createContext();

const toastOptions = {
	position: "top-center",
	autoClose: 5000,
	hideProgressBar: false,
	closeOnClick: true,
	pauseOnHover: true,
	draggable: false,
	progress: undefined,
	theme: "colored",
};

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [role, setRole] = useState(null);
	const [cid, setCid] = useState(null);

	/**
	 * Register user account
	 * @param {string} companyID - ID of the concerned company
	 * @param {string} fullName - Fullname of concerned user
	 * @param {string} email - Email of concerned user
	 * @param {string} password - Password of concerned user
	 * @param {string} language - Language of concerned user
	 * @param {string} role - Role of concerned user
	 */
	const registration = async (
		companyID,
		fullName,
		email,
		// password,
		// language,
		role
	) => {
		let userRecord;
		try {
			const createUserMessage = httpsCallable(
				functions,
				"createAuthUserFunction"
			);
			result = await createUserMessage({
				text: { email: email, displayName: fullName },
			});
			const db = getDatabase();
			set(ref(db, "users/" + userRecord.uid), {
				email: userRecord.email,
				fullName: fullName,
				cid: companyID,
				lastActivity: serverTimestamp(),
				// language: language,
			});
			if (role !== "unassigned") {
				set(ref(db, role + "/" + userRecord.uid), {
					assignmentDate: serverTimestamp(),
					givenBy: auth.currentUser.uid,
				});
			}
			toast.success("User was added", toastOptions);
		} catch (error) {
			console.log(error);
			if (userRecord) {
				// Rollback db changes
				const userRef = ref(db, "users/" + userRecord.uid);
				remove(userRef);
				const deleteUserMessage = httpsCallable(
					functions,
					"deleteAuthUserFunction"
				);
				result = await deleteUserMessage({
					text: { uid: userRecord.uid },
				});
			}
			toast.error(
				"Something went wrong, please try again later",
				toastOptions
			);
		}
	};

	/**
	 * Check if user has admin privilege
	 * @returns {boolean}
	 */
	const checkOwner = async () => {
		try {
			const db = getDatabase();
			return await get(ref(db, "owner/" + auth.currentUser.uid)).then(
				(snapshot) => {
					return snapshot.exists();
				}
			);
		} catch (error) {
			throw new Error("Your owner privileges couldn't be confirmed");
		}
	};

	/**
	 * Check if user has admin privilege
	 * @returns {boolean}
	 */
	const checkAdmin = async () => {
		try {
			const db = getDatabase();
			return await get(ref(db, "admin/" + auth.currentUser.uid)).then(
				(snapshot) => {
					return snapshot.exists();
				}
			);
		} catch (error) {
			throw new Error("Your admin privileges couldn't be confirmed");
		}
	};

	/**
	 * Check if user has editor privilege
	 * @returns {boolean}
	 */
	const checkEditor = async () => {
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
	};

	/**
	 * Log in a user with email and password.
	 *
	 * @param {string} email - User's email address.
	 * @param {string} password - User's password.
	 */
	const logIn = async (email, password) => {
		try {
			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
			console.log(error);
			if (error.code == "auth/user-not-found") {
				toast.error("Invalid login credentials", toastOptions);
			} else {
				logOut();
				toast.error(
					"Something went wrong, please try again later",
					toastOptions
				);
			}
		}
	};

	/**
	 * Logs out the currently authenticated user.
	 */
	const logOut = () => {
		signOut(auth);
	};

	/**
	 * Sends a password reset email to the specified email address.
	 *
	 * @param {string} email - The email address associated with the user account.
	 */
	const passwordResetEmail = (email) => {
		try {
			sendPasswordResetEmail(auth, email);
			toast.success("Reset password email was send", toastOptions);
		} catch (error) {
			toast.error(
				"Reset password email couldn't be send, please try again later",
				toastOptions
			);
		}
	};

	/**
	 * Edit a user's role and handle role changes in the database.
	 *
	 * @param {object} newUser - The updated user object with the new role.
	 * @param {object} oldUser - The original user object with the previous role.
	 */
	const editUser = async (newUser, oldUser) => {
		try {
			const db = getDatabase();
			if (oldUser.role !== "Unassigned") {
				const currentRoleRef = ref(db, `${oldUser.role}/${oldUser.id}`);
				await remove(currentRoleRef);
			}

			const newRoleRef = ref(db, `${newUser.role}/${oldUser.id}`);
			await set(newRoleRef, { assignedAt: serverTimestamp() });

			toast.success("User was edited", toastOptions);
		} catch (error) {
			// Handle errors and perform the rollback
			if (oldUser.role !== "Unassigned") {
				const currentRoleRef = ref(db, `${oldUser.role}/${oldUser.id}`);
				await set(currentRoleRef, { assignedAt: serverTimestamp() });
			}

			toast.error(
				"Something went wrong, please try again later",
				toastOptions
			);
		}
	};

	/**
	 * Delete a user's account and associated data.
	 *
	 * @param {object} user - The user object to be deleted, including user details and role.
	 */
	const deleteUser = async (user) => {
		try {
			const db = getDatabase();
			// Remove user role
			if (user.role !== "Unassigned") {
				const roleRef = ref(db, user.role + "/" + user.id);
				const roleData = await get(roleRef);
				await remove(roleRef);
			}
			// Remove user from company
			const userCompanyRef = ref(
				db,
				"companies/" + user.companyId + "/users/" + user.id
			);
			await remove(userCompanyRef);

			// Remove user
			const userRef = ref(db, "users/" + user.id);
			await remove(userRef);

			// Remove user auth record
			const deleteUserMessage = httpsCallable(
				functions,
				"deleteAuthUserFunction"
			);
			result = await deleteUserMessage({
				text: { uid: userRecord.uid },
			});
		} catch (error) {
			console.log(error);
			if (user.role !== "Unassigned") {
				// Rollback user role
				const roleRef = ref(db, `${user.role}/${user.id}`);
				await set(roleRef, roleData.val());
			}
			// Rollback user association
			const userCompanyRef = ref(
				db,
				`companies/${user.companyId}/users/${user.id}`
			);
			await set(userCompanyRef, {
				added: "Now",
			});
			// Rollback user data
			const userRef = ref(db, `users/${user.id}`);
			await set(userRef, {
				cid: user.companyId,
				email: user.email,
				fullName: fullName,
				lastActivity: lastActivity,
			});
		}
	};

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
			if (!currentUser) {
				setRole(null);
				setCid(null);
			} else {
				if (checkOwner()) {
					setRole("owner");
				} else if (checkAdmin()) {
					setRole("admin");
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
	}, [user]);

	return (
		<AuthContext.Provider
			value={{
				user,
				role,
				cid,
				logIn,
				logOut,
				passwordResetEmail,
				registration,
				editUser,
				deleteUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const UserAuth = () => {
	return useContext(AuthContext);
};
