"use client";

import React, { useEffect } from "react";
import { usePathname, useSearchParams, redirect } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";

const RoleToken = () => {
	const pathname = usePathname();
	const searchParams = useSearchParams();

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
				console.log("userData")
				console.log(userData)
				if (
					!userData.verificationToken ||
					userData.verificationToken !== roleToken
				) {
					redirect("/404");
				} else {
					// TODO: Make Firebase Function
					const setAuthUserRoleToken = httpsCallable(
						functions,
						"setAuthUserRoleToken"
					);
					console.log("Set Auth User Role Token");
					const result = await setAuthUserRoleToken({
						text: {
							uid: uid,
							verificationToken: userData.verificationToken,
							role: role,
							cid: cid,
						},
					});
					console.log(result)
					if (result.data.status === "success") {
						toast.success(
							"User successfully updated, you can close this window", toastOptions
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

	return <> </>;
};

export default RoleToken;
