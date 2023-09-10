import React from "react";
import { UserAuth } from "./AuthContext";
import { useRouter } from "next/navigation";

export function withPublic(Component) {
	return function WithPublic(props) {
		const auth = UserAuth();
		const router = useRouter();

		if (auth.user) {
			router.replace("/machines");
			return <h1>Loading...</h1>;
		}

		return <Component auth={auth} {...props} />;
	};
}

export function withProtected(Component) {
	return function WithProtected(props) {
		const auth = UserAuth();
		const router = useRouter();

		if (!auth.user) {
			router.replace("/login");
			return <h1>Loading...</h1>;
		}

		return <Component auth={auth} {...props} />;
	};
}
