"use client";

import React, { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Error({ error, reset }) {
	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<div className="min-h-full bg-white px-4 py-16 sm:px-6 sm:py-24 md:grid md:place-items-center lg:px-8">
			<Head>
				<title>Error</title>
				<link rel="icon" href="bes_bollmann_icon_white.svg" />
			</Head>
			<div className="mx-auto max-w-max">
				<main className="sm:flex">
					<p className="bg-secondary bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
						500
					</p>
					<div className="sm:ml-6">
						<div className="sm:border-l sm:border-gray-200 sm:pl-6">
							<h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
								Internal Server Error
							</h1>
							<p className="mt-1 text-base text-gray-500">
								{error.message}
							</p>
						</div>
						<div className="mt-10 flex space-x-3 sm:border-l sm:border-transparent sm:pl-6">
							<button
								className="border-2 inline-flex items-center rounded-md  border-secondary text-secondary px-4 py-2 text-sm font-medium shadow-sm hover:bg-secondary hover:text-white"
								onClick={reset}
							>
								Try again
							</button>
							<Link
								href="/support"
								className="border-2 inline-flex items-center rounded-md border-secondary text-secondary px-4 py-2 text-sm font-medium hover:bg-secondary hover:text-white"
							>
								Contact support
							</Link>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
