import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
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
    <View style={styles.container}>
      <View style={{ flex: 1, flexDirection: "row" }}>
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
          m1Toggle ? styles.switchEnableBorder : styles.switchDisableBorder
        }
      />
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
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
