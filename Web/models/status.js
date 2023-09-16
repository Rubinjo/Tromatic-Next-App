const errorDict = {
	0: "Ready",
	1: "Halted",
	2: "Running",
	3: "Waiting for pre-conditions",
	4: "Program ended",
	5: "Program stopped by error",
	6: "Equalizing phase",
	7: "Manual mode active",
	8: "Program new process data",
	9: "Start delay",
	12: "High temperature alarm",
	13: "Low temperature alarm",
	14: "High humidity alarm",
	15: "Low humidity alarm",
	16: "External alarm",
	17: "Temperature difference alarm",
	18: "Humidity difference alarm",
	19: "Purge active",
	20: "Boiler protection",
	24: "High temperature error",
	25: "Low humidity error",
	26: "Reference voltage error",
	27: "External error",
	28: "Temperature difference error",
	29: "Humidity difference error",
};

class Status {
	constructor(num) {
		const bitString = num.toString(2);
		const bitArray = bitString.split("").reverse();
		this.statusNums = [];
		this.statusStrings = [];
		for (let i = 0; i < bitArray.length; i++) {
			if (parseInt(bitArray[i]) === 1) {
				this.statusNums.push(i);
				this.statusStrings.push(errorDict[i]);
			}
		}
	}
}

export default Status;
