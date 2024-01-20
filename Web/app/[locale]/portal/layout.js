import Navbar from "@/components/Navbar";
import { AuthContextProvider } from "@/context/AuthContext";

export default async function Layout({ children }) {
	return (
		<AuthContextProvider>
			<Navbar />
			{children}
		</AuthContextProvider>
	);
}
