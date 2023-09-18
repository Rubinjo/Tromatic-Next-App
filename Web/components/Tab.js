import React from "react";

import Link from "next/link";

export default function Tab({ selection }) {
	return (
		<div>
			<Link href="/models/machines">Machines</Link>
			<Link href="/models/users">Users</Link>
		</div>
	);
}
