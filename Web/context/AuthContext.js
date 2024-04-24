"use client";

import { useContext, createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { ref, get, update, remove, serverTimestamp } from "firebase/database";
import { writeBatch, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { firebase, firestore, auth, functions } from "../firebase";

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
     * Logs out the currently authenticated user.
     */
    const logOut = () => {
        signOut(auth);
    };

    /**
     * Register user account
     * @param {string} companyID - ID of the concerned company
     * @param {string} fullName - Fullname of concerned user
     * @param {string} email - Email of concerned user
     * @param {string} password - Password of concerned user
     * @param {string} language - Language of concerned user
     * @param {string} role - Role of concerned user
     */
    const registration = async (companyID, fullName, email, role) => {
        const lcCompanyID = companyID.toLowerCase();
        try {
            const createUserMessage = httpsCallable(
                functions,
                "createAuthUserFunction"
            );
            const result = await createUserMessage({
                text: { email: email, fullName: fullName },
            });

            const updates = {};
            const batch = writeBatch(firestore);

            updates[`users/${result.data.uid}`] = {
                email: email,
                fullName: fullName,
                cid: lcCompanyID,
                lastActivity: serverTimestamp(),
            };
            batch.set(doc(firestore, "users", result.data.uid), {
                cid: lcCompanyID,
                email: email,
                fullName: fullName,
            });
            if (role !== "unassigned") {
                updates[`${role}/${result.data.uid}`] = {
                    assignmentDate: serverTimestamp(),
                    givenBy: auth.currentUser.uid,
                };
                batch.set(doc(firestore, "authorization", result.data.uid), {
                    isEditor: true
                        ? role === "editor" ||
                          role === "admin" ||
                          role === "owner"
                        : false,
                    isAdmin: true
                        ? role === "admin" || role === "owner"
                        : false,
                    isOwner: true ? role === "owner" : false,
                });
            }
            updates[`companies/${lcCompanyID}/users/${result.data.uid}`] = {
                added: serverTimestamp(),
                addedBy: auth.currentUser.uid,
            };
            await update(ref(firebase), updates);
            await batch.commit();
            toast.success("User was added", toastOptions);
        } catch (error) {
            console.log(error);
            if (
                typeof result !== "undefined" &&
                typeof result.data !== "undefined" &&
                result.data.hasOwnProperty("uid")
            ) {
                // Rollback db changes
                const updates = {};
                updates[`users/${result.data.uid}`] = null;
                updates[`companies/${lcCompanyID}/users/${result.data.uid}`] =
                    null;
                update(ref(db), updates);
                const deleteUserMessage = httpsCallable(
                    functions,
                    "deleteAuthUserFunction"
                );
                result = await deleteUserMessage({
                    text: { uid: result.data.uid },
                });
            }
            toast.error(
                "Something went wrong, please try again later",
                toastOptions
            );
        }
    };

    /**
     * Check if user has some type of privilege
     * @param {string} role Privilege type
     * @return {Promise<boolean>} Whether the user has the specified privilege.
     */
    const checkPrivilege = async (role) => {
        try {
            const snapshot = await get(
                ref(firebase, `${role}/${auth.currentUser.uid}`)
            );
            return snapshot.exists();
        } catch (error) {
            return false;
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
            if (
                !(
                    (await checkPrivilege("owner")) ||
                    (await checkPrivilege("admin"))
                )
            ) {
                throw new Error(
                    `Your ${role} privileges couldn't be confirmed`
                );
            }
        } catch (error) {
            if (error.code === "auth/user-not-found") {
                toast.error("Invalid login credentials", toastOptions);
            } else if (error.code === "auth/wrong-password") {
                toast.error("Invalid password", toastOptions);
            } else {
                console.error("Something went wrong during login:", error);
                logOut();
                toast.error(
                    "Something went wrong, please try again later",
                    toastOptions
                );
            }
        }
    };

    /**
     * Sends a password reset email to the specified email address.
     *
     * @param {string} email - The email address associated with the user account.
     */
    const passwordResetEmail = async (email) => {
        try {
            const sendResetPasswordEmailFunction = httpsCallable(
                functions,
                "sendResetPasswordEmailFunction"
            );
            const result = await sendResetPasswordEmailFunction({
                text: {
                    email: email,
                },
            });
            toast.success("Reset password email was send", toastOptions);
        } catch (error) {
            console.log(error);
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
            const updates = {};
            const batch = writeBatch(firestore);

            if (oldUser.role !== newUser.role) {
                if (oldUser.role !== "unassigned") {
                    updates[`${oldUser.role}/${oldUser.id}`] = null;
                }
                updates[`${newUser.role}/${oldUser.id}`] = {
                    assignedAt: serverTimestamp(),
                };
                if (oldUser.role === "unassigned") {
                    batch.set(doc(firestore, "authorization", oldUser.id), {
                        isEditor: false,
                        isAdmin: false,
                        isOwner: false,
                    });
                } else {
                    batch.update(doc(firestore, "authorization", oldUser.id), {
                        isEditor: true
                            ? newUser.role === "editor" ||
                              newUser.role === "admin" ||
                              newUser.role === "owner"
                            : false,
                        isAdmin: true
                            ? newUser.role === "admin" ||
                              newUser.role === "owner"
                            : false,
                        isOwner: true ? newUser.role === "owner" : false,
                    });
                }
            }

            if (oldUser.fullName !== newUser.fullName) {
                updates[`users/${oldUser.id}/fullName`] = newUser.fullName;
                batch.update(doc(firestore, "users", oldUser.id), {
                    fullName: newUser.fullName,
                });
            }

            if (oldUser.email !== newUser.email) {
                updates[`users/${oldUser.id}/email`] = newUser.email;
                batch.update(doc(firestore, "users", oldUser.id), {
                    email: newUser.email,
                });
            }

            if (oldUser.companyId !== newUser.companyId) {
                updates[`users/${oldUser.id}/cid`] = newUser.companyId;
                updates[`companies/${oldUser.companyId}/users/${oldUser.id}`] =
                    null;
                updates[`companies/${newUser.companyId}/users/${oldUser.id}`] =
                    {
                        Added: serverTimestamp(),
                    };
                batch.update(doc(firestore, "users", oldUser.id), {
                    cid: newUser.companyId,
                });
            }
            await update(ref(firebase), updates);
            await batch.commit();
            toast.success("User was edited", toastOptions);
        } catch (error) {
            console.log(error);
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
            const updates = {};
            const batch = writeBatch(firestore);

            // Remove user role
            if (user.role !== "Unassigned") {
                updates[`${user.role}/${user.id}`] = null;
            }
            batch.delete(doc(firestore, "authorization", user.id));
            // Remove user from company
            updates[`companies/${user.companyId}/users/${user.id}`] = null;

            // Remove user
            updates[`users/${user.id}`] = null;
            batch.delete(doc(firestore, "users", user.id));

            await update(ref(firebase), updates);
            await batch.commit();

            // Remove user auth record
            const deleteUserMessage = httpsCallable(
                functions,
                "deleteAuthUserFunction"
            );
            result = await deleteUserMessage({
                text: { uid: user.id },
            });
        } catch (error) {
            console.log(error);
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
                } else {
                    logOut();
                    toast.warn(
                        "Your account does not have the required privileges",
                        toastOptions
                    );
                }
                get(ref(firebase, `users/${auth.currentUser.uid}/cid`)).then(
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
