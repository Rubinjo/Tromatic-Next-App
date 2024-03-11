import { NextResponse } from "next/server";

export async function POST(req) {
	const locale = req.nextUrl.searchParams.get("lang");
	const response = NextResponse.json({ status: 200 });

	response.cookies.set({
		name: "__session",
		value: JSON.stringify({ NEXT_LOCALE: locale }),
		// httpOnly: true,
		maxAge: 31536000,
		path: "/",
		sameSite: "lax",
	});

	return response;
}
