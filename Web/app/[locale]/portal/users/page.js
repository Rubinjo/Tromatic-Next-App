import Table from "@/components/Table";
import { useTranslations } from "next-intl";

const Users = () => {
	const t = useTranslations("Table");

	const columns = [
		{
			header: t("fullName"),
			accessorKey: "fullName",
		},
		{
			header: t("email"),
			accessorKey: "email",
		},
		{
			header: t("role"),
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
