"use client";

import React, { useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export function withPublic(Component) {
	return function WithPublic(props) {
		const [loading, setLoading] = useState(true);
		const {
			user,
			role,
			cid,
			logIn,
			logOut,
			passwordResetEmail,
			registration,
			editUser,
			deleteUser,
		} = UserAuth();
		const router = useRouter();

		// Wait for user to be loaded
		useEffect(() => {
			const checkAuthentication = async () => {
				await new Promise((resolve) => setTimeout(resolve, 500));
				setLoading(false);
			};
			checkAuthentication();
		}, []);

		if (loading) {
			return null; // Prevent rendering
		}

		// If the user is already authenticated, perform the redirection
		if (user) {
			router.replace("/machines");
			return null; // Prevent rendering
		}

		return (
			<Component
				user={user}
				role={role}
				cid={cid}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				registration={registration}
				editUser={editUser}
				deleteUser={deleteUser}
				{...props}
			/>
		);
	};
}

export function withProtected(Component) {
	return function WithProtected(props) {
		const [loading, setLoading] = useState(true);
		const {
			user,
			role,
			cid,
			logIn,
			logOut,
			passwordResetEmail,
			registration,
			editUser,
			deleteUser,
		} = UserAuth();
		const router = useRouter();

		// Wait for user to be loaded
		useEffect(() => {
			const checkAuthentication = async () => {
				await new Promise((resolve) => setTimeout(resolve, 500));
				setLoading(false);
			};
			checkAuthentication();
		}, []);

		if (loading) {
			return null; // Prevent rendering
		}

		// If the user is not authenticated, perform the redirection
		if (!user) {
			router.replace("/login");
			return null; // Prevent rendering
		}

		return (
			<Component
				user={user}
				role={role}
				cid={cid}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				registration={registration}
				editUser={editUser}
				deleteUser={deleteUser}
				{...props}
			/>
		);
	};
}
