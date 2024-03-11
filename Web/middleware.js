import createMiddleware from "next-intl/middleware";

export default function middleware(req) {
	const localeServer = JSON.parse(req.cookies.get("__session").value);

	// Set cookie on request so that next-intl can use it
	req.cookies.set({
		name: "NEXT_LOCALE",
		value: localeServer.NEXT_LOCALE,
		// httpOnly: true,
		maxAge: 31536000,
		path: "/",
		sameSite: "lax",
	});

	const handleI18nRouting = createMiddleware({
		// A list of all locales that are supported
		locales: ["en", "nl", "de"],

		// If this locale is matched, pathnames work without a prefix (e.g. `/about`)
		defaultLocale: "en",

		localePrefix: "never",
	});
	const res = handleI18nRouting(req);

	// Set cookie on response so it is also saved on the client
	res.cookies.set({
		name: "NEXT_LOCALE",
		value: localeServer.NEXT_LOCALE,
		// httpOnly: true,
		maxAge: 31536000,
		path: "/",
		sameSite: "lax",
	});

	return res;
}

export const config = {
	// Skip all paths that should not be internationalized. This example skips
	// certain folders and all pathnames with a dot (e.g. favicon.ico)
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
