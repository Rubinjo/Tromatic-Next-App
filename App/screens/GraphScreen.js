import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import {
	getFirestore,
	query,
	collection,
	where,
	getDocs,
} from "firebase/firestore";
import { VictoryChart, VictoryAxis, VictoryLine } from "victory-native";

import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Thermometer from "../assets/icons/Thermometer";
import Humidity from "../assets/icons/Humidity";

import { AntDesign } from "@expo/vector-icons";

const GraphScreen = (props) => {
	const [loading, setLoading] = useState(true);
	// Array of all loaded data
	const [data, setData] = useState([]);
	// Array of all data for current chart
	const [chartData, setChartData] = useState([]);
	const [activeTime, setActiveTime] = useState(0);
	const [activeVar, setActiveVar] = useState(["CurrentTemp", "SetPointTemp"]);
	// Till what timeOffset is already loaded into data
	const [loaded, setLoaded] = useState(0);
	const timeOffsets = [0, 28800000, 86400000, 604800000, 2592000000]; // 0 sec, 8 hours, 24 hours, 7 days, 1 month
	const labelOffsets = {
		CurrentTemp: 0.2,
		SetPointTemp: 0.4,
		CurrentHum: 0.6,
		SetPointHum: 0.8,
	}; // Where to place graph label

	// Fetch graph data from firestore
	const fetchData = (timeNum) => {
		// startTime is till the timeOffset the user selected and endTime is the timeOffset that is currently loaded into data
		const startTime = new Date();
		const endTime = new Date();
		startTime.setTime(startTime.getTime() - timeOffsets[timeNum]);
		endTime.setTime(endTime.getTime() - timeOffsets[loaded]);

		try {
			// Setup connection to database
			const db = getFirestore();
			// Query for history data from machine that is between already loaded and needed times
			const q = query(
				collection(
					db,
					"machines",
					props.route.params.machineId,
					"history"
				),
				where("DateTimeMessage", ">=", startTime),
				where("DateTimeMessage", "<=", endTime)
			);
			getDocs(q).then((querySnapshot) => {
				const measurements = [];
				// Loop through found history times
				querySnapshot.forEach((doc) => {
					measurements.push(doc.data());
				});
				setActiveTime(timeNum);
				setLoaded(timeNum);
				// Add new data to the already loaded data
				setData((prevData) => [...measurements, ...prevData]);
			});
		} catch (e) {
			console.log(e);
		}
	};

	// Select time slice for selected varName
	const fetchChartData = (timeNum, varName) => {
		let dataForChart = new Array(varName.length);
		for (let i = 0; i < dataForChart.length; i++) {
			dataForChart[i] = new Array();
		}
		const time = new Date();
		// Get timeframe of selected timeOffset
		time.setTime(time.getTime() - timeOffsets[timeNum]);

		const lenData = data.length;
		let lenTime = 0;

		// Get number of timesteps in timeframe
		data.forEach((measurement) => {
			// Translate time in firestore to js format
			const firestoreTime = new Date(
				measurement.DateTimeMessage.seconds * 1000 +
					measurement.DateTimeMessage.nanoseconds / 1000000
			);
			// Add every firestore measurement that is in the selected timeframe
			if (firestoreTime >= time) {
				lenTime++;
			}
		});

		data.forEach((measurement, i) => {
			// Translate time in firestore to js format
			const firestoreTime = new Date(
				measurement.DateTimeMessage.seconds * 1000 +
					measurement.DateTimeMessage.nanoseconds / 1000000
			);
			// Add every firestore measurement that is in the selected timeframe
			if (firestoreTime >= time) {
				varName.forEach((varName, j) => {
					if (
						i ===
						Math.floor(
							lenData - lenTime + lenTime * labelOffsets[varName]
						)
					) {
						dataForChart[j].push({
							x: firestoreTime,
							y: measurement[varName],
							label: varName.replace(/([A-Z])/g, " $1"), // Add spaces between words
						});
					} else {
						dataForChart[j].push({
							x: firestoreTime,
							y: measurement[varName],
						});
					}
				});
			}
		});
		setChartData(dataForChart);
	};

	const setTimeNum = (timeNum) => {
		setLoading(true);
		// Check if data is not already loaded
		if (timeNum > loaded) {
			fetchData(timeNum);
		} else {
			setActiveTime(timeNum);
			fetchChartData(timeNum, activeVar);
		}
	};

	const setVarName = (varName) => {
		setLoading(true);
		fetchChartData(activeTime, varName);
		setActiveVar(varName);
	};

	useEffect(() => {
		fetchData(1);
	}, []);

	useEffect(() => {
		fetchChartData(activeTime, activeVar);
	}, [data]);

	useEffect(() => {
		if (chartData.length > 0 && chartData[0].length > 0) {
			setLoading(false);
		}
	}, [chartData]);

	useEffect(() => {
		props.navigation.setOptions({
			headerTitle: props.route.params.deviceName,
		});
	}, [props.route.params.deviceName]);

	return (
		<View>
			<View
				style={{
					width: "95%",
					height: Config.deviceHeight * 0.42,
					alignSelf: "center",
					justifyContent: "center",
					backgroundColor: Colors.PrimaryLight,
					marginVertical: Config.deviceHeight * 0.025,
					borderRadius: 8,
				}}
			>
				<ActivityIndicator
					style={{ position: "absolute", top: "45%", left: "45%" }}
					animating={loading}
					size="large"
					color={Colors.Secondary}
				/>
				<View>
					<VictoryChart
						height={Config.deviceHeight * 0.42}
						width={Config.deviceWidth * 0.95}
						domainPadding={{ y: 25 }}
					>
						<VictoryAxis
							tickFormat={
								loading
									? []
									: (x) =>
											new Date(x).getHours() +
											":" +
											(
												"0" + new Date(x).getMinutes()
											).slice(-2) +
											"\n" +
											new Date(x).getMonth() +
											"/" +
											new Date(x).getDate()
							}
							style={{
								grid: {
									stroke: Colors.ThirdlyDark,
									strokeDasharray: [5, 5],
								},
								tickLabels: {
									fontSize: 6 + Config.deviceWidth * 0.015,
								},
							}}
						/>
						<VictoryAxis
							dependentAxis
							tickFormat={(y) =>
								y +
								(activeVar.includes("CurrentTemp")
									? " °C"
									: " %")
							}
							style={{
								grid: {
									stroke: Colors.ThirdlyDark,
									strokeDasharray: [5, 5],
								},
								tickLabels: {
									fontSize: 6 + Config.deviceWidth * 0.015,
								},
							}}
						/>
						{activeVar.includes("CurrentTemp") &&
							activeVar.includes("CurrentHum") && (
								<VictoryAxis
									dependentAxis
									orientation="right"
									offsetX={50}
									tickFormat={(y) => y + " %"}
									style={{
										grid: {
											stroke: Colors.ThirdlyDark,
											strokeDasharray: [5, 5],
										},
										tickLabels: {
											fontSize:
												6 + Config.deviceWidth * 0.015,
										},
									}}
								/>
							)}
						{chartData.map((data, i) => (
							<VictoryLine
								key={i}
								style={{
									data: {
										stroke:
											data.length > 0
												? data[
														Math.floor(
															data.length * 0.2
														)
												  ]["label"] === " Current Temp"
													? Colors.Red
													: data[
															Math.floor(
																data.length *
																	0.4
															)
													  ]["label"] ===
													  " Set Point Temp"
													? Colors.Orange
													: data[
															Math.floor(
																data.length *
																	0.6
															)
													  ]["label"] ===
													  " Current Hum"
													? Colors.Primary
													: Colors.Secondary
												: null,
										strokeWidth: 3,
									},
								}}
								data={data}
							/>
						))}
					</VictoryChart>
				</View>

				<Text>{loading}</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignSelf: "center",
					width: "90%",
					height: Config.deviceHeight * 0.1,
					marginVertical: Config.deviceHeight * 0.01,
				}}
			>
				<View
					style={{
						width: "25%",
						backgroundColor:
							activeTime == 4
								? Colors.Secondary
								: Colors.PrimaryLight,
						borderTopLeftRadius: Config.deviceWidth * 0.02,
						borderBottomLeftRadius: Config.deviceWidth * 0.02,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
						}}
						onPress={() => setTimeNum(4)}
					>
						<Text
							style={{
								fontFamily:
									activeTime == 4
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								textAlign: "center",
								color:
									activeTime == 4
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							1 Month
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						borderRightWidth: 1,
						borderColor: Colors.SecondaryLight,
					}}
				/>
				<View
					style={{
						width: "25%",
						backgroundColor:
							activeTime == 3
								? Colors.Secondary
								: Colors.PrimaryLight,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
						}}
						onPress={() => setTimeNum(3)}
					>
						<Text
							style={{
								fontFamily:
									activeTime == 3
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								textAlign: "center",
								color:
									activeTime == 3
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							1 Week
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						borderRightWidth: 1,
						borderColor: Colors.SecondaryLight,
					}}
				/>
				<View
					style={{
						width: "25%",
						backgroundColor:
							activeTime == 2
								? Colors.Secondary
								: Colors.PrimaryLight,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
						}}
						onPress={() => setTimeNum(2)}
					>
						<Text
							style={{
								fontFamily:
									activeTime == 2
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								textAlign: "center",
								color:
									activeTime == 2
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							1 Day
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						borderRightWidth: 1,
						borderColor: Colors.SecondaryLight,
					}}
				/>
				<View
					style={{
						width: "25%",
						backgroundColor:
							activeTime == 1
								? Colors.Secondary
								: Colors.PrimaryLight,
						borderTopRightRadius: Config.deviceWidth * 0.02,
						borderBottomRightRadius: Config.deviceWidth * 0.02,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
						}}
						onPress={() => setTimeNum(1)}
					>
						<Text
							style={{
								fontFamily:
									activeTime == 1
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								textAlign: "center",
								color:
									activeTime == 1
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							8 Hours
						</Text>
					</TouchableOpacity>
				</View>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignSelf: "center",
					width: "90%",
					height: Config.deviceHeight * 0.1,
					marginVertical: Config.deviceHeight * 0.01,
				}}
			>
				<View
					style={{
						width: "33%",
						backgroundColor:
							activeVar.includes("CurrentHum") &&
							!activeVar.includes("CurrentTemp")
								? Colors.Secondary
								: Colors.PrimaryLight,
						borderTopLeftRadius: Config.deviceWidth * 0.02,
						borderBottomLeftRadius: Config.deviceWidth * 0.02,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() =>
							setVarName(["CurrentHum", "SetPointHum"])
						}
					>
						<Humidity
							height={Config.deviceHeight * 0.04}
							color={
								activeVar.includes("CurrentHum") &&
								!activeVar.includes("CurrentTemp")
									? Colors.PrimaryLight
									: Colors.PrimaryDark
							}
						/>
						<Text
							style={{
								fontFamily:
									activeVar.includes("CurrentHum") &&
									!activeVar.includes("CurrentTemp")
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								fontSize: Config.deviceHeight * 0.011,
								color:
									activeVar.includes("CurrentHum") &&
									!activeVar.includes("CurrentTemp")
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							Humidity
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						borderRightWidth: 1,
						borderColor: Colors.SecondaryLight,
					}}
				/>
				<View
					style={{
						width: "34%",
						backgroundColor:
							activeVar.includes("CurrentHum") &&
							activeVar.includes("CurrentTemp")
								? Colors.Secondary
								: Colors.PrimaryLight,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() =>
							setVarName([
								"CurrentHum",
								"SetPointHum",
								"CurrentTemp",
								"SetPointTemp",
							])
						}
					>
						<AntDesign
							name="link"
							size={Config.deviceHeight * 0.043}
							color={
								activeVar.includes("CurrentHum") &&
								activeVar.includes("CurrentTemp")
									? Colors.PrimaryLight
									: Colors.PrimaryDark
							}
						/>
						<Text
							style={{
								fontFamily:
									activeVar.includes("CurrentHum") &&
									activeVar.includes("CurrentTemp")
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								fontSize: Config.deviceHeight * 0.011,
								color:
									activeVar.includes("CurrentHum") &&
									activeVar.includes("CurrentTemp")
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							Combined
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						borderRightWidth: 1,
						borderColor: Colors.SecondaryLight,
						color:
							activeVar.includes("CurrentHum") &&
							!activeVar.includes("CurrentTemp")
								? Colors.PrimaryLight
								: Colors.PrimaryDark,
					}}
				/>
				<View
					style={{
						width: "33%",
						backgroundColor:
							activeVar.includes("CurrentTemp") &&
							!activeVar.includes("CurrentHum")
								? Colors.Secondary
								: Colors.PrimaryLight,
						borderTopRightRadius: Config.deviceWidth * 0.02,
						borderBottomRightRadius: Config.deviceWidth * 0.02,
					}}
				>
					<TouchableOpacity
						style={{
							width: "100%",
							height: "100%",
							justifyContent: "center",
							alignItems: "center",
						}}
						onPress={() =>
							setVarName(["CurrentTemp", "SetPointTemp"])
						}
					>
						<Thermometer
							height={Config.deviceHeight * 0.043}
							color={
								activeVar.includes("CurrentTemp") &&
								!activeVar.includes("CurrentHum")
									? Colors.PrimaryLight
									: Colors.PrimaryDark
							}
						/>
						<Text
							style={{
								fontFamily:
									activeVar.includes("CurrentTemp") &&
									!activeVar.includes("CurrentHum")
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								fontSize: Config.deviceHeight * 0.011,
								color:
									activeVar.includes("CurrentTemp") &&
									!activeVar.includes("CurrentHum")
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							Temperature
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
};

export default GraphScreen;
