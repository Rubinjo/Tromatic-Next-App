import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, update } from "firebase/database";

// import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

import Counter from "../components/Counter";
import SliderTile from "../components/SliderTile";

const DetailsScreen = (props) => {
  const [temperature, setTemperature] = useState(0);
  const [valve, setValve] = useState(0);
  const [statusLight, setStatusLight] = useState(null);
  const [areChanges, setAreChanges] = useState(false);

  useEffect(() => {
    const db = getDatabase();
    const machineRef = ref(db, "machines/" + props.route.params.machineId);
    onValue(machineRef, (snapshot) => {
      const machine = snapshot.val();
      setTemperature(machine.temperature);
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
  }, [areChanges, temperature, valve]);

  const onTemperatureChange = (temperature) => {
    setAreChanges(true);
    setTemperature(temperature);
  };

  const onValveChange = (valve) => {
    setAreChanges(true);
    setValve(valve[0]);
  };

  const sendData = () => {
    const db = getDatabase();
    const updates = {};
    updates["machines/" + props.route.params.machineId + "/temperature"] =
      temperature;
    updates["machines/" + props.route.params.machineId + "/valve"] = valve;
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
      {/* <Text>{selectedChamber.title}</Text> */}
      {/* <Text>itemId: {JSON.stringify(itemId)}</Text>
      <Text>otherParam: {JSON.stringify(otherParam)}</Text> */}
      <Counter value={temperature} onChange={onTemperatureChange} />
      <SliderTile
        title="Valves"
        stepCount={[...Array(5).keys()]} // Array of steps (step length you want ++)
        value={valve}
        onChange={onValveChange}
      />
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
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default DetailsScreen;
