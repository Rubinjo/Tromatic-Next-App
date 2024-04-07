"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";
import Spinner from "@/components/Spinner";

const EmailToken = () => {
    const pathname = usePathname();
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

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

    useEffect(() => {
        async function fetchData() {
            const splitPath = pathname.split("/");
            const uid = splitPath[2];
            const emailToken = splitPath[4];
            const userSnap = await getDoc(doc(firestore, `users/${uid}`));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (
                    !userData.emailToken ||
                    userData.emailToken !== emailToken
                ) {
                    toast.error("Invalid email token", toastOptions);
                    setError(true);
                } else {
                    const setAuthVerified = httpsCallable(
                        functions,
                        "setAuthVerified"
                    );
                    const result = await setAuthVerified({
                        text: {
                            uid: uid,
                            emailToken: userData.emailToken,
                        },
                    });
                    if (result.data.status === "success") {
                        toast.success(
                            "Email verified, you can close this window",
                            toastOptions
                        );
                        setSuccess(true);
                    } else {
                        toast.error(
                            "Something went wrong, please try again later",
                            toastOptions
                        );
                        setError(true);
                    }
                }
            } else {
                toast.error(
                    "Something went wrong, please try again later",
                    toastOptions
                );
                setError(true);
            }
            setLoading(false);
        }

        fetchData();
    }, []);

    return (
        <div className="flex h-screen items-center justify-center">
            {loading && (
                <div className="flex flex-col items-center">
                    <Spinner />
                    <p>Verifying email...</p>
                </div>
            )}
            {success && <p>Email verified, you can close this window</p>}
            {error && <p>Something went wrong, please try again later</p>}
        </div>
    );
};

export default EmailToken;
