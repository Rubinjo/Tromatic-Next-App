import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { VictoryChart, VictoryGroup, VictoryBar } from "victory-native";

const LineChart = () => {
  return (
    <View>
      <VictoryChart>
        <VictoryGroup>
          <VictoryBar></VictoryBar>
        </VictoryGroup>
      </VictoryChart>
    </View>
  );
};

export default LineChart;
