import Table from "@/components/Table";

const Users = () => {
	const columns = [
		{
			header: "Full Name",
			accessorKey: "fullName",
		},
		{
			header: "Email",
			accessorKey: "email",
		},
		{
			header: "Role",
			accessorKey: "role",
		},
	];

	return (
		<div className="flex justify-center">
			<div className="w-11/12">
				<Table type="users" commonColumns={columns} />
			</div>
		</div>
	);
};

export default Users;

export const metadata = {
	title: "Users",
	description: "Users page",
};
