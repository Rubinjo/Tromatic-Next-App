"use client";

import React, { useEffect } from "react";
import { UserAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export function withPublic(Component) {
	return function WithPublic(props) {
		const { user, logIn, logOut, passwordResetEmail } = UserAuth();
		const router = useRouter();

		useEffect(() => {
			if (user) {
				router.replace("/models/machines");
				return () => {
					<h1>Loading...</h1>;
				};
			}
		}, [user]);

		return (
			<Component
				user={user}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				{...props}
			/>
		);
	};
}

export function withProtected(Component) {
	return function WithProtected(props) {
		const { user, logIn, logOut, passwordResetEmail } = UserAuth();
		const router = useRouter();
		console.log(user);

		useEffect(() => {
			if (!user) {
				router.replace("/login");
				return () => {
					<h1>Loading...</h1>;
				};
			}
		}, [user]);

		return (
			<Component
				user={user}
				logIn={logIn}
				logOut={logOut}
				passwordResetEmail={passwordResetEmail}
				{...props}
			/>
		);
	};
}
