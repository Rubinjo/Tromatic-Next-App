import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";

import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, update } from "firebase/database";

// import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import CompactSlider from "../components/CompactSlider"

import Counter from "../components/Counter";
import AnimatedFan from "../components/AnimatedFan"
import humidity from "../data/dummy-data-humi";
import { directionTitle, directionValue, opModeTitle, opModeFanTitle } from "../utils/helper";

//import CompactSlider from '../components/CompactSlider';

import { useSelector } from "react-redux";

import LineChart from "../components/LineChart";
import LineChart2 from "../components/Home";
import Home from "../components/Home";
//import Config from "../utils/config";

//import { MaterialCommunityIcons } from "@expo/vector-icons";

const GraphScreen = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [areChanges, setAreChanges] = useState(false);
  const [dataFB, setDataFB] = useState({})
  const [data, setData] = useState({
    currentHum: 0,
    currentTemp: 0,
    damperPos: 0,
    EMCOffset: 0,
    fanDirection: 0,
    heatingValvePos: 0,
    numOfWmProbes: 0,
    RPM: 0,
    remainingTime: 0,
    setPointHum: 0,
    setPointTemp: 0,
    sprayPos: 0,
    status: 0,
    tempOffset: 0,
    numOfCTProbes: 0,
    damperOpMode: 0,
    heaterOpMode: 0,
    sprayOpMode: 0,
    fansOpMode: 0,
    timestamp: new Date(),
    CTs: [{ id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 }, { id: 4, value: 0 }, { id: 5, value: 0 }, { id: 6, value: 0 }, { id: 7, value: 0 }, { id: 8, value: 0 }, { id: 9, value: 0 }, { id: 10, value: 0 }, { id: 11, value: 0 }, { id: 12, value: 0 }],
    WMs: [{ id: 1, value: 0, active: false }, { id: 2, value: 0, active: false }, { id: 3, value: 0, active: false }, { id: 4, value: 0, active: false }, { id: 5, value: 0, active: false }, { id: 6, value: 0, active: false }, { id: 7, value: 0, active: false }, { id: 8, value: 0, active: false }, { id: 9, value: 0, active: false }, { id: 10, value: 0, active: false }],
  });

  useEffect(() => {
    const db = getDatabase();
    const machineRef = ref(db, "machines/" + props.route.params.machineId);
    onValue(machineRef, (snapshot) => {
      const machine = snapshot.val();
      setDataFB({
        ...dataFB,
        currentHum: machine.CurrentHum,
        currentTemp: machine.CurrentTemp,
        damperPos: machine.DamperPos,
        EMCOffset: machine.EMCOffset,
        fanDirection: machine.FanDirection,
        heatingValvePos: machine.HeatingValvePos,
        numOfWmProbes: machine.NumOfWmProbes,
        RPM: machine.RPM,
        remainingTime: machine.RemainingTime,
        totalTime: machine.TotalTime,
        setPointHum: machine.SetPointHum,
        setPointTemp: machine.SetPointTemp,
        sprayPos: machine.SprayPos,
        status: machine.Status,
        tempOffset: machine.TempOffset,
        numOfCTProbes: machine.NumOfCTProbes,
        damperOpMode: machine.DamperOpMode,
        heaterOpMode: machine.HeaterOpMode,
        sprayOpMode: machine.SprayOpMode,
        fansOpMode: machine.FansOpMode,
        timestamp: new Date(machine.Timestamp),
        CTs: [{ id: 1, value: machine.CTValue1 }, { id: 2, value: machine.CTValue2 }, { id: 3, value: machine.CTValue3 }, { id: 4, value: machine.CTValue4 }, { id: 5, value: machine.CTValue5 }, { id: 6, value: machine.CTValue6 }, { id: 7, value: machine.CTValue7 }, { id: 8, value: machine.CTValue8 }, { id: 9, value: machine.CTValue9 }, { id: 10, value: machine.CTValue10 }, { id: 11, value: machine.CTValue11 }, { id: 12, value: machine.CTValue12 }],
        WMs: [{ id: 1, value: machine.WMValue1, active: machine.WMActive1 }, { id: 2, value: machine.WMValue2, active: machine.WMActive2 }, { id: 3, value: machine.WMValue3, active: machine.WMActive3 }, { id: 4, value: machine.WMValue4, active: machine.WMActive4 }, { id: 5, value: machine.WMValue5, active: machine.WMActive5 }, { id: 6, value: machine.WMValue6, active: machine.WMActive6 }, { id: 7, value: machine.WMValue7, active: machine.WMActive7 }, { id: 8, value: machine.WMValue8, active: machine.WMActive8 }, { id: 9, value: machine.WMValue9, active: machine.WMActive9 }, { id: 10, value: machine.WMValue10, active: machine.WMActive10 }]
      });
    });
  }, []);

  useEffect(() => {
    if (areChanges == false) {
      setData(dataFB)
    }
  }, [dataFB])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: (props) =>
        areChanges ? (
          <TouchableOpacity onPress={sendData} style={{ marginRight: 12 }}>
            <MaterialCommunityIcons name={"check"} size={34} color={"white"} />
          </TouchableOpacity>
        ) : (
          <View></View>
        ),
    });
  }, [areChanges, data]);

  const onWMChange = (id, value, active) => {
    const newArray = [...data.WMs]
    newArray.splice(id - 1, 1)
    newArray.splice(id - 1, 0, { id: id, value: value, active: active })
    onChange("WMs", newArray)
  }

  const onChange = (item, value) => {
    setAreChanges(true);
    setData({ ...data, [item]: value });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(dataFB)
      setAreChanges(false);
      setRefreshing(false);
    }, 1000)
  };

  const sendData = () => {
    const db = getDatabase();
    const updates = {};
    if (data.setPointTemp != dataFB.setPointTemp) {
      updates["machines/" + props.route.params.machineId + "/SetPointTemp"] =
        data.setPointTemp;
    }
    if (data.setPointHum != dataFB.setPointHum) {
      updates["machines/" + props.route.params.machineId + "/SetPointHum"] =
        data.setPointHum;
    }
    if (data.WMs[0].active != dataFB.WMs[0].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive1"] =
        data.WMs[0].active;
    }
    if (data.WMs[1].active != dataFB.WMs[1].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive2"] =
        data.WMs[1].active;
    }
    if (data.WMs[2].active != dataFB.WMs[2].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive3"] =
        data.WMs[2].active;
    }
    if (data.WMs[3].active != dataFB.WMs[3].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive4"] =
        data.WMs[3].active;
    }
    if (data.WMs[4].active != dataFB.WMs[4].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive5"] =
        data.WMs[4].active;
    }
    if (data.WMs[5].active != dataFB.WMs[5].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive6"] =
        data.WMs[5].active;
    }
    if (data.WMs[6].active != dataFB.WMs[6].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive7"] =
        data.WMs[6].active;
    }
    if (data.WMs[7].active != dataFB.WMs[7].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive8"] =
        data.WMs[7].active;
    }
    if (data.WMs[8].active != dataFB.WMs[8].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive9"] =
        data.WMs[8].active;
    }
    if (data.WMs[9].active != dataFB.WMs[9].active) {
      updates["machines/" + props.route.params.machineId + "/WMActive10"] =
        data.WMs[9].active;
    }
    updates["machines/" + props.route.params.machineId + "/Timestamp"] =
      new Date().toISOString();
    const auth = getAuth();
    updates["machines/" + props.route.params.machineId + "/LastEditor"] =
      "u" + auth.currentUser.uid;
    update(ref(db), updates);
    setAreChanges(false);
  };

  const [activeTimeNum, setActiveTimeNum] = useState(3);

  // Load graph from the redux store
  const graphPar = useSelector((state) => state.graph.graph);

  const selectGraphTime = (timeNum) => {
    setActiveTimeNum(timeNum);
  };

  return (
    <View>
      <TouchableOpacity
        style={{
          width: "100%",
          marginBottom: "auto",
          borderTopWidth: 1,
          borderBottomWidth: 1,
          flexDirection: "row",
          alignItems: "center",
        }}
        onPress={() => {
          props.navigation.navigate("GraphSelector");
        }}
      >
        <Text
          style={{
            marginLeft: Config.deviceWidth * 0.04,
            fontFamily: "noto-sans-jp-regular",
          }}
        >
          Variable selector
        </Text>
        <MaterialCommunityIcons name={"menu-right"} size={34} color={"black"} />
      </TouchableOpacity>
      <LineChart timer={activeTimeNum} />
      {/* <LineChart2 timer={activeTimeNum} /> */}
      {/* <Home /> */}
      {/*weird example*/}
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(24);
          }}
          style={
            activeTimeNum == 24
              ? [styles.selectionContainerActive, { borderRightWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 24
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(9);
          }}
          style={
            activeTimeNum == 9
              ? [
                  styles.selectionContainerActive,
                  { borderLeftWidth: 1, borderRightWidth: 1 },
                ]
              : activeTimeNum == 9
              ? [styles.selectionContainer, { borderRightWidth: 1 }]
              : [styles.selectionContainer, { borderLeftWidth: 1 }]
          }
        >
          <Text
            style={
              activeTimeNum == 9
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            9 hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(3);
          }}
          style={
            activeTimeNum == 3
              ? [
                  styles.selectionContainerActive,
                  { borderLeftWidth: 1, borderRightWidth: 1 },
                ]
              : activeTimeNum == 3
              ? [styles.selectionContainer, { borderLeftWidth: 1 }]
              : [styles.selectionContainer, { borderRightWidth: 1 }]
          }
        >
          <Text
            style={
              activeTimeNum == 3
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            3 hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(1);
          }}
          style={
            activeTimeNum == 1
              ? [styles.selectionContainerActive, { borderLeftWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 1
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 hour
          </Text>
        </TouchableOpacity>
      </View>
      <Text>Time test</Text>
      <View style={{ marginTop: -8, marginBottom: 8, height: Config.deviceHeight * 0.04 }}>
        <CompactSlider remainingTime={dataFB.remainingTime} totalTime={dataFB.totalTime}/>
      </View>
      <Text>List test:</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  selectionContainerActive: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    backgroundColor: "lightgray",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  selectionText: {
    textAlign: "center",
    fontFamily: "noto-sans-jp-regular",
  },
  selectionTextActive: {
    textAlign: "center",
    fontFamily: "noto-sans-jp-bold",
  },
});

export default GraphScreen;
