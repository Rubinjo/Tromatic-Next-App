import React from "react";
import { View, Text, StyleSheet, TouchableNativeFeedback } from "react-native";
import FullSlider from "./FullSlider";

import Colors from "../assets/constants/colors";
import Config from "../utils/config";
import Thermometer from "../assets/icons/Thermometer";
import Humidity from "../assets/icons/Humidity";
import Status from "../assets/constants/status";
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
									props.item.status - 65537 < 12
										? props.item.status - 65537 == 0
											? Colors.Active
											: "yellow"
										: Colors.NotActive,
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
						{props.item.status >= 12 && (
							<View
								style={{
									flexDirection: "row",
									alignItems: "center",
									marginRight: Config.deviceWidth * 0.08,
								}}
							>
								<Warning width={Config.deviceWidth * 0.12} />
								<View
									style={{
										marginLeft:
											1 + Config.deviceWidth * 0.02,
									}}
								>
									<Text
										style={{
											fontFamily: "noto-sans-jp-regular",
											fontSize:
												4 + Config.deviceHeight * 0.015,
											color: "black",
										}}
									>
										{Status[props.item.status]}
									</Text>
								</View>
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
								{props.item.currentTemp} °C
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
								{props.item.setPointTemp} °C
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
								{props.item.currentHum}%
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
								{props.item.setPointHum}%
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
									margin: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{props.item.RPM}%
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
									margin: -Config.deviceHeight * 0.007,
									fontFamily: "noto-sans-jp-regular",
									color:
										props.item.remainingTime == 0
											? Colors.ThirdlyDark
											: Colors.PrimaryDark,
								}}
							>
								{average(
									[
										props.item.WMValue1,
										props.item.WMValue2,
										props.item.WMValue3,
										props.item.WMValue4,
										props.item.WMValue5,
										props.item.WMValue6,
										props.item.WMValue7,
										props.item.WMValue8,
										props.item.WMValue9,
										props.item.WMValue10,
									].filter(Number)
								).toFixed(1)}{" "}
								°C
							</Text>
						</View>
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
