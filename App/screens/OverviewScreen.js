import React from "react";
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

import Colors from "../assets/constants/colors";
import useColorScheme from "react-native/Libraries/Utilities/useColorScheme";

import { CHAMBERS } from "../data/dummy-data";

const OverviewScreen = (props) => {
  const navigation = useNavigation();
  const renderGridItem = (itemData) => {
    return (
      <TouchableOpacity
        onPress={() =>
          props.navigation.navigate(
            "Details",
            {
              itemId: itemData.item.id,
              otherParam: "anything you want here",
            }

            // {
            //   params: {
            //     chamberId: itemData.item.id,
            //     chamberTitle: itemData.item.title,
            //   },
            // }
          )
        }
      >
        <View style={styles.gridItem}>
          <Text>{itemData.item.title}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        keyExtractor={(item, index) => item.id}
        data={CHAMBERS}
        renderItem={renderGridItem}
      />
      <Text>OverviewScreen!</Text>
      <Button
        title="Go to details"
        onPress={() => navigation.navigate("Details")}
      />
    </View>
  );
};

OverviewScreen.navigationOptions = {
  headerTitle: "Overview",
};

// Hij is wit dus je ziet hem momenteel niet
export const tabOptions = (navData) => {
  return {
    tabBarIcon: (props) => (
      <MaterialCommunityIcons
        name="engine"
        size={props.size}
        color={Colors.PrimaryColor}
      />
    ),
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  gridItem: {
    flex: 1,
    margin: 15,
    height: 50,
  },
});

export default OverviewScreen;
