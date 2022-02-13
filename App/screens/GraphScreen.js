import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";

import LineChart from "../components/LineChart";
import LineChart2 from "../components/Home";
import Home from "../components/Home";
import Config from "../utils/config";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const GraphScreen = (props) => {
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
            activeTimeNum == 0
              ? [styles.selectionContainerActive, { borderRightWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 0
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(12);
          }}
          style={
            activeTimeNum == 1
              ? [
                  styles.selectionContainerActive,
                  { borderLeftWidth: 1, borderRightWidth: 1 },
                ]
              : activeTimeNum == 0
              ? [styles.selectionContainer, { borderRightWidth: 1 }]
              : [styles.selectionContainer, { borderLeftWidth: 1 }]
          }
        >
          <Text
            style={
              activeTimeNum == 1
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            12 hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(3);
          }}
          style={
            activeTimeNum == 2
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
              activeTimeNum == 2
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
            activeTimeNum == 3
              ? [styles.selectionContainerActive, { borderLeftWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 3
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 hour
          </Text>
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
