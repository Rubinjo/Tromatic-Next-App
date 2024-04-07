"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";
import Spinner from "@/components/Spinner";

const RoleToken = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
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
            const roleToken = splitPath[4];
            const userSnap = await getDoc(doc(firestore, `users/${uid}`));
            const role = searchParams.get("role");
            const cid = searchParams.get("cid");
            if (
                userSnap.exists() &&
                ["admin", "editor", "viewer", "delete"].includes(role)
            ) {
                const userData = userSnap.data();
                if (
                    !userData.verificationToken ||
                    userData.verificationToken !== roleToken
                ) {
                    toast.error("Invalid role token", toastOptions);
                    setError(true);
                } else {
                    const setAuthUserRoleToken = httpsCallable(
                        functions,
                        "setAuthUserRoleToken"
                    );
                    const result = await setAuthUserRoleToken({
                        text: {
                            uid: uid,
                            verificationToken: userData.verificationToken,
                            role: role,
                            cid: cid,
                        },
                    });
                    console.log(result);
                    if (result.data.status === "success") {
                        toast.success(
                            "User successfully updated, you can close this window",
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
                toast.error("Invalid role token", toastOptions);
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
                    <p>Setting role...</p>
                </div>
            )}
            {success && <p>Role set, you can close this window</p>}
            {error && <p>Something went wrong, please try again later</p>}
        </div>
    );
};

export default RoleToken;
