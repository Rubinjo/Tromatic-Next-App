import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/context/AuthContext";

import { unstable_setRequestLocale } from "next-intl/server";

export default async function Layout({ children, params: { locale } }) {
	unstable_setRequestLocale(locale);
	return (
		<AuthContextProvider>
			<Navbar />
			{children}
		</AuthContextProvider>
	);
}
