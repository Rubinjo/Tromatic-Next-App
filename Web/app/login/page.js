"use client";
import { withPublic } from "@/context/Route";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

function Login({ logIn }) {
	const handleLogIn = async (event) => {
		event.preventDefault();
		const formData = new FormData(event.target);
		const values = Object.fromEntries(formData);
		try {
			await logIn(values.email, values.password);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="flex items-center justify-center min-h-screen py-2 bg-gray-100">
			<Head>
				<title>Login</title>
				<link rel="icon" href="./favicon.ico" />
			</Head>
			<form
				onSubmit={handleLogIn}
				className="flex flex-col justify-center bg-white rounded-2xl shadow-2xl w-1/2 max-w-4xl p-5"
			>
				<div className="flex-1 font-bold">
					<span className="text-secondary">App</span> Portal
				</div>
				<div className=" flex flex-col py-10 items-center">
					<h2 className="text-3xl font-bold text-secondary mb-2">
						Sign in to Account
					</h2>
					<div className="border-2 w-10 border-secondary inline-block mb-2" />
					<div className="flex flex-col items-center">
						<div className="bg-gray-100 w-64 p-2 flex items-center mb-3 ">
							<FaRegEnvelope className="text-gray-400 m-2" />
							<input
								type="email"
								name="email"
								placeholder="Email"
								className="bg-gray-100 outline-none text-sm flex-1"
								required
							/>
						</div>
						<div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
							<MdLockOutline className="text-gray-400 m-2" />
							<input
								type="password"
								name="password"
								placeholder="Password"
								className="bg-gray-100 outline-none text-sm flex-1"
								required
							/>
						</div>
					</div>
					<div className="flex flex-row-reverse w-64 mb-5">
						<Link href="/login/forgot" className="text-xs">
							Forgot Password?
						</Link>
					</div>
					<button
						type="submit"
						className="border-2 border-secondary text-secondary rounded-full px-12 py-2 inline-block font-semibold hover:bg-secondary hover:text-white"
					>
						Sign In
					</button>
				</div>
			</form>
		</div>
	);
}

export default withPublic(Login);
