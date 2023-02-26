import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Config from "../utils/config";
import i18n from "../utils/i18n";

import { updateGraph } from "../store/slices/graph";

import { useSelector, useDispatch } from "react-redux";

const GraphSelectorScreen = (props) => {
  const [selected, setSelected] = useState(null);

  // Update graph setting when redux store is loaded
  useEffect(() => {
    setSelected(graphPar);
  }, [graphPar]);

  // Load graph from the redux store
  const graphPar = useSelector((state) => state.graph.graph);

  const dispatch = useDispatch();

  const onChangeGraph = (par) => {
    try {
      dispatch(updateGraph(par));
      setSelected(par);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={() => onChangeGraph("Variable-1")}
        style={[styles.container, { borderTopWidth: 1 }]}
      >
        <Text style={styles.text}>Variable 1</Text>
        {selected == "Variable-1" && (
          <MaterialCommunityIcons
            style={styles.icon}
            name={"check"}
            size={34}
            color={"green"}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onChangeGraph("Variable-2")}
        style={styles.container}
      >
        <Text style={styles.text}>Variable 2</Text>
        {selected == "Variable-2" && (
          <MaterialCommunityIcons
            style={styles.icon}
            name={"check"}
            size={34}
            color={"green"}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    flexDirection: "row",
    paddingVertical: Config.deviceHeight * 0.002,
  },
  text: {
    fontFamily: "noto-sans-jp-regular",
    marginLeft: Config.deviceWidth * 0.04,
  },
  icon: {
    marginLeft: "auto",
    marginRight: Config.deviceWidth * 0.08,
  },
});

export default GraphSelectorScreen;
