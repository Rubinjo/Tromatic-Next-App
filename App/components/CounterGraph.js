import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

const Counter = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={[
          styles.input,
          {
            height: Config.deviceHeight * 0.07,
            flexDirection: "row",
            borderTopWidth: 1,
            borderBottomWidth: 1,
            borderColor: Colors.DetailsLight
          },
        ]}
      >
        <View style={{ height: "100%", width: "50%", backgroundColor: Colors.DetailsLight, justifyContent: "center" }}>
          <Text style={{ fontFamily: "noto-sans-jp-regular", fontSize: Config.deviceHeight * 0.014, position: "absolute", top: "-15%", right: "4%" }}>
            ACT
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: Config.deviceHeight * 0.025,
                alignSelf: "center",
                paddingTop: "8%"
              },
            ]}
          >
            {typeof props.actual !== "undefined" ? props.actual.toFixed(1) : props.actual}
          </Text>
        </View>

        <View style={{ height: "100%", borderLeftWidth: 1, borderColor: Colors.DetailsLight }} />
        <View style={{ height: "100%", width: "50%", justifyContent: "center" }}>
          <Text style={{ fontFamily: "noto-sans-jp-regular", fontSize: Config.deviceHeight * 0.014, position: "absolute", top: "-15%", right: "4%" }}>
            SET
          </Text>
          <Text
            style={[
              styles.text,
              {
                fontSize: Config.deviceHeight * 0.025,
                alignSelf: "center",
                paddingTop: "8%"
              },
            ]}
          >
            {typeof props.setter !== "undefined" ? props.setter.toFixed(1) : props.setter}
          </Text>
        </View>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "noto-sans-jp-regular",
  },
  input: {
    width: Config.deviceWidth * 0.24,
    height: Config.deviceHeight * 0.07,
    backgroundColor: Colors.TextLight,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Counter;
