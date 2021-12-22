import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  VictoryChart,
  VictoryGroup,
  VictoryAxis,
  VictoryLine,
  VictoryLegend,
  VictoryTheme,
  LineSegment,
} from "victory-native";

import temperature from "../data/dummy-data-temp";
import humidity from "../data/dummy-data-humi";

const datastuff = temperature.forEach((element) => {
  // do stuff with data
  let x = element.x;
  let y = element.y;

  console.log(`${x}: ${y}`);
});

let last = temperature[temperature.length - 1];
console.log(last);

const LineChart = () => {
  const datatemp = temperature;
  const datahumi = humidity;
  return (
    <View style={{ backgroundColor: "#ffffff" }}>
      <View style={styles.titlebox}>
        <Text>Temperature over time, 24h</Text>
      </View>

      <VictoryChart gridComponent={<LineSegment type={"grid"} />}>
        <VictoryGroup>
          <VictoryLine
            style={{
              data: { stroke: "#c43a31" },
              parent: { border: "1px solid #ccc" },
            }}
            domain={{ x: [0, 24], y: [0, 100] }}
            data={datatemp}
          ></VictoryLine>
          <VictoryLine
            style={{
              data: { stroke: "#5eb1bf" },
              parent: { border: "1px solid #ccc" },
            }}
            data={datahumi}
          ></VictoryLine>
        </VictoryGroup>
        <VictoryAxis label="Time [h]" />
        <VictoryAxis
          dependentAxis
          // label="Temperature [°C]"
          // style={{
          //   axisLabel: {
          //     padding: 30,
          //   },
          // }}
        />
        <VictoryAxis
          style={{
            grid: { stroke: "#818e99", strokeWidth: 0.5 },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            grid: { stroke: "#818e99", strokeWidth: 0.5 },
          }}
        />
        <VictoryLegend
          x={Dimensions.get("screen").width / 2 - 100}
          orientation="horizontal"
          data={[
            {
              name: "Temperature",
              symbol: {
                fill: "#c43a31",
              },
            },
            {
              name: "Humidity",
              symbol: {
                fill: "#5eb1bf",
              },
            },
          ]}
        />
      </VictoryChart>
      <View>
        <Text>
          The machine has been running for: {last.x}h and is at {last.y}°C
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  titlebox: {
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default LineChart;
