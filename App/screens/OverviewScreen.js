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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import Machine from "../models/machine";
import CategoryGridTile from "../components/CategoryGridTile";

const OverviewScreen = (props) => {
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
                childData.Type,
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
                parData.SetPointHum,
                parData.SetPointTemp,
                parData.SprayPos,
                parData.Status,
                parData.TempOffset,
                new Date(parData.Timestamp),
                NumOfCTProbes,
                DamperOpMode,
                HeaterOpMode,
                SprayOpMode,
                FansOpMode,
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

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        item={itemData.item}
        onSelect={() => {
          props.navigation.navigate("Details", {
            machineId: itemData.item.id,
          });
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={data}
        renderItem={renderGridItem}
        extraData={data}
      />
    </View>
  );
};

export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => {
      let iconName;
      iconName = props.focused ? "engine" : "engine-outline";
      return (
        <MaterialCommunityIcons name={iconName} size={34} color={"white"} />
      );
    },
    tabBarLabel: "Overview",
    headerShown: false,
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
    backgroundColor: "white",
  },
});

export default OverviewScreen;
