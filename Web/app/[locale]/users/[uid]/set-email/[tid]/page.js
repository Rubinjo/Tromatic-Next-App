"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { functions } from "@/firebase";
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
            const setAuthVerified = httpsCallable(
                functions,
                "setAuthVerified"
            );
            try {
                const result = await setAuthVerified({
                    text: {
                        uid: uid,
                        emailToken: emailToken,
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
            } catch (error) {
                console.error(error);
                toast.error(
                    "Something went wrong, please try again later",
                    toastOptions
                );
                setError(true);
            } finally {
                setLoading(false);
            }
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
