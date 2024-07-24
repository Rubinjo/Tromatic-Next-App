import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ActivityIndicator, Alert } from "react-native";
import { query, collection, where, getDocs } from "firebase/firestore";
import {
    VictoryChart,
    VictoryAxis,
    VictoryLine,
    VictoryLabel,
} from "victory-native";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import { TouchableOpacity } from "react-native-gesture-handler";
import Thermometer from "../assets/icons/Thermometer";
import WoodThermometer from "../assets/icons/WoodThermometer";
import WoodMoisture from "../assets/icons/WoodMoisture";

import { firestore } from "../firebaseConfig";

const GraphScreen = (props) => {
    const [loading, setLoading] = useState(true);
    // Array of all loaded data
    const [data, setData] = useState([]);
    // Array of all data for current chart
    const [chartData, setChartData] = useState([]);
    const [CTs, setCTs] = useState([]);
    const [WMs, setWMs] = useState([]);
    const [activeTime, setActiveTime] = useState(0);
    const [activeVar, setActiveVar] = useState([
        "CurrentTemp",
        "SetPointTemp",
        "CurrentHum",
        "SetPointHum",
    ]);
    // Till what timeOffset is already loaded into data
    const [loaded, setLoaded] = useState(0);
    const [error, setError] = useState();
    const timeOffsets = [0, 28800000, 86400000, 604800000, 2592000000]; // 0 sec, 8 hours, 24 hours, 7 days, 1 month
    const labelOffsets = {
        CurrentTemp: 0.2,
        SetPointTemp: 0.4,
        CurrentHum: 0.6,
        SetPointHum: 0.8,
        CTValue: 0.5,
        WMValue: 0.5,
    }; // Where to place graph label

    // Show alert when error occurs
    useEffect(() => {
        if (error) {
            setLoading(false);
            Alert.alert(i18n.t("general.error.error"), error, [
                {
                    text: i18n.t("general.okAllCaps"),
                    onPress: () => setError(""),
                },
            ]);
        }
    }, [error]);

    // Fetch graph data from firestore
    const fetchData = (timeNum) => {
        // startTime is till the timeOffset the user selected and endTime is the timeOffset that is currently loaded into data
        const startTime = new Date();
        const endTime = new Date();
        startTime.setTime(startTime.getTime() - timeOffsets[timeNum]);
        endTime.setTime(endTime.getTime() - timeOffsets[loaded]);

        try {
            // Query for history data from machine that is between already loaded and needed times
            const q = query(
                collection(
                    firestore,
                    "machines",
                    props.route.params.machineId,
                    "history"
                ),
                where("DateTimeMessage", ">=", startTime),
                where("DateTimeMessage", "<=", endTime)
            );
            getDocs(q)
                .then((querySnapshot) => {
                    const measurements = [];
                    // Loop through found history times
                    querySnapshot.forEach((doc) => {
                        measurements.push(doc.data());
                    });
                    setActiveTime(timeNum);
                    setLoaded(timeNum);
                    // Add new data to the already loaded data
                    setData((prevData) => [...measurements, ...prevData]);
                })
                .catch((err) => {
                    console.log(err);
                    setError(i18n.t("general.error.database"));
                });
        } catch (err) {
            console.log(err);
            setError(i18n.t("general.error.database"));
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
                            lenData -
                                lenTime +
                                lenTime *
                                    labelOffsets[
                                        varName.includes("CTValue")
                                            ? "CTValue"
                                            : varName.includes("WMValue")
                                            ? "WMValue"
                                            : varName
                                    ]
                        )
                    ) {
                        let match = varName.match(/(CTValue|WMValue)(\d{1,2})/);
                        dataForChart[j].push({
                            x: firestoreTime,
                            y: measurement[varName],
                            label:
                                i18n.t(
                                    "general." +
                                        (varName.includes("CTValue")
                                            ? "coreT"
                                            : varName.includes("WMValue")
                                            ? "measurementsShort"
                                            : varName)
                                ) + (match ? match[2] : ""),
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

    const setCTNames = () => {
        // Get first item of data if it exists
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            // Check on keys how many keys start with CTValue
            const CTNames = keys.filter((key) => key.startsWith("CTValue"));
            setCTs(CTNames);
        }
    };

    const setWMNames = () => {
        // Get first item of data if it exists
        if (data.length > 0) {
            const keys = Object.keys(data[0]);
            // Check on keys how many keys start with WMValue
            const WMNames = keys.filter((key) => key.startsWith("WMValue"));
            setWMs(WMNames);
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
        setCTNames();
        setWMNames();
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
                        <VictoryLabel
                            text={
                                activeVar.includes("CurrentTemp") &&
                                activeVar.includes("CurrentHum")
                                    ? "°C / %"
                                    : activeVar.includes("CTValue1") &&
                                      !activeVar.includes("CurrentHum")
                                    ? "    °C"
                                    : "     %"
                            }
                            x={25}
                            y={35}
                            textAnchor="middle"
                            style={{ fontSize: 6 + Config.deviceWidth * 0.015 }}
                        />
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
                            // tickFormat={(y) =>
                            //     y +
                            //     (activeVar.includes("CurrentTemp") ||
                            //     activeVar.includes("CTValue1")
                            //         ? " °C"
                            //         : " %")
                            // }
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
                        {/* {activeVar.includes("CurrentTemp") &&
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
                            )} */}
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
                                                  ]["label"] === "Current Temp"
                                                    ? Colors.Red
                                                    : data[
                                                          Math.floor(
                                                              data.length * 0.4
                                                          )
                                                      ]["label"] ===
                                                      "Set Point Temp"
                                                    ? Colors.Orange
                                                    : data[
                                                          Math.floor(
                                                              data.length * 0.5
                                                          )
                                                      ]["label"] &&
                                                      data[
                                                          Math.floor(
                                                              data.length * 0.5
                                                          )
                                                      ]["label"].includes(
                                                          "Core T"
                                                      )
                                                    ? Colors.Yellow
                                                    : data[
                                                          Math.floor(
                                                              data.length * 0.6
                                                          )
                                                      ]["label"] ===
                                                      "Current Hum"
                                                    ? Colors.Primary
                                                    : data[
                                                          Math.floor(
                                                              data.length * 0.5
                                                          )
                                                      ]["label"] &&
                                                      data[
                                                          Math.floor(
                                                              data.length * 0.5
                                                          )
                                                      ]["label"].includes("M")
                                                    ? Colors.Thirdly
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
                    height: Config.deviceHeight * 0.08,
                    marginVertical: 10 + Config.deviceHeight * 0.004,
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
                            1 {i18n.t("time.monthCap")}
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
                            1 {i18n.t("time.weekCap")}
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
                            1 {i18n.t("time.dayCap")}
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
                            8 {i18n.t("time.hoursCap")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
            <View
                style={{
                    width: "90%",
                    alignSelf: "center",
                    marginVertical: 10 + Config.deviceHeight * 0.004,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        height: Config.deviceHeight * 0.08,
                    }}
                >
                    <View
                        style={{
                            width: "25%",
                            backgroundColor:
                                activeVar.includes("CurrentTemp") &&
                                !activeVar.includes("CTValue1")
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
                                setVarName([
                                    "CurrentTemp",
                                    "SetPointTemp",
                                    "CurrentHum",
                                    "SetPointHum",
                                ])
                            }
                        >
                            {/* <Thermometer
                                height={Config.deviceHeight * 0.043}
                                color={
                                    activeVar.includes("CurrentTemp") &&
                                    !activeVar.includes("CTValue1")
                                        ? Colors.PrimaryLight
                                        : Colors.PrimaryDark
                                }
                            /> */}
                            <MaterialCommunityIcons
                                name="hydraulic-oil-temperature"
                                size={Config.deviceHeight * 0.04}
                                color={
                                    activeVar.includes("CurrentTemp") &&
                                    !activeVar.includes("CTValue1")
                                        ? Colors.PrimaryLight
                                        : Colors.PrimaryDark
                                }
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        activeVar.includes("CurrentTemp") &&
                                        !activeVar.includes("CTValue1")
                                            ? "noto-sans-jp-bold"
                                            : "noto-sans-jp-regular",
                                    fontSize: Config.deviceHeight * 0.011,
                                    color:
                                        activeVar.includes("CurrentTemp") &&
                                        !activeVar.includes("CTValue1")
                                            ? Colors.PrimaryLight
                                            : Colors.PrimaryDark,
                                }}
                            >
                                {i18n.t("general.kiln")}
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
                                activeVar.includes("CurrentTemp") &&
                                activeVar.includes("CTValue1")
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
                                    "CurrentTemp",
                                    "SetPointTemp",
                                    "CurrentHum",
                                    "SetPointHum",
                                    ...CTs,
                                ])
                            }
                        >
                            <AntDesign
                                name="link"
                                size={Config.deviceHeight * 0.04}
                                color={
                                    activeVar.includes("CurrentTemp") &&
                                    activeVar.includes("CTValue1")
                                        ? Colors.PrimaryLight
                                        : Colors.PrimaryDark
                                }
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        activeVar.includes("CurrentTemp") &&
                                        activeVar.includes("CTValue1")
                                            ? "noto-sans-jp-bold"
                                            : "noto-sans-jp-regular",
                                    fontSize: Config.deviceHeight * 0.011,
                                    color:
                                        activeVar.includes("CurrentTemp") &&
                                        activeVar.includes("CTValue1")
                                            ? Colors.PrimaryLight
                                            : Colors.PrimaryDark,
                                }}
                            >
                                {i18n.t("general.combined")}
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
                                activeVar.includes("CTValue1") &&
                                !activeVar.includes("CurrentTemp")
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
                            onPress={() => setVarName(CTs)}
                        >
                            <WoodThermometer
                                height={Config.deviceHeight * 0.038}
                                color={
                                    activeVar.includes("CTValue1") &&
                                    !activeVar.includes("CurrentTemp")
                                        ? Colors.PrimaryLight
                                        : Colors.PrimaryDark
                                }
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        activeVar.includes("CTValue1") &&
                                        !activeVar.includes("CurrentTemp")
                                            ? "noto-sans-jp-bold"
                                            : "noto-sans-jp-regular",
                                    fontSize: Config.deviceHeight * 0.011,
                                    color:
                                        activeVar.includes("CTValue1") &&
                                        !activeVar.includes("CurrentTemp")
                                            ? Colors.PrimaryLight
                                            : Colors.PrimaryDark,
                                }}
                            >
                                {i18n.t("general.coreT")}
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
                                activeVar.includes("WMValue1") &&
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
                            onPress={() => setVarName(WMs)}
                        >
                            <WoodMoisture
                                height={Config.deviceHeight * 0.03}
                                color={
                                    activeVar.includes("WMValue1") &&
                                    !activeVar.includes("CurrentHum")
                                        ? Colors.PrimaryLight
                                        : Colors.PrimaryDark
                                }
                            />
                            <Text
                                style={{
                                    fontFamily:
                                        activeVar.includes("WMValue1") &&
                                        !activeVar.includes("CurrentHum")
                                            ? "noto-sans-jp-bold"
                                            : "noto-sans-jp-regular",
                                    fontSize: Config.deviceHeight * 0.011,
                                    color:
                                        activeVar.includes("WMValue1") &&
                                        !activeVar.includes("CurrentHum")
                                            ? Colors.PrimaryLight
                                            : Colors.PrimaryDark,
                                }}
                            >
                                {i18n.t("general.measurements")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default GraphScreen;
