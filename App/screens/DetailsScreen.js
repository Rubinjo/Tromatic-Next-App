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
import Fan from "../components/Fan"
import humidity from "../data/dummy-data-humi";
import { directionTitle, directionValue, opModeTitle, opModeFanTitle } from "../utils/helper";



const DetailsScreen = (props) => {
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

  // const navigation = useNavigation();
  // const route = useRoute();
  // const { itemId, otherParam } = route.params;
  // const { chamberId } = props.route.params;
  // const selectedChamber = CHAMBERS.find((chamId) => chamId.id === chamberId);
  return (
    <ScrollView
      refreshControl={<RefreshControl title={data.timestamp ? (i18n.t("general.lastUpdated") + ": " + (data.timestamp.toLocaleDateString() === new Date().toLocaleDateString() ? i18n.t("general.today") : data.timestamp.toLocaleDateString()) + " " + data.timestamp.toLocaleTimeString()) : ""} titleColor="black" refreshing={refreshing} onRefresh={onRefresh} />}
      style={styles.container}
    >
      <View style={{ marginTop: -8 }}>
        <CompactSlider remainingTime={dataFB.remainingTime} totalTime={dataFB.totalTime} />
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          height: Config.deviceHeight * 0.35,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              height: 5 + Config.deviceHeight * 0.04,
              width: 5 + Config.deviceHeight * 0.04,
              resizeMode: "contain",
            }}
            source={require("../assets/icons/thermometer.png")}
          />
          <Text>Temperature</Text>
          <Counter
            item={"setPointTemp"}
            actual={data.currentTemp}
            setter={data.setPointTemp}
            onChange={onChange}
          />
        </View>
        <View>
          <Fan
            rpm={data.RPM}
            direction={directionValue(data.fanDirection)}
          />
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{
              height: 5 + Config.deviceHeight * 0.04,
              width: 5 + Config.deviceHeight * 0.04,
              resizeMode: "contain",
            }}
            source={require("../assets/icons/humidity.png")}
          />
          <Text>Humidity</Text>
          <Counter
            item={"setPointHum"}
            actual={data.currentHum}
            setter={data.setPointHum}
            onChange={onChange}
          />
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: -42,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/valve.png")}
            />
            <Text>Valve</Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 2 }}>
            <Text>{opModeTitle(data.damperOpMode)}</Text>
            <Text>{data.damperPos}</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/heating.png")}
            />
            <Text>Heating</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>{opModeTitle(data.heaterOpMode)}</Text>
            <Text>{data.heatingValvePos}%</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/sprinkler.png")}
            />
            <Text>Sprayer</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>{opModeTitle(data.sprayOpMode)}</Text>
            <Text>{data.sprayPos}%</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", height: 100 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/directions.png")}
            />
            <Text>Direction</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>{opModeFanTitle(data.fansOpMode)}</Text>
            <Text>{directionTitle(data.fanDirection)}</Text>
          </View>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1 }} />
      <View style={{ borderBottomWidth: 1, marginTop: 38 }} />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginBottom: -44,
        }}
      >
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/atom.png")}
            />
            <Text>Core T1</Text>
          </View>
          <View style={{ alignItems: "center", marginTop: 2 }}>
            <Text>23.7</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/atom.png")}
            />
            <Text>Core T2</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>10.6</Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/atom.png")}
            />
            <Text>Core T3</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>15.7</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", height: 100 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/atom.png")}
            />
            <Text>Core T4</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>44.0</Text>
          </View>
        </View>
        <View style={{ alignItems: "center", height: 100 }}>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                height: 5 + Config.deviceHeight * 0.04,
                width: 5 + Config.deviceHeight * 0.04,
                resizeMode: "contain",
              }}
              source={require("../assets/icons/atom.png")}
            />
            <Text>5.6</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>Auto</Text>
          </View>
        </View>
      </View>
      <View style={{ borderBottomWidth: 1 }} />
      <View style={{ borderBottomWidth: 1, marginTop: 17 }} />
      <View style={{ alignItems: "center" }}>
        <View style={{ width: "60%", flexDirection: "row", flexWrap: "wrap" }}>
          {data.WMs?.slice(0, data.numOfWmProbes).map((wm) => {
            return (<View key={wm.id} style={{ flexDirection: "row", alignItems: "center" }}>
              <Text>M{wm.id}</Text>
              <Switch
                trackColor={{
                  true: Colors.SecondaryColor,
                  false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
                }}
                thumbColor={
                  Platform.OS == "ios"
                    ? "#FFFFFF"
                    : wm.active
                      ? Colors.SecondaryColor
                      : "#ffffff"
                }
                ios_backgroundColor="#fbfbfb"
                onValueChange={(value) => onWMChange(wm.id, wm.value, value)}
                value={wm.active}
                style={
                  wm.active
                    ? styles.switchEnableBorder
                    : styles.switchDisableBorder
                }
              />
              <Text>{wm.value}</Text>
            </View>
            )
          })}
        </View>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate("Graph");
        }}
      >
        <View style={styles.graphBox}>
          <Text>View graph</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    // alignItems: "center",
    width: "100%",
  },
  switchEnableBorder: {
    borderColor: "#6fa6d3",
    borderWidth: 1,
  },

  switchDisableBorder: {
    borderColor: "#f2f2f2",
    borderWidth: 1,
  },
  graphBox: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 4,
    elevation: 3,
  }
});

export default DetailsScreen;
