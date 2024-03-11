"use client";

import React, { useEffect, useState } from "react";
import { usePathname, redirect } from "next/navigation";
import { getDoc, doc } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { toast } from "react-toastify";

import { firestore, functions } from "@/firebase";

const ResetToken = () => {
	const [uid, setUid] = useState("");
	const [resetToken, setResetToken] = useState("");

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
			const resetToken = splitPath[4];
			const userSnap = await getDoc(doc(firestore, `users/${uid}`));

			if (userSnap.exists()) {
				const userData = userSnap.data();
				// if userData does not contain a resetToken or the resetToken does not the passwordToken of the path redirect user to 404 page
				if (
					userData.resetToken &&
					userData.resetTokenExpiration &&
					userData.resetToken === resetToken &&
					userData.resetTokenExpiration > Date.now()
				) {
					setUid(uid);
					setResetToken(passwordToken);
				} else {
					redirect("/404");
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
			const resetPassword = httpsCallable(functions, "resetPassword");
			const result = await resetPassword({
				text: {
					uid: uid,
					resetToken: resetToken,
					password: e.target.password.value,
				},
			});
			if (result.data.status === "success") {
				window.close();
			} else {
				toast.error("Something went wrong, please try again later");
			}
		}
	};

	return (
		<div className="flex justify-center items-center h-screen">
			<div className="w-96 p-8 bg-white rounded shadow">
				<h1 className="text-2xl font-bold mb-4">Set Password</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<label className="flex flex-col">
						<span className="mb-1">Password:</span>
						<input
							type="password"
							name="password"
							autoFocus
							className="border border-gray-300 px-3 py-2 rounded"
						/>
					</label>
					<label className="flex flex-col">
						<span className="mb-1">Confirm Password:</span>
						<input
							type="password"
							name="confirmPassword"
							className="border border-gray-300 px-3 py-2 rounded"
						/>
					</label>
					<button
						type="submit"
						className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
					>
						Set Password
					</button>
				</form>
			</div>
		</div>
	);
};

export default ResetToken;
