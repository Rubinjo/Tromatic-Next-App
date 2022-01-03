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

import { CHAMBERS } from "../data/dummy-data";
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
                childData.type,
                childData.creation,
                parData.statusLight,
                parData.temperature
              )
            );
            setData(
              fetchedData.reduce(function (filtered, machine) {
                if (
                  !filtered.some((filMachine) => filMachine.id === machine.id)
                ) {
                  filtered.push(machine);
                }
                return filtered;
              }, [])
            );
          });
        });
      });
    });
  }, []);

  const renderGridItem = (itemData) => {
    return (
      <CategoryGridTile
        title={itemData.item.type}
        color={itemData.item.statusLight}
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
  },
});

export default OverviewScreen;
