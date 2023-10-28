class Machine {
	constructor(options) {
		this.id = options.id;
		this.companyId = options.companyId;
		this.machineName = options.machineName;
		this.creation = options.creation;
		this.active = options.active;
		this.status = options.status;
		this.dateTimeMessage = options.dateTimeMessage;
		this.lastEditor = options.lastEditor;
	}
}

export default Machine;
