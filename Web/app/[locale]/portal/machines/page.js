import Table from "@/components/Table";
import { useTranslations } from "next-intl";

const Machines = () => {
	const t = useTranslations("Machines");

	const columns = [
		{
			header: t("active"),
			accessorKey: "active",
		},
		{
			header: "ID",
			accessorKey: "id",
		},
		{
			header: t("displayName"),
			accessorKey: "machineName",
		},
		{
			header: t("statusCode"),
			accessorKey: "status",
		},
		{
			header: t("lastEditor"),
			accessorKey: "lastEditor",
		},
	];

	return (
		<div className="flex justify-center">
			<div className="w-11/12">
				<Table type="machines" commonColumns={columns} />
			</div>
		</div>
	);
};

export default Machines;

export const metadata = {
	title: "Machines",
	description: "Machines page",
};
