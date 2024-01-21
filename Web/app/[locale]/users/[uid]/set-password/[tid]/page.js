"use client";

import React, { useEffect, useState } from "react";
import { usePathname, redirect } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";

const PasswordToken = () => {
	const [uid, setUid] = useState("");
	const [passwordToken, setPasswordToken] = useState("");

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
			const passwordToken = splitPath[4];
			const userSnap = await getDoc(doc(firestore, `users/${uid}`));

			if (userSnap.exists()) {
				const userData = userSnap.data();
				// if userData does not contain a passwordToken or the passwordToken does not the passwordToken of the path redirect user to 404 page
				if (
					!userData.passwordToken ||
					userData.passwordToken !== passwordToken
				) {
					redirect("/404");
				} else {
					setUid(uid);
					setPasswordToken(passwordToken);
				}
			} else {
				redirect("/404");
			}
		}

		fetchData();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Check if password and confirm password match
		if (e.target.password.value !== e.target.confirmPassword.value) {
			toast.error("Passwords do not match", toastOptions);
			e.target.reset();
		} else {
			const setAuthUserPasswordFunction = httpsCallable(
				functions,
				"setAuthUserPasswordFunction"
			);

			// Add Access-Control-Allow-Origin header
			const result = await setAuthUserPasswordFunction(
				{
					text: {
						uid: uid,
						passwordToken: passwordToken,
						password: e.target.password.value,
					},
				}
			);

			if (result.data.status === "success") {
				window.close();
			} else {
				toast.error("Something went wrong, please try again later");
			}
		}
	};

	return (
		<div>
			<h1>Set Password</h1>
			<form onSubmit={handleSubmit}>
				<label>
					Password:
					<input type="password" name="password" autoFocus />
				</label>
				<br />
				<label>
					Confirm Password:
					<input type="password" name="confirmPassword" />
				</label>
				<br />
				<button type="submit">Set Password</button>
			</form>
		</div>
	);
};

export default PasswordToken;
