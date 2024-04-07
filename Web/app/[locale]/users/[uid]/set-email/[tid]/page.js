"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";

const EmailToken = () => {
	const pathname = usePathname();

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
							"Email verified, you can close this window", toastOptions
						);
					} else {
						toast.error(
							"Something went wrong, please try again later", toastOptions
						);
					}
				}
			} else {
				redirect("/404");
			}
		}

		fetchData();
	}, []);

	return <></>;
};

export default EmailToken;
