import Table from "@/components/Table";

const Machines = () => {
	const columns = [
		{
			header: "Active",
			accessorKey: "active",
		},
		{
			header: "ID",
			accessorKey: "id",
		},
		{
			header: "Display Name",
			accessorKey: "machineName",
		},
		{
			header: "Status Code",
			accessorKey: "status",
		},
		{
			header: "Last Editor",
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
