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

			if (
				userSnap.exists() &&
				["admin", "editor", "viewer", "delete"].includes(role)
			) {
				const userData = userSnap.data();
				if (
					!userData.passwordToken ||
					userData.passwordToken !== roleToken
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
							passwordToken: passwordToken,
							role: role,
						},
					});
					if (result.data.status === "success") {
						window.close();
					} else {
						toast.error(
							"Something went wrong, please try again later"
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
