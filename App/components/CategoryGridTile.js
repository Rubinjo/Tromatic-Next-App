import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableNativeFeedback,
	TouchableOpacity,
	Alert,
} from "react-native";
import FullSlider from "./FullSlider";

import Colors from "../assets/constants/colors";
import Config from "../utils/config";
import Thermometer from "../assets/icons/Thermometer";
import Humidity from "../assets/icons/Humidity";
import Fan from "../assets/icons/Fan";
import Warning from "../assets/icons/Warning";
import WoodThermometer from "../assets/icons/WoodThermometer";
import WoodMoisture from "../assets/icons/WoodMoisture";

const average = (list) =>
	list.reduce((prev, curr) => prev + curr) / list.length;

const CategoryGridTile = (props) => {
	return (
		<View style={styles.gridItem}>
			<TouchableNativeFeedback onPress={props.onSelect}>
				<View style={styles.container}>
					<View
						style={{
							flex: 1,
							flexDirection: "row",
							alignItems: "center",
							// marginBottom: "auto",
							// marginRight: "auto",
							// marginTop: 1 + Config.deviceHeight * 0.001,
							marginLeft: 1 + Config.deviceWidth * 0.04,
						}}
					>
						<View
							style={{
								width: Config.deviceWidth * 0.06,
								height: Config.deviceWidth * 0.06,
								borderRadius: Config.deviceWidth * 0.03,
								backgroundColor:
									props.item.status.statusNums.some(
										(num) => num >= 12
									)
										? Colors.NotActive
										: props.item.status.statusNums.includes(
												7
										  )
										? Colors.Warning
										: Colors.Active,
							}}
						/>
						<View
							style={{
								flex: 1,
								marginLeft: 1 + Config.deviceWidth * 0.02,
							}}
						>
							<Text
								style={{
									fontFamily: "noto-sans-jp-bold",
									fontSize: 5 + Config.deviceHeight * 0.015,
									color: "black",
								}}
							>
								{props.item.type}
							</Text>
						</View>
						{props.item.status.statusNums.some(
							(num) => num >= 12
						) && (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: Config.deviceWidth * 0.08,
								}}
							>
								<TouchableOpacity
									onPress={() =>
										// Make list of props.item.status.statusStrings
										Alert.alert(
											"Warnings",
											"- " +
												props.item.status.statusStrings.join(
													"\n- "
												),

											[
												{
													text: "OK",
													onPress: () =>
														console.log(
															"OK Pressed"
														),
												},
											]
										)
									}
								>
									<Warning
										width={Config.deviceWidth * 0.12}
									/>
								</TouchableOpacity>
							</View>
						)}
					</View>
					<View
						style={{
							flex: 1,
							marginBottom: "auto",
							marginTop: Config.deviceHeight * 0.01,
						}}
					>
						<FullSlider
							remainingTime={props.item.remainingTime}
							totalTime={props.item.totalTime}
						/>
					</View>

					<View
						style={{
							flex: 1.5,
							flexDirection: "row",
							// justifyContent: "center",
							marginBottom: Config.deviceHeight * 0.02,
						}}
					>
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "space-evenly",
							}}
						>
							<Thermometer
								height={Config.deviceHeight * 0.04}
								color={
									props.item.remainingTime == 0
										? Colors.ThirdlyDark
										: Colors.Secondary
								}
							/>
							<Text
								style={{
									marginBottom: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{typeof props.item.currentTemp !== "undefined"
									? props.item.currentTemp.toFixed(1)
									: "-"}
								{" °C"}
							</Text>
							<Text
								style={{
									margin: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{typeof props.item.setPointTemp !== "undefined"
									? props.item.setPointTemp.toFixed(1)
									: "-"}
								{" °C"}
							</Text>
						</View>
						<View
							style={{
								borderRightWidth: 2,
								borderRightColor: Colors.SecondaryLight,
							}}
						/>
						<View
							style={{
								flex: 1,
								alignItems: "center",
								justifyContent: "space-evenly",
							}}
						>
							<Humidity
								height={Config.deviceHeight * 0.04}
								color={
									props.item.remainingTime == 0
										? Colors.ThirdlyDark
										: Colors.Secondary
								}
							/>

							<Text
								style={{
									margin: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{typeof props.item.currentHum !== "undefined"
									? props.item.currentHum.toFixed(1)
									: "-"}
								{"%"}
							</Text>
							<Text
								style={{
									margin: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{typeof props.item.setPointHum !== "undefined"
									? props.item.setPointHum.toFixed(1)
									: "-"}
								{"%"}
							</Text>
						</View>

						{props.item.numOfCTProbes > 0 && (
							<View style={{ flex: 1, flexDirection: "row" }}>
								<View
									style={{
										borderRightWidth: 2,
										borderRightColor: Colors.SecondaryLight,
									}}
								/>
								<View
									style={{
										flex: 1,
										alignItems: "center",
										justifyContent: "space-evenly",
									}}
								>
									<WoodThermometer
										height={Config.deviceHeight * 0.04}
										color={
											props.item.remainingTime == 0
												? Colors.ThirdlyDark
												: Colors.Secondary
										}
									/>
									<Text
										style={{
											margin:
												-Config.deviceHeight * 0.007,
											fontFamily: "noto-sans-jp-regular",
											color:
												props.item.remainingTime == 0
													? Colors.ThirdlyDark
													: Colors.PrimaryDark,
										}}
									>
										{Math.min(
											[
												props.item.CTValue1,
												props.item.CTValue2,
												props.item.CTValue3,
												props.item.CTValue4,
												props.item.CTValue5,
												props.item.CTValue6,
												props.item.CTValue7,
												props.item.CTValue8,
												props.item.CTValue9,
												props.item.CTValue10,
												props.item.CTValue11,
												props.item.CTValue12,
											].filter(Number)
										).toFixed(1)}{" "}
										°C
									</Text>
								</View>
							</View>
						)}

						{props.item.numOfWmProbes > 0 && (
							<View style={{ flex: 1, flexDirection: "row" }}>
								<View
									style={{
										borderRightWidth: 2,
										borderRightColor: Colors.SecondaryLight,
									}}
								/>
								<View
									style={{
										flex: 1,
										alignItems: "center",
										justifyContent: "space-evenly",
									}}
								>
									<WoodMoisture
										height={Config.deviceHeight * 0.036}
										color={
											props.item.remainingTime == 0
												? Colors.ThirdlyDark
												: Colors.Secondary
										}
									/>
									<Text
										style={{
											margin:
												-Config.deviceHeight * 0.007,
											fontFamily: "noto-sans-jp-regular",
											color:
												props.item.remainingTime == 0
													? Colors.ThirdlyDark
													: Colors.PrimaryDark,
										}}
									>
										{typeof props.item.CurrentWM !==
										"undefined"
											? props.item.CurrentWM.toFixed(1)
											: "-"}
										{"%"}
									</Text>
								</View>
							</View>
						)}
					</View>
				</View>
			</TouchableNativeFeedback>
		</View>
	);
};

const styles = StyleSheet.create({
	gridItem: {
		flex: 1,
		width: "92%",
		height: Config.deviceHeight * 0.3,
		alignSelf: "center",
		backgroundColor: Colors.PrimaryLight,
		borderRadius: Config.deviceWidth * 0.03,
		marginVertical: Config.deviceHeight * 0.01,
	},
	container: {
		flex: 1,
		// justifyContent: "flex-end",
		alignItems: "center",
	},
});

export default CategoryGridTile;
