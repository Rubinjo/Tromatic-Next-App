import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import {
	getFirestore,
	query,
	collection,
	where,
	getDocs,
	Timestamp,
} from "firebase/firestore";
import {
	VictoryChart,
	VictoryGroup,
	VictoryAxis,
	VictoryLine,
	VictoryLegend,
	VictoryTheme,
	VictoryScatter,
	LineSegment,
	VictoryZoomContainer,
} from "victory-native";

import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Thermometer from "../assets/icons/Thermometer";
import Humidity from "../assets/icons/Humidity";

const GraphScreen = (props) => {
	// const [firstRender, setFirstRender] = useState(true);
	const [loading, setLoading] = useState(true);
	// const [lastData, setLastData] = useState([]);
	const [data, setData] = useState([]);
	const [chartData, setChartData] = useState([]);
	const [activeTime, setActiveTime] = useState(0);
	const [activeVar, setActiveVar] = useState(["CurrentTemp", "SetPointTemp"]);
	const [loaded, setLoaded] = useState(0);
	const timeOffsets = [0, 28800000, 86400000, 604800000, 2592000000]; // 0 sec, 8 hours, 24 hours, 7 days, 1 month

	const fetchData = (timeNum) => {
		const startTime = new Date();
		const endTime = new Date();
		startTime.setTime(startTime.getTime() - timeOffsets[timeNum]);
		endTime.setTime(endTime.getTime() - timeOffsets[loaded]);
		try {
			const db = getFirestore();
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
				querySnapshot.forEach((doc) => {
					measurements.push(doc.data());
				});
				setActiveTime(timeNum);
				setData((prevData) => [...prevData, ...measurements]);
			});
		} catch (e) {
			console.log(e);
		}
	};

	const fetchChartData = (timeNum, varName) => {
		let dataForChart = new Array(varName.length);
		for (let i = 0; i < dataForChart.length; i++) {
			dataForChart[i] = new Array();
		}
		data.forEach((measurement) => {
			const time = new Date();
			time.setTime(time.getTime() - timeOffsets[timeNum]);
			const firestoreTime = new Date(
				measurement.DateTimeMessage.seconds * 1000 +
					measurement.DateTimeMessage.nanoseconds / 1000000
			);
			if (firestoreTime >= time) {
				varName.forEach((varName, i) => {
					dataForChart[i].push({
						x: firestoreTime,
						y: measurement[varName],
					});
				});
			}
		});
		setChartData(dataForChart);
	};

	const setTimeNum = (timeNum) => {
		if (timeNum > loaded) {
			fetchData(timeNum);
		} else {
			setActiveTime(timeNum);
			fetchChartData(timeNum, activeVar);
		}
	};

	const setVarName = (varName) => {
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
					width: "100%",
					height: Config.deviceHeight * 0.45,
					justifyContent: "center",
				}}
			>
				<ActivityIndicator
					style={{ position: "absolute", top: "45%", left: "45%" }}
					animating={loading}
					size="large"
					color={Colors.Secondary}
				/>
				<VictoryChart
					height={Config.deviceHeight * 0.4}
					domainPadding={{ y: 20 }}
				>
					<VictoryAxis
						tickFormat={
							loading
								? []
								: (x) =>
										new Date(x).getHours() +
										":" +
										("0" + new Date(x).getMinutes()).slice(
											-2
										) +
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
						}}
					/>
					<VictoryAxis
						dependentAxis
						style={{
							grid: {
								stroke: Colors.ThirdlyDark,
								strokeDasharray: [5, 5],
							},
						}}
					/>
					<VictoryLine
						style={{
							data: { stroke: Colors.Secondary, strokeWidth: 3 },
						}}
						data={chartData[0]}
					/>
					<VictoryLine
						style={{
							data: { stroke: Colors.Secondary, strokeWidth: 3 },
						}}
						data={chartData[1]}
					/>
				</VictoryChart>

				<Text>{loading}</Text>
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-around",
					alignSelf: "center",
					width: "90%",
					height: Config.deviceHeight * 0.1,
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
							1 week
						</Text>
					</TouchableOpacity>
				</View>
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
							1 day
						</Text>
					</TouchableOpacity>
				</View>
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
							8 hours
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
							?
						</Text>
					</TouchableOpacity>
				</View>
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
							alignItems: "center",
						}}
						onPress={() => setTimeNum(3)}
					>
						<Text
							style={{
								fontFamily:
									activeTime == 3
										? "noto-sans-jp-bold"
										: "noto-sans-jp-regular",
								color:
									activeTime == 3
										? Colors.PrimaryLight
										: Colors.PrimaryDark,
							}}
						>
							?
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						width: "25%",
						backgroundColor: activeVar.includes("CurrentHum")
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
							setVarName(["CurrentHum", "SetPointHum"])
						}
					>
						<Humidity
							height={Config.deviceHeight * 0.04}
							color={
								activeVar.includes("CurrentHum")
									? Colors.PrimaryLight
									: Colors.PrimaryDark
							}
						/>
						<Text
							style={{
								fontFamily: activeVar.includes("CurrentHum")
									? "noto-sans-jp-bold"
									: "noto-sans-jp-regular",
								fontSize: Config.deviceHeight * 0.011,
								color: activeVar.includes("CurrentHum")
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
						width: "25%",
						backgroundColor: activeVar.includes("CurrentTemp")
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
								activeVar.includes("CurrentTemp")
									? Colors.PrimaryLight
									: Colors.PrimaryDark
							}
						/>
						<Text
							style={{
								fontFamily: activeVar.includes("CurrentTemp")
									? "noto-sans-jp-bold"
									: "noto-sans-jp-regular",
								fontSize: Config.deviceHeight * 0.011,
								color: activeVar.includes("CurrentTemp")
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
