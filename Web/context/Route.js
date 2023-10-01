"use client";

import React, { useEffect, useState } from "react";
import { UserAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export function withPublic(Component) {
	return function WithPublic(props) {
		const [loading, setLoading] = useState(true);
		const { user, role, logIn, logOut, passwordResetEmail, registration } =
			UserAuth();
		const router = useRouter();

		useEffect(() => {
			const checkAuthentication = async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
				setLoading(false);
			};
			checkAuthentication();
		}, [user]);

		useEffect(() => {
			if (user && !loading) {
				router.replace("/machines");
				return () => {
					<h1>Loading...</h1>;
				};
			}
		}, [user]);

		return (
			<Component
				user={user}
				role={role}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				registration={registration}
				{...props}
			/>
		);
	};
}

export function withProtected(Component) {
	return function WithProtected(props) {
		const [loading, setLoading] = useState(true);
		const { user, role, logIn, logOut, passwordResetEmail, registration } =
			UserAuth();
		const router = useRouter();

		useEffect(() => {
			const checkAuthentication = async () => {
				await new Promise((resolve) => setTimeout(resolve, 50));
				setLoading(false);
			};
			checkAuthentication();
		}, [user]);

		useEffect(() => {
			if (!user && !loading) {
				router.replace("/login");
				return () => {
					<h1>Loading...</h1>;
				};
			}
		}, [user]);

		return (
			<Component
				user={user}
				role={role}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				registration={registration}
				{...props}
			/>
		);
	};
}
