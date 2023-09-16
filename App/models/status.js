import i18n from "../utils/i18n";

errorDict = {
	0: i18n.t("status.ready"),
	1: i18n.t("status.halted"),
	2: i18n.t("status.running"),
	3: i18n.t("status.waitPreconditions"),
	4: i18n.t("status.ended"),
	5: i18n.t("status.stopped"),
	6: i18n.t("status.equalizing"),
	7: i18n.t("status.manual"),
	8: i18n.t("status.newProcess"),
	9: i18n.t("status.delay"),
	12: i18n.t("status.highTempA"),
	13: i18n.t("status.lowTempA"),
	14: i18n.t("status.highHumA"),
	15: i18n.t("status.lowHumA"),
	16: i18n.t("status.externalA"),
	17: i18n.t("status.diffTempA"),
	18: i18n.t("status.diffHumA"),
	19: i18n.t("status.purge"),
	20: i18n.t("status.boiler"),
	24: i18n.t("status.highTempE"),
	25: i18n.t("status.lowHumE"),
	26: i18n.t("status.voltage"),
	27: i18n.t("status.externalE"),
	28: i18n.t("status.diffTempE"),
	29: i18n.t("status.diffHumE"),
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
