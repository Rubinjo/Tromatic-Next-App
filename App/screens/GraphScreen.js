import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import LineChart from "../components/LineChart";
import Config from "../utils/config";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const GraphScreen = (props) => {
  // Load graph from the redux store
  const graphPar = useSelector((state) => state.graph.graph);

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
      <LineChart />
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          style={[styles.selectionContainer, { borderRightWidth: 1 }]}
        >
          <Text style={styles.selectionText}>1 day</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectionContainer, { borderRightWidth: 1 }]}
        >
          <Text style={styles.selectionText}>12 hours</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.selectionContainer, { borderRightWidth: 1 }]}
        >
          <Text style={styles.selectionText}>3 hours</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.selectionContainer}>
          <Text style={styles.selectionText}>1 hour</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  selectionText: {
    textAlign: "center",
    fontFamily: "noto-sans-jp-regular",
  },
});

export default GraphScreen;
