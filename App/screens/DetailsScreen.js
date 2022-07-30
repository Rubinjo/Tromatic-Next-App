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
        actualTemperature: machine.actualTemperature,
        setTemperature: machine.setTemperature,
        valve: machine.valve,
        statusLight: machine.statusLight,
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
            actual={data.actualTemperature}
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
            actual={data.actualHumidity}
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
              source={require("../assets/icons/sprinkler.png")}
            />
            <Text>Sprayer</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Text>Auto</Text>
            <Text>0%</Text>
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
            <Text>0%</Text>
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
                  : data.m1Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m1Toggle: value })}
              value={data.m1Toggle}
              style={
                data.m1Toggle
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
                  : data.m2Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m2Toggle: value })}
              value={data.m2Toggle}
              style={
                data.m2Toggle
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
                  : data.m3Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m3Toggle: value })}
              value={data.m3Toggle}
              style={
                data.m3Toggle
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
                  : data.m4Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m4Toggle: value })}
              value={data.m4Toggle}
              style={
                data.m4Toggle
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
        </View>
        <View style={{ flexDirection: "column", width: "50%" }}>
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
                  : data.m5Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m5Toggle: value })}
              value={data.m5Toggle}
              style={
                data.m5Toggle
                  ? styles.switchEnableBorder
                  : styles.switchDisableBorder
              }
            />
          </View>
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
                  : data.m6Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m6Toggle: value })}
              value={data.m6Toggle}
              style={
                data.m6Toggle
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
                  : data.m7Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m7Toggle: value })}
              value={data.m7Toggle}
              style={
                data.m7Toggle
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
                  : data.m8Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setData({ ...data, m8Toggle: value })}
              value={data.m8Toggle}
              style={
                data.m8Toggle
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
