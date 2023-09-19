import React from "react";

import Link from "next/link";

export default function Tab({ selection }) {
	return (
		<div>
			<ul class="hidden text-sm font-medium text-center shadow sm:flex">
				<li class="w-full">
					<Link
						href="/models/machines"
						class={
							"inline-block w-full p-4 rounded-l-lg focus:ring-2 focus:outline-none " +
							(selection === "machines"
								? "active text-white bg-primary"
								: "text-gray-500 bg-black-100 hover:text-gray-700 hover:bg-gray-50")
						}
					>
						Machines
					</Link>
				</li>
				<li class="w-full">
					<Link
						href="/models/users"
						class={
							"inline-block w-full p-4 rounded-r-lg focus:ring-2 focus:outline-none " +
							(selection === "users"
								? "active text-white bg-primary"
								: "text-gray-500 bg-black-100 hover:text-gray-700 hover:bg-gray-50")
						}
					>
						Users
					</Link>
				</li>
			</ul>
		</div>
	);
}
