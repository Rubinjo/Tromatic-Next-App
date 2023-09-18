"use client";

import React from "react";

import { withProtected } from "@/context/Route";

function Users() {
	return <div>page</div>;
}

export default withProtected(Users);
