"use client";

import React, { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { getCookie, setCookie } from "cookies-next";

import { UserAuth } from "../context/AuthContext";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

import BesBollmannIcon from "@/public/BesBollmannIcon";

const languages = [
	{
		id: 1,
		name: "English",
		locale: "en",
		flag: (
			<div className="flex flex-row">
				<Image
					className="pr-0.5"
					src="/flags/united-kingdom.png"
					width={18}
					height={18}
					alt="UK-Flag"
				/>
				<Image
					src="/flags/united-states-of-america.png"
					width={18}
					height={18}
					alt="USA-Flag"
				/>
			</div>
		),
	},
	{
		id: 2,
		name: "Nederlands",
		locale: "nl",
		flag: (
			<Image
				src="/flags/netherlands.png"
				width={18}
				height={18}
				alt="NL-Flag"
			/>
		),
	},
	{
		id: 3,
		name: "Deutsch",
		locale: "de",
		flag: (
			<Image
				src="/flags/germany.png"
				width={18}
				height={18}
				alt="DE-Flag"
			/>
		),
	},
];

const Navbar = () => {
	const { user, logOut } = UserAuth();
	const [loading, setLoading] = useState(true);
	const [selectedLanguage, setSelectedLanguage] = useState(
		languages.find(
			(language) => language.locale === getCookie("NEXT_LOCALE")
		)
	);

	const handleLogOut = async () => {
		try {
			await logOut();
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		setCookie("NEXT_LOCALE", selectedLanguage.locale, { sameSite: true });
	}, [selectedLanguage]);

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};
		checkAuthentication();
	}, [user]);

	return (
		<div className="flex justify-center h-14 bg-primary">
			<div className="flex w-5/6">
				<ul className="flex justify-between items-center w-1/3">
					{user ? (
						<>
							<li className="flex cursor-pointer">
								<Link
									href="/portal"
									className="text-white font-semibold"
								>
									<BesBollmannIcon
										className="px-2"
										width={32}
										height={32}
									/>

									{/* <Image
										src="/bes_bollmann_icon_white.svg"
										alt="Tromatic Next"
										fill
										style={{ objectFit: "contain" }}
										// width={110}
										// height={50}
										// layout="responsive"
									/> */}
								</Link>
							</li>
							<li className="flex cursor-pointer">
								<Link
									href="/portal/machines"
									className="text-white font-semibold"
								>
									Machines
								</Link>
							</li>
							<li className="px-4 cursor-pointer">
								<Link
									href="/portal/users"
									className="text-white font-semibold"
								>
									Users
								</Link>
							</li>
						</>
					) : (
						<li />
					)}
				</ul>
				<ul className="w-1/2" />
				<ul className="flex justify-between items-center w-1/6">
					<Listbox
						value={selectedLanguage}
						onChange={setSelectedLanguage}
					>
						<Listbox.Button className="px-4 flex">
							<span className="text-white font-semibold">
								Language
							</span>
							<span className="pointer-events-none flex items-center">
								<FaChevronDown
									className="h-4 w-4 text-white"
									aria-hidden="true"
								/>
							</span>
						</Listbox.Button>
						<Transition
							as={Fragment}
							leave="transition ease-in duration-100"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<Listbox.Options className="absolute z-50 mt-44 p-1 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
								<ul>
									{languages.map((language, languageIdx) => (
										<Listbox.Option
											key={languageIdx}
											className={({ active }) =>
												`relative cursor-pointer py-2 pl-10 pr-2 ${
													active
														? "bg-primary bg-opacity-20 text-secondary"
														: "text-gray-900"
												}`
											}
											value={language}
										>
											{({ active, selected }) => (
												<>
													<div className="flex flex-row">
														{language.flag}
														<span
															className={`block truncate px-2 ${
																selected
																	? "font-medium"
																	: "font-normal"
															}`}
														>
															{language.name}
														</span>
													</div>

													{selected ? (
														<span
															className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
																active
																	? "text-secondary"
																	: "text-black"
															}`}
														>
															<FaCheck
																className="h-4 w-4"
																aria-hidden="true"
															/>
														</span>
													) : null}
												</>
											)}
										</Listbox.Option>
									))}
								</ul>
							</Listbox.Options>
						</Transition>
					</Listbox>

					{user ? (
						<li
							className="px-4 cursor-pointer text-white font-semibold"
							onClick={handleLogOut}
						>
							Logout
						</li>
					) : (
						<li />
					)}
				</ul>
			</div>
		</div>
	);
};

export default Navbar;
