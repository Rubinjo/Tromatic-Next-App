"use client";

import { useState } from "react";
import {useTranslations} from "next-intl";

import BesBollmannLogo from "@/public/BesBollmannLogo";
import TromaticNext from "@/public/TromaticNext";
import { FaRegEnvelope } from "react-icons/fa";
import { withPublic } from "@/context/Route";

const ForgotForm = ({ passwordResetEmail }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState();

	const t = useTranslations("ForgotForm");

	const handlePasswordResetEmail = async (event) => {
		event.preventDefault();

		try {
			setLoading(true);
			const formData = new FormData(event.target);
			const values = Object.fromEntries(formData);
			await passwordResetEmail(values.email);
			setLoading(false);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<>
			<div className="flex flex-col justify-center bg-white rounded-2xl shadow-2xl w-1/2 max-w-4xl p-5">
				<div className="flex-1 font-bold ml-2 mt-1">
					<BesBollmannLogo width={180} height={40} />
				</div>
				<form
					onSubmit={handlePasswordResetEmail}
					className=" flex flex-col py-10 items-center"
				>
					<h2 className="text-3xl font-bold text-secondary mb-2">
						Forgot Password
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
							Reset Password
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

export default withPublic(ForgotForm);
