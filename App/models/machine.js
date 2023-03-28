class Machine {
    constructor(id,
        companyId,
        type,
        creation,
        currentHum,
        currentTemp,
        damperPos,
        EMCOffset,
        fanDirection,
        heatingValvePos,
        numOfWmProbes,
        RPM,
        remainingTime,
        totalTime,
        setPointHum,
        setPointTemp,
        sprayPos,
        status,
        tempOffset,
        dateTimeMessage,
        numOfCTProbes,
        damperOpMode,
        heaterOpMode,
        sprayOpMode,
        fansOpMode,
        WMValue1,
        WMValue2,
        WMValue3,
        WMValue4,
        WMValue5,
        WMValue6,
        WMValue7,
        WMValue8,
        WMValue9,
        WMValue10,
        WMActive1,
        WMActive2,
        WMActive3,
        WMActive4,
        WMActive5,
        WMActive6,
        WMActive7,
        WMActive8,
        WMActive9,
        WMActive10
    ) {
        this.id = id;
        this.companyId = companyId;
        this.type = type;
        this.creation = creation;
        this.currentHum = currentHum;
        this.currentTemp = currentTemp;
        this.damperPos = damperPos;
        this.EMCOffset = EMCOffset;
        this.fanDirection = fanDirection;
        this.heatingValvePos = heatingValvePos;
        this.numOfWmProbes = numOfWmProbes;
        this.RPM = RPM;
        this.remainingTime = remainingTime;
        this.totalTime = totalTime;
        this.setPointHum = setPointHum;
        this.setPointTemp = setPointTemp;
        this.sprayPos = sprayPos;
        this.status = status;
        this.tempOffset = tempOffset;
        this.dateTimeMessage = dateTimeMessage;
        this.numOfCTProbes = numOfCTProbes;
        this.damperOpMode = damperOpMode;
        this.heaterOpMode = heaterOpMode;
        this.sprayOpMode = sprayOpMode;
        this.fansOpMode = fansOpMode;
        this.WMValue1 = WMValue1;
        this.WMValue2 = WMValue2;
        this.WMValue3 = WMValue3;
        this.WMValue4 = WMValue4;
        this.WMValue5 = WMValue5;
        this.WMValue6 = WMValue6;
        this.WMValue7 = WMValue7;
        this.WMValue8 = WMValue8;
        this.WMValue9 = WMValue9;
        this.WMValue10 = WMValue10;
        this.WMActive1 = WMActive1;
        this.WMActive2 = WMActive2;
        this.WMActive3 = WMActive3;
        this.WMActive4 = WMActive4;
        this.WMActive5 = WMActive5;
        this.WMActive6 = WMActive6;
        this.WMActive7 = WMActive7;
        this.WMActive8 = WMActive8;
        this.WMActive9 = WMActive9;
        this.WMActive10 = WMActive10;
    }
}

export default Machine;
