import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  NavigationContainer,
  CommonActions,
  useNavigation,
} from "@react-navigation/native";
import { Entypo } from '@expo/vector-icons';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import Gauge from "../assets/icons/Gauge";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import Machine from "../models/machine";
import CategoryGridTile from "../components/CategoryGridTile";

import CompactSlider from '../components/CompactSlider';

import { useSelector } from "react-redux";

import LineChart from "../components/LineChart";
import LineChart2 from "../components/Home";
import Home from "../components/Home";
//import Config from "../utils/config";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const GraphScreen = (props) => {
  const [activeTimeNum, setActiveTimeNum] = useState(3);

  // Load graph from the redux store
  const graphPar = useSelector((state) => state.graph.graph);

  const selectGraphTime = (timeNum) => {
    setActiveTimeNum(timeNum);
  };

  const [data, setData] = useState([]);
  useEffect(() => {
    const auth = getAuth();
    const db = getDatabase();
    const userRef = ref(db, "users/" + auth.currentUser.uid + "/cid");
    onValue(userRef, (snapshot) => {
      const cid = snapshot.val();
      const machinesRef = ref(db, "companies/" + cid + "/machines");
      onValue(machinesRef, (snapshot) => {
        const fetchedData = [];
        snapshot.forEach((childSnapshot) => {
          const childKey = childSnapshot.key;
          const childData = childSnapshot.val();
          const parsRef = ref(db, "machines/" + childKey);
          onValue(parsRef, (snapshot) => {
            const parData = snapshot.val();
            fetchedData.push(
              new Machine(
                childKey,
                cid,
                parData.DeviceName,
                childData.Creation,
                parData.CurrentHum,
                parData.CurrentTemp,
                parData.DamperPos,
                parData.EMCOffset,
                parData.FanDirection,
                parData.HeatingValvePos,
                parData.NumOfWmProbes,
                parData.RPM,
                parData.RemainingTime,
                parData.TotalTime,
                parData.SetPointHum,
                parData.SetPointTemp,
                parData.SprayPos,
                parData.Status,
                parData.TempOffset,
                new Date(parData.Timestamp),
                parData.NumOfCTProbes,
                parData.DamperOpMode,
                parData.HeaterOpMode,
                parData.SprayOpMode,
                parData.FansOpMode,
                parData.WMValue1,
                parData.WMValue2,
                parData.WMValue3,
                parData.WMValue4,
                parData.WMValue5,
                parData.WMValue6,
                parData.WMValue7,
                parData.WMValue8,
                parData.WMValue9,
                parData.WMValue10,
                parData.WMActive1,
                parData.WMActive2,
                parData.WMActive3,
                parData.WMActive4,
                parData.WMActive5,
                parData.WMActive6,
                parData.WMActive7,
                parData.WMActive8,
                parData.WMActive9,
                parData.WMActive10,
              )
            );
            const new_data = fetchedData.reverse().reduce(function (filtered, machine) {
              if (
                !filtered.some((filMachine) => filMachine.id === machine.id)
              ) {
                filtered.push(machine);
              }
              return filtered;
            }, [])
            const sorted_data = new_data.sort(function (a, b) { return a.id.split("_").at(-1) - b.id.split("_").at(-1) })
            setData(sorted_data);
          });
        });
      });
    });
  }, []);

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
            activeTimeNum == 24
              ? [styles.selectionContainerActive, { borderRightWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 24
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 day
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(9);
          }}
          style={
            activeTimeNum == 9
              ? [
                  styles.selectionContainerActive,
                  { borderLeftWidth: 1, borderRightWidth: 1 },
                ]
              : activeTimeNum == 9
              ? [styles.selectionContainer, { borderRightWidth: 1 }]
              : [styles.selectionContainer, { borderLeftWidth: 1 }]
          }
        >
          <Text
            style={
              activeTimeNum == 9
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            9 hours
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            selectGraphTime(3);
          }}
          style={
            activeTimeNum == 3
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
              activeTimeNum == 3
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
            activeTimeNum == 1
              ? [styles.selectionContainerActive, { borderLeftWidth: 1 }]
              : styles.selectionContainer
          }
        >
          <Text
            style={
              activeTimeNum == 1
                ? styles.selectionTextActive
                : styles.selectionText
            }
          >
            1 hour
          </Text>
        </TouchableOpacity>
      </View>
      <Text>Time test</Text>
      <View style={{ marginTop: 10 }} remainingTime={dataFB.remainingTime} totalTime={dataFB.totalTime}>
        <CompactSlider/>
      </View>
      <Text>List test:</Text>
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
