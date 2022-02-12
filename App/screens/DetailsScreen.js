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

const DetailsScreen = (props) => {
  const [actualTemperature, setActualTemperature] = useState(0);
  const [setTemperature, setSetTemperature] = useState(0);
  const [actualHumidity, setActualHumidity] = useState(0);
  const [setHumidity, setSetHumidity] = useState(0);
  const [valve, setValve] = useState(0);
  const [statusLight, setStatusLight] = useState(null);
  const [areChanges, setAreChanges] = useState(false);

  const [m1Toggle, setM1Toggle] = useState(false);
  const [m2Toggle, setM2Toggle] = useState(false);
  const [m3Toggle, setM3Toggle] = useState(false);
  const [m4Toggle, setM4Toggle] = useState(false);
  const [m5Toggle, setM5Toggle] = useState(false);
  const [m6Toggle, setM6Toggle] = useState(false);
  const [m7Toggle, setM7Toggle] = useState(false);
  const [m8Toggle, setM8Toggle] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const machineRef = ref(db, "machines/" + props.route.params.machineId);
    onValue(machineRef, (snapshot) => {
      const machine = snapshot.val();
      setActualTemperature(machine.actualTemperature);
      setSetTemperature(machine.setTemperature);
      setValve(machine.valve);
      setStatusLight(machine.statusLight);
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
  }, [areChanges, setTemperature, valve]);

  const onSetTemperatureChange = (temperature) => {
    setAreChanges(true);
    setSetTemperature(temperature);
  };

  const onSetHumidityChange = (humidity) => {
    setAreChanges(true);
    setSetHumidity(humidity);
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
            actual={actualTemperature}
            setter={setTemperature}
            onChange={onSetTemperatureChange}
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
            actual={actualHumidity}
            setter={setHumidity}
            onChange={onSetHumidityChange}
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
        <View style={{ flexDirection: "column", width: "50%" }}>
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
                  : m1Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM1Toggle(value)}
              value={m1Toggle}
              style={
                m1Toggle
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
                  : m2Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM2Toggle(value)}
              value={m2Toggle}
              style={
                m2Toggle
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
                  : m3Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM3Toggle(value)}
              value={m3Toggle}
              style={
                m3Toggle
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
                  : m4Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM4Toggle(value)}
              value={m4Toggle}
              style={
                m4Toggle
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
                  : m5Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM5Toggle(value)}
              value={m5Toggle}
              style={
                m5Toggle
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
                  : m6Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM6Toggle(value)}
              value={m6Toggle}
              style={
                m6Toggle
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
                  : m7Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM7Toggle(value)}
              value={m7Toggle}
              style={
                m7Toggle
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
                  : m8Toggle
                  ? Colors.SecondaryColor
                  : "#ffffff"
              }
              ios_backgroundColor="#fbfbfb"
              onValueChange={(value) => setM8Toggle(value)}
              value={m8Toggle}
              style={
                m8Toggle
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
        <Text>See Graph</Text>
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
});

export default DetailsScreen;
