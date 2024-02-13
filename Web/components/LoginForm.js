"use client";

import { useState } from "react";
import Link from "next/link";
import {useTranslations} from 'next-intl';

import { withPublic } from "@/context/Route";
import BesBollmannLogo from "@/public/BesBollmannLogo";
import TromaticNext from "@/public/TromaticNext";
import { FaRegEnvelope } from "react-icons/fa";
import { MdLockOutline } from "react-icons/md";

const LoginForm = ({ logIn }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const t = useTranslations("LoginForm");

	const handleLogIn = async (event) => {
		event.preventDefault();
		try {
			setLoading(true);
			const formData = new FormData(event.target);
			const values = Object.fromEntries(formData);
			await logIn(values.email, values.password);
			setLoading(false);
		} catch (error) {
			setError(() => {
				throw error;
			});
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center bg-white rounded-2xl shadow-2xl w-1/2 max-w-4xl p-5">
				<div className="flex-1 font-bold ml-2 mt-1">
					<BesBollmannLogo width={180} height={40} />
				</div>
				<form
					onSubmit={handleLogIn}
					className=" flex flex-col py-10 items-center"
				>
					<h2 className="text-3xl font-bold text-secondary mb-2">
						{t("signInAccount")}
					</h2>
					<div className="border-2 w-10 border-secondary inline-block mb-2" />
					<div className="flex flex-col items-center">
						<div className="bg-gray-100 w-64 p-2 flex items-center mb-3 ">
							<FaRegEnvelope className="text-gray-400 m-2" />
							<input
								type="email"
								name="email"
								placeholder={t("email")}
								className="bg-gray-100 outline-none text-sm flex-1"
								required
							/>
						</div>
						<div className="bg-gray-100 w-64 p-2 flex items-center mb-3">
							<MdLockOutline className="text-gray-400 m-2" />
							<input
								type="password"
								name="password"
								placeholder={t("password")}
								className="bg-gray-100 outline-none text-sm flex-1"
								required
							/>
						</div>
					</div>
					<div className="flex flex-row-reverse w-64 mb-5">
						<Link href="/portal/login/forgot" className="text-xs">
							{t("forgotPassword")}
						</Link>
					</div>
					{loading ? (
						<div
							className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
							role="status"
						>
							<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
								Loading...
							</span>
						</div>
					) : (
						<button
							type="submit"
							className="border-2 border-secondary text-secondary rounded-full px-12 py-2 inline-block font-semibold hover:bg-secondary hover:text-white"
						>
							{t("signIn")}
						</button>
					)}
				</form>
			</div>
			<div className="flex items-end mt-32 text-secondary">
				<TromaticNext />
			</div>
		</>
	);
};

export default withPublic(LoginForm);
