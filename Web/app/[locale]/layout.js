import "./globals.css";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { NextIntlClientProvider } from "next-intl";
import { notFound } from "next/navigation";

export function generateStaticParams() {
	return [{ locale: "en" }, { locale: "de" }];
}

export const metadata = {
	icons: {
		icon: [
			{
				media: "(prefers-color-scheme: light)",
				url: "/bes_bollmann_icon_blue.svg",
			},
			{
				media: "(prefers-color-scheme: dark)",
				url: "/bes_bollmann_icon_white.svg",
			},
		],
	},
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children, params: { locale } }) {
	let messages;
	try {
		messages = (await import(`../../messages/${locale}.json`)).default;
	} catch (error) {
		notFound();
	}
	return (
		<html lang={locale}>
			<body className={inter.className}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					{children}
					<ToastContainer
						position="top-center"
						autoClose={5000}
						hideProgressBar={false}
						newestOnTop={false}
						closeOnClick
						rtl={false}
						pauseOnFocusLoss
						draggable={false}
						pauseOnHover
						theme="colored"
					/>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
