import Table from "@/components/Table";
import { useTranslations } from "next-intl";
import { unstable_setRequestLocale } from "next-intl/server";

const Company = ({ params: { locale } }) => {
	unstable_setRequestLocale(locale);
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
				<Table type="company" commonColumns={columns} />
			</div>
		</div>
	);
};

export default Company;

export const metadata = {
	title: "Company",
	description: "Company page",
};
