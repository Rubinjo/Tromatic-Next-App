import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, FlatList, View } from "react-native";
import {
	NavigationContainer,
	CommonActions,
	useNavigation,
} from "@react-navigation/native";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue } from "firebase/database";

import Gauge from "../assets/icons/Gauge";
import Config from "../utils/config";
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
						const machineData = new Machine(
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
							new Date(parData.DateTimeMessage),
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
							parData.WMActive10
						);

						const index = fetchedData.findIndex(
							(i) => i.id === childKey
						);
						if (index > -1) {
							fetchedData.splice(index, 1, machineData);
						} else {
							fetchedData.push(machineData);
						}

						setData([...fetchedData]);
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
		<SafeAreaView style={styles.container}>
			<FlatList
				keyExtractor={(item, index) => item.id}
				data={data}
				renderItem={renderGridItem}
				// extraData={data}
				contentContainerStyle={{
					paddingVertical: Config.deviceHeight * 0.01,
				}}
			/>
		</SafeAreaView>
	);
};

export const tabOptions = (navData) => {
	return {
		tabBarIcon: (props) => {
			let iconColor;
			iconColor = props.focused
				? Colors.PrimaryBackground
				: Colors.TextDarkest;
			return (
				<Gauge width={Config.deviceWidth * 0.075} color={iconColor} />
			);
		},
		tabBarLabel: "Overview",
		headerShown: false,
	};
};

// export const stackOptions = (navData) => {
//   return {
//     headerTitle: (props) => {
//       return (
//         <TromaticNextLogo width={Config.deviceWidth * 0.3} height={Config.deviceWidth * 0.3 * 0.3636} viewBox={"0 0 " + Config.deviceWidth * 0.7 + " " + Config.deviceWidth * 0.6 * 0.5} />
//       )
//     }
//   }
// }

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: "stretch",
		justifyContent: "center",
		backgroundColor: Colors.PrimaryBackground + "1a", // opacity of 0.1
	},
});

export default OverviewScreen;
