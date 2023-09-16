import React, { useEffect, useState, Fragment } from "react";
import Link from "next/link";

import { UserAuth } from "../context/AuthContext";
import { Listbox, Transition } from "@headlessui/react";
import { FaChevronDown, FaCheck } from "react-icons/fa";

const languages = [
	{ id: 1, name: "English" },
	{ id: 2, name: "Nederlands" },
	{ id: 3, name: "Deutsch" },
];

const Navbar = () => {
	const { user, logOut } = UserAuth();
	const [loading, setLoading] = useState(true);
	const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

	const handleLogOut = async () => {
		try {
			await logOut();
		} catch (e) {
			console.log(e);
		}
	};

	useEffect(() => {
		const checkAuthentication = async () => {
			await new Promise((resolve) => setTimeout(resolve, 50));
			setLoading(false);
		};
		checkAuthentication();
	}, [user]);

	return (
		<div className="flex justify-between bg-primary">
			{user ? (
				<ul className="flex">
					<li className="p-2 cursor-pointer">
						<Link
							href="/machines"
							className="text-white font-semibold"
						>
							Machines
						</Link>
					</li>
					<li className="p-2 cursor-pointer">
						<Link
							href="/users"
							className="text-white font-semibold"
						>
							Users
						</Link>
					</li>
				</ul>
			) : (
				<ul />
			)}
			<ul className="flex p-2">
				<Listbox
					value={selectedLanguage}
					onChange={setSelectedLanguage}
				>
					<Listbox.Button className="flex items-center">
						<span className="block truncate text-white font-semibold">
							{selectedLanguage.name}
						</span>
						<span className="pointer-events-none flex items-center pr-2">
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
						<Listbox.Options className="absolute mt-10 overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
							<ul>
								{languages.map((language, languageIdx) => (
									<Listbox.Option
										key={languageIdx}
										className={({ active }) =>
											`relative cursor-pointer py-2 pl-10 pr-4 ${
												active
													? "bg-primary bg-opacity-20 text-secondary"
													: "text-gray-900"
											}`
										}
										value={language}
									>
										{({ active, selected }) => (
											<>
												<span
													className={`block truncate ${
														selected
															? "font-medium"
															: "font-normal"
													}`}
												>
													{language.name}
												</span>
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

				{/* {user ? ( */}
				<li
					className="cursor-pointer text-white font-semibold"
					onClick={handleLogOut}
				>
					Logout
				</li>
				{/* ) : (
					<li />
				)} */}
			</ul>
		</div>
	);
};

export default Navbar;
