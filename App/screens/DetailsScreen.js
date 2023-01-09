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
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, update } from "firebase/database";

// import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

import Counter from "../components/Counter";
import SliderTile from "../components/SliderTile";
import humidity from "../data/dummy-data-humi";

const DetailsScreen = (props) => {
  const [areChanges, setAreChanges] = useState(false);
  const [data, setData] = useState({
    actualTemperature: 0,
    setTemperature: 0,
    actualHumidity: 0,
    setHumidity: 0,
    valve: 0,
    statusLight: null,
    m1Toggle: false,
    m2Toggle: false,
    m3Toggle: false,
    m4Toggle: false,
    m5Toggle: false,
    m6Toggle: false,
    m7Toggle: false,
    m8Toggle: false,
  });

  useEffect(() => {
    const db = getDatabase();
    const machineRef = ref(db, "machines/" + props.route.params.machineId);
    onValue(machineRef, (snapshot) => {
      const machine = snapshot.val();
      setData({
        ...data,
        currentHum: machine.currentHum,
        currentTemp: machine.currentTemp,
        damperPos: machine.DamperPos,
        EMCOffset: machine.EMCOffset,
        fanDirection: machine.FanDirection,
        heatingValvePos: machine.HeatingValvePos,
        numOfWmProbes: machine.NumOfWmProbes,
        RPM: machine.RPM,
        remainingTime: machine.RemainingTime,
        setPointHum: machine.SetPointHum,
        setPointTemp: machine.SetPointTemp,
        sprayPos: machine.SprayPos,
        status: machine.Status,
        TempOffset: machine.TempOffset,
        timestamp: machine.Timestamp,
        WMValue1: machine.WMValue1,
        WMValue2: machine.WMValue2,
        WMValue3: machine.WMValue3,
        WMValue4: machine.WMValue4,
        WMValue5: machine.WMValue5,
        WMValue6: machine.WMValue6,
        WMValue7: machine.WMValue7,
        WMValue8: machine.WMValue8,
        WMValue9: machine.WMValue9,
        WMValue10: machine.WMValue10,
        WMActive1: machine.WMActive1,
        WMActive2: machine.WMActive2,
        WMActive3: machine.WMActive3,
        WMActive4: machine.WMActive4,
        WMActive5: machine.WMActive5,
        WMActive6: machine.WMActive6,
        WMActive7: machine.WMActive7,
        WMActive8: machine.WMActive8,
        WMActive9: machine.WMActive9,
        WMActive10: machine.WMActive10,
      });
    });
  }, []);

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

  const onChange = (item, value) => {
    setAreChanges(true);
    setData({ ...data, [item]: value });
  };

  const sendData = () => {
    const db = getDatabase();
    const updates = {};
    updates["machines/" + props.route.params.machineId + "/setTemperature"] =
      setTemperature;
    update(ref(db), updates);
    setAreChanges(false);
  };

  // const navigation = useNavigation();
  // const route = useRoute();
  // const { itemId, otherParam } = route.params;
  // const { chamberId } = props.route.params;
  // const selectedChamber = CHAMBERS.find((chamId) => chamId.id === chamberId);
  return (
    <ScrollView style={styles.container}>
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
            item={"setTemperature"}
            actual={data.currentTemp}
            setter={data.setTemperature}
            onChange={onChange}
          />
        </View>
        <View>
          <Image
            style={{
              height: 24 + Config.deviceHeight * 0.15,
              width: 24 + Config.deviceHeight * 0.15,
              resizeMode: "contain",
            }}
            source={require("../assets/icons/fan.png")}
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
            item={"setHumidity"}
            actual={data.currentHum}
            setter={data.setHumidity}
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
            <Text>Auto</Text>
            <Text>0%</Text>
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
            <Text>Auto</Text>
            <Text>{data.valve}%</Text>
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
            <Text>Auto</Text>
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
            <Text>Auto</Text>
            <Text>{data.fanDirection}%</Text>
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
      <View style={{ flexDirection: "row", width: "100%" }}>
        <View style={{ marginLeft: 5, flexDirection: "column", width: "50%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M1</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive1
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive1: value })}
              value={data.WMActive1}
              style={
                data.WMActive1
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M2</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive2
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive2: value })}
              value={data.WMActive2}
              style={
                data.WMActive2
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M3</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive3
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive3: value })}
              value={data.WMActive3}
              style={
                data.WMActive3
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M4</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive4
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive4: value })}
              value={data.WMActive4}
              style={
                data.WMActive4
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M5</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive5
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive5: value })}
              value={data.WMActive5}
              style={
                data.WMActive5
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: "column", width: "50%" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M6</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive6
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive6: value })}
              value={data.WMActive6}
              style={
                data.WMActive6
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M7</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive7
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive7: value })}
              value={data.WMActive7}
              style={
                data.WMActive7
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M8</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive8
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive8: value })}
              value={data.WMActive8}
              style={
                data.WMActive8
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M9</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive9
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive9: value })}
              value={data.WMActive9}
              style={
                data.WMActive9
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text>M10</Text>
            <Switch
              trackColor={{
                true: Colors.SecondaryColor,
                false: Platform.OS == "android" ? "#d3d3d3" : "#fbfbfb",
              }}
              thumbColor={
                Platform.OS == "ios"
                  ? "#FFFFFF"
                  : data.WMActive10
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, WMActive10: value })}
              value={data.WMActive10}
              style={
                data.WMActive10
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
        </View>
      </View>

      {/* <SliderTile
        title="Valves"
        stepCount={[...Array(5).keys()]} // Array of steps (step length you want ++)
        value={valve}
        onChange={onValveChange}
      /> */}
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
  },
});

export default DetailsScreen;
