import ForgotForm from "@/components/ForgotForm";
import { unstable_setRequestLocale } from "next-intl/server";

const Forgot = ({ params: { locale } }) => {
	unstable_setRequestLocale(locale);
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
			<ForgotForm />
		</div>
	);
};

export default Forgot;

export const metadata = {
	title: "Forgot Password",
	description: "Forgot Password page",
};
