import LoginForm from "@/components/LoginForm";

const Login = () => {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gray-100">
			<LoginForm />
		</div>
	);
};

export default Login;

export const metadata = {
	title: "Login",
	description: "Login page",
};
