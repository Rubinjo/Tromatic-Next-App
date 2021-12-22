import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Config from "../utils/config";

const Counter = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <TouchableOpacity
        onPress={() => props.onChange(props.temperature + 1)}
        style={[
          styles.input,
          {
            borderTopLeftRadius: Config.deviceWidth * 0.04,
            borderTopRightRadius: Config.deviceWidth * 0.04,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: Config.deviceHeight * 0.07,
              marginTop: -Config.deviceHeight * 0.056,
            },
          ]}
        >
          +
        </Text>
      </TouchableOpacity>
      <View style={[styles.input, { height: Config.deviceHeight * 0.08 }]}>
        <Text
          style={[
            styles.text,
            {
              fontSize: Config.deviceHeight * 0.045,
              marginTop: -Config.deviceHeight * 0.0275,
            },
          ]}
        >
          {props.temperature}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => props.onChange(props.temperature - 1)}
        style={[
          styles.input,
          {
            borderBottomLeftRadius: Config.deviceWidth * 0.04,
            borderBottomRightRadius: Config.deviceWidth * 0.04,
          },
        ]}
      >
        <Text
          style={[
            styles.text,
            {
              fontSize: Config.deviceHeight * 0.09,
              marginTop: -Config.deviceHeight * 0.095,
            },
          ]}
        >
          -
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontFamily: "noto-sans-jp-regular",
  },
  input: {
    width: Config.deviceWidth * 0.2,
    height: Config.deviceHeight * 0.09,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Counter;
