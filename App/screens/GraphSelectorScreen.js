import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import Config from "../utils/config";

const GraphSelectorScreen = (props) => {
  const [isSelected, setIsSelected] = useState(0);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setIsSelected(0)}
        style={[styles.container, { borderTopWidth: 1 }]}
      >
        <Text style={styles.text}>Variable 1</Text>
        {isSelected == 0 && (
          <MaterialCommunityIcons
            style={styles.icon}
            name={"check"}
            size={34}
            color={"green"}
          />
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => setIsSelected(1)}
        style={styles.container}
      >
        <Text style={styles.text}>Variable 2</Text>
        {isSelected == 1 && (
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
