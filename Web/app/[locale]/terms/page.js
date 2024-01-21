import TromaticNext from "@/public/TromaticNext";

const Terms = () => {
	return (
		<div className="flex flex-col items-center min-h-screen bg-gray-100">
			<div className="m-16">
				<TromaticNext />
			</div>
			<div className="max-w-4xl mb-10">
				<h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
				<h2 className="text-xl font-semibold mb-4">
					Last Updated: 21/01/2024
				</h2>
				<p className="mb-4">
					Thank you for choosing Tromatic NEXT - our cutting-edge
					Drying Chamber Monitoring and Control Application. Before
					using the Service, please carefully review the following
					terms and conditions. By accessing or using Tromatic NEXT,
					you agree to be bound by these Terms of Service.
				</p>
				<h2 className="text-xl font-semibold mb-2">
					1. General safety
				</h2>
				<p className="mb-4">
					Users must strictly adhere to all safety guidelines and
					regulations relevant to drying chamber operations that are
					established by the equipment manufacturer. Tromatic NEXT is
					not a substitute for proper safety practices, and users bear
					the responsibility for ensuring the safe operation of their
					drying solutions.
				</p>
				<h2 className="text-xl font-semibold mb-2">
					2. Collected information
				</h2>
				<p>
					When you use our Application, we may collect certain
					information about you, including:
				</p>
				<ul className="list-disc pl-6 mb-4">
					<li>
						Personal Information: We may collect information that
						can be used to identify you, such as your name and email
						address, when you create an account or contact us.
					</li>
					<li>
						Usage Information: We may collect information about your
						use of the Application, such as the features you use,
						the pages you visit, the time and date of your visits,
						and the content you access and download.
					</li>
					<li>
						Device Information: We may collect information about the
						device you use to access our Application, such as the
						hardware model, operating system version, browser type,
						language, and mobile network information.
					</li>
				</ul>
				<h2 className="text-xl font-semibold mb-2">
					3. How we use your information
				</h2>
				<ul className="list-disc pl-6 mb-4">
					<li>
						Improve our App: We may use your information to operate
						and maintain the App, to personalize your experience, to
						respond to your requests and inquiries, and to develop
						and improve the App and our other products and services.
					</li>
					<li>
						Analyze and monitor usage: We may use your information
						to analyze and monitor user behavior and usage patterns,
						to better understand how users interact with the App and
						our other products and services, and to identify
						potential security risks and vulnerabilities.
					</li>
					<li>
						Protect our rights and comply with laws: We may use your
						information to protect our rights, property, or safety,
						or the rights, property, or safety of others, and to
						comply with applicable laws and regulations.
					</li>
					<li>
						Third party service providers: We may share your
						information with third party service providers who
						perform services on our behalf, such as payment
						processing, email delivery, and hosting services.
					</li>
				</ul>
				<h2 className="text-xl font-semibold mb-2">4. Data security</h2>
				<p className="mb-4">
					We take reasonable measures to protect your information
					against unauthorized access, alteration, or destruction;
					however, no data transmission or storage can be guaranteed
					to be 100% secure. Please note that we cannot ensure or
					warrant the security of any information we collect or store.
				</p>
				<h2 className="text-xl font-semibold mb-2">
					5. Data retention
				</h2>
				<p className="mb-4">
					We retain your information for as long as necessary to
					fulfill the purposes outlined in this Privacy Policy, unless
					a longer retention period is required or permitted by law.
				</p>
				<h2 className="text-xl font-semibold mb-2">
					6. Changes to this Privacy Policy
				</h2>
				<p className="mb-4">
					We may update this Privacy Policy from time to time in our
					sole discretion. If we make any changes, we will post a new
					privacy policy on this page and update the date at the top
					of this Privacy Policy.
				</p>
				<h2 className="text-xl font-semibold mb-2">7. Contacting us</h2>
				<p className="mb-4">
					If you have any questions or concerns regarding this Privacy
					Policy or the application, please feel free to reach out to
					us at{" "}
					<a
						href="mailto:info@rtrsolutions.nl"
						className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
					>
						info@rtrsolutions.nl
					</a>
					.
				</p>
			</div>
		</div>
	);
};

export default Terms;
