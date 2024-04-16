import React, { useContext, createContext, useState, useEffect } from "react";
import { Alert } from "react-native";
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { ref, set, update, serverTimestamp, get } from "firebase/database";
import { setDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";

import { firebase, firestore, auth, functions } from "../firebaseConfig";
import i18n from "../utils/i18n";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [cid, setCid] = useState(null);
    const [isRegistering, setIsRegistering] = useState(false);

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
        setIsRegistering(true);
        const lcCompanyID = companyID.toLowerCase();
        try {
            const newUser = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            updateProfile(newUser.user, {
                displayName: fullName,
            });
            await setDoc(doc(firestore, "users", newUser.user.uid), {
                cid: lcCompanyID,
                email: email,
                fullName: fullName,
            });
            await set(ref(firebase, `users/${newUser.user.uid}`), {
                email: email,
                fullName: fullName,
                cid: lcCompanyID,
                lastActivity: serverTimestamp(),
                language: language,
            });
        } catch (error) {
            throw error;
        } finally {
            try {
                await signOutAccount();
            } catch (error) {
                console.log(error.message);
            }
            setIsRegistering(false);
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
            if (currentUser && currentUser.user) {
                update(ref(firebase, `users/${currentUser.user.uid}`), {
                    lastActivity: serverTimestamp(),
                    language: language,
                });
                if (!currentUser.user.emailVerified) {
                    signOutAccount();
                    Alert.alert(
                        i18n.t("authentication.error.notVerifiedTitle"),
                        i18n.t("authentication.error.notVerifiedMessage"),
                        [
                            {
                                text: i18n.t(
                                    "authentication.error.notVerifiedResend"
                                ),
                                onPress: async () => {
                                    const sendVerificationEmailFunction =
                                        httpsCallable(
                                            functions,
                                            "sendOnlyVerificationEmailFunction"
                                        );
                                    const result =
                                        await sendVerificationEmailFunction({
                                            text: {
                                                email: email,
                                            },
                                        });
                                },
                            },
                            {
                                text: "OK",
                                onPress: () => console.log("OK Pressed"),
                            },
                        ],
                        { cancelable: true }
                    );
                } else if (
                    !(
                        (await checkPrivilege("owner")) ||
                        (await checkPrivilege("admin")) ||
                        (await checkPrivilege("editor")) ||
                        (await checkPrivilege("viewer"))
                    )
                ) {
                    setTimeout(() => {
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
                    }, 500);
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
            await update(ref(firebase, "users/" + auth.currentUser.uid), {
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
    const resetPasswordAccount = async (email) => {
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
            const snapshot = await get(
                ref(firebase, `${role}/${auth.currentUser.uid}`)
            );
            return snapshot.exists();
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        if (isRegistering) {
            return;
        }
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
                } else if (auth.currentUser) {
                    // Wait for all other code to run before signing out
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
                get(ref(firebase, `users/${auth.currentUser.uid}/cid`)).then(
                    (snapshot) => {
                        setCid(snapshot.val());
                    }
                );
            }
        });
        return () => unsubscribe();
    }, [isRegistering]);

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
