import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Switch,
    Platform,
    SafeAreaView,
    RefreshControl,
    Alert,
} from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ref, onValue, update } from "firebase/database";
import {
    BottomSheetModal,
    BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { MaterialIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";

import { UserAuth } from "../context/AuthContext";
import { firebase } from "../firebaseConfig";
import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import CompactSlider from "../components/CompactSlider";
import Thermometer from "../assets/icons/Thermometer";
import Counter from "../components/Counter";
import AnimatedFan from "../components/AnimatedFan";
import {
    directionTitle,
    directionValue,
    opModeTitle,
    opModeFanTitle,
} from "../utils/helper";
import Humidity from "../assets/icons/Humidity";
import Wood from "../assets/icons/Wood";
import Valve from "../assets/icons/Valve";
import Heating from "../assets/icons/Heating";
import Sprayer from "../assets/icons/Sprayer";
import FanDirection from "../assets/icons/FanDirection";
import { ScrollView } from "react-native-gesture-handler";
import Status from "../models/status";

const DetailsScreen = (props) => {
    const [refreshing, setRefreshing] = useState(false);
    const [areChanges, setAreChanges] = useState(false);
    const [dataFB, setDataFB] = useState({});
    const [data, setData] = useState({
        deviceName: "",
        currentHum: 0,
        currentTemp: 0,
        damperPos: 0,
        EMCOffset: 0,
        fanDirection: 0,
        heatingValvePos: 0,
        numOfWmProbes: 0,
        RPM: 0,
        remainingTime: 0,
        setPointHum: 0,
        setPointTemp: 0,
        sprayPos: 0,
        status: new Status(0),
        tempOffset: 0,
        numOfCTProbes: 0,
        damperOpMode: 0,
        heaterOpMode: 0,
        sprayOpMode: 0,
        fansOpMode: 0,
        dateTimeMessage: new Date(),
        currentWM: 0,
        CTs: [
            { id: 1, value: 0 },
            { id: 2, value: 0 },
            { id: 3, value: 0 },
            { id: 4, value: 0 },
            { id: 5, value: 0 },
            { id: 6, value: 0 },
            { id: 7, value: 0 },
            { id: 8, value: 0 },
            { id: 9, value: 0 },
            { id: 10, value: 0 },
            { id: 11, value: 0 },
            { id: 12, value: 0 },
        ],
        WMs: [
            { id: 1, value: 0, active: false },
            { id: 2, value: 0, active: false },
            { id: 3, value: 0, active: false },
            { id: 4, value: 0, active: false },
            { id: 5, value: 0, active: false },
            { id: 6, value: 0, active: false },
            { id: 7, value: 0, active: false },
            { id: 8, value: 0, active: false },
            { id: 9, value: 0, active: false },
            { id: 10, value: 0, active: false },
        ],
    });
    const [modalOpen, setModalOpen] = useState(false);

    const bottomSheetCTModalRef = useRef(null);
    const bottomSheetWMModalRef = useRef(null);

    const { user, role } = UserAuth();

    useEffect(() => {
        const machineRef = ref(
            firebase,
            "machines/" + props.route.params.machineId
        );
        onValue(machineRef, (snapshot) => {
            const machine = snapshot.val();
            setDataFB({
                ...dataFB,
                deviceName: machine.DeviceName,
                currentHum: machine.CurrentHum,
                currentTemp: machine.CurrentTemp,
                damperPos: machine.DamperPos,
                EMCOffset: machine.EMCOffset,
                fanDirection: machine.FanDirection,
                heatingValvePos: machine.HeatingValvePos,
                numOfWmProbes: machine.NumOfWmProbes,
                RPM: machine.RPM,
                remainingTime: machine.RemainingTime,
                totalTime: machine.TotalTime,
                setPointHum: machine.SetPointHum,
                setPointTemp: machine.SetPointTemp,
                sprayPos: machine.SprayPos,
                status: new Status(machine.Status),
                tempOffset: machine.TempOffset,
                numOfCTProbes: machine.NumOfCTProbes,
                damperOpMode: machine.DamperOpMode,
                heaterOpMode: machine.HeaterOpMode,
                sprayOpMode: machine.SprayOpMode,
                fansOpMode: machine.FansOpMode,
                dateTimeMessage: new Date(machine.DateTimeMessage),
                currentWM: machine.CurrentWM,
                CTs: [
                    { id: 1, value: machine.CTValue1 },
                    { id: 2, value: machine.CTValue2 },
                    { id: 3, value: machine.CTValue3 },
                    { id: 4, value: machine.CTValue4 },
                    { id: 5, value: machine.CTValue5 },
                    { id: 6, value: machine.CTValue6 },
                    { id: 7, value: machine.CTValue7 },
                    { id: 8, value: machine.CTValue8 },
                    { id: 9, value: machine.CTValue9 },
                    { id: 10, value: machine.CTValue10 },
                    { id: 11, value: machine.CTValue11 },
                    { id: 12, value: machine.CTValue12 },
                ],
                WMs: [
                    {
                        id: 1,
                        value: machine.WMValue1,
                        active: machine.WMActive1,
                    },
                    {
                        id: 2,
                        value: machine.WMValue2,
                        active: machine.WMActive2,
                    },
                    {
                        id: 3,
                        value: machine.WMValue3,
                        active: machine.WMActive3,
                    },
                    {
                        id: 4,
                        value: machine.WMValue4,
                        active: machine.WMActive4,
                    },
                    {
                        id: 5,
                        value: machine.WMValue5,
                        active: machine.WMActive5,
                    },
                    {
                        id: 6,
                        value: machine.WMValue6,
                        active: machine.WMActive6,
                    },
                    {
                        id: 7,
                        value: machine.WMValue7,
                        active: machine.WMActive7,
                    },
                    {
                        id: 8,
                        value: machine.WMValue8,
                        active: machine.WMActive8,
                    },
                    {
                        id: 9,
                        value: machine.WMValue9,
                        active: machine.WMActive9,
                    },
                    {
                        id: 10,
                        value: machine.WMValue10,
                        active: machine.WMActive10,
                    },
                ],
            });
        });
    }, [refreshing]);

    useEffect(() => {
        if (areChanges == false) {
            setData(dataFB);
        }
    }, [dataFB]);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: (props) =>
                areChanges &&
                (role === "owner" || role === "admin" || role === "editor") ? (
                    <TouchableOpacity
                        onPress={sendData}
                        style={{ marginRight: 12 }}
                    >
                        <MaterialCommunityIcons
                            name={"check"}
                            size={34}
                            color={"white"}
                        />
                    </TouchableOpacity>
                ) : data.remainingTime > 0 &&
                  (role === "owner" ||
                      role === "admin" ||
                      role === "editor") ? (
                    <TouchableOpacity
                        onPress={() =>
                            Alert.alert(
                                i18n.t("general.error.StopProgram"),
                                i18n.t("general.error.StopProgramMessage"),
                                [
                                    {
                                        text: i18n.t("general.yes"),
                                        onPress: () => sendStop(),
                                    },
                                    {
                                        text: i18n.t("general.no"),
                                        onPress: () =>
                                            console.log("No Pressed"),
                                    },
                                ]
                            )
                        }
                        style={{ marginRight: 12 }}
                    >
                        <Ionicons name={"stop"} size={34} color={"white"} />
                    </TouchableOpacity>
                ) : (
                    <View></View>
                ),
        });
    }, [areChanges, data]);

    useEffect(() => {
        props.navigation.setOptions({
            headerTitle: data.deviceName,
        });
    }, [data.deviceName]);

    const onWMChange = (id, value, active) => {
        const newArray = [...data.WMs];
        newArray.splice(id - 1, 1);
        newArray.splice(id - 1, 0, { id: id, value: value, active: active });
        onChange("WMs", newArray);
    };

    const onChange = (item, value) => {
        setAreChanges(true);
        setData({ ...data, [item]: value });
    };

    const onRefresh = () => {
        console.log("refreshing");
        setRefreshing(true);
        setTimeout(() => {
            setData(dataFB);
            setAreChanges(false);
            setRefreshing(false);
        }, 1000);
    };

    const sendData = () => {
        const updates = {};
        if (data.setPointTemp != dataFB.setPointTemp) {
            updates[
                "machines/" + props.route.params.machineId + "/TempOffset"
            ] = dataFB.tempOffset + (data.setPointTemp - dataFB.setPointTemp);
        }
        if (data.setPointHum != dataFB.setPointHum) {
            updates["machines/" + props.route.params.machineId + "/EMCOffset"] =
                dataFB.EMCOffset + (data.setPointHum - dataFB.setPointHum);
        }
        if (data.WMs[0].active != dataFB.WMs[0].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive1"] =
                data.WMs[0].active;
        }
        if (data.WMs[1].active != dataFB.WMs[1].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive2"] =
                data.WMs[1].active;
        }
        if (data.WMs[2].active != dataFB.WMs[2].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive3"] =
                data.WMs[2].active;
        }
        if (data.WMs[3].active != dataFB.WMs[3].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive4"] =
                data.WMs[3].active;
        }
        if (data.WMs[4].active != dataFB.WMs[4].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive5"] =
                data.WMs[4].active;
        }
        if (data.WMs[5].active != dataFB.WMs[5].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive6"] =
                data.WMs[5].active;
        }
        if (data.WMs[6].active != dataFB.WMs[6].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive7"] =
                data.WMs[6].active;
        }
        if (data.WMs[7].active != dataFB.WMs[7].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive8"] =
                data.WMs[7].active;
        }
        if (data.WMs[8].active != dataFB.WMs[8].active) {
            updates["machines/" + props.route.params.machineId + "/WMActive9"] =
                data.WMs[8].active;
        }
        if (data.WMs[9].active != dataFB.WMs[9].active) {
            updates[
                "machines/" + props.route.params.machineId + "/WMActive10"
            ] = data.WMs[9].active;
        }
        updates[
            "machines/" + props.route.params.machineId + "/DateTimeMessage"
        ] = new Date().toISOString();
        updates["machines/" + props.route.params.machineId + "/LastEditor"] =
            "u" + user.uid;
        update(ref(firebase), updates);
        setAreChanges(false);
    };

    const sendStop = () => {
        const updates = {};
        updates["machines/" + props.route.params.machineId + "/LastEditor"] =
            "u" + user.uid;
        updates[
            "machines/" + props.route.params.machineId + "/DateTimeMessage"
        ] = new Date().toISOString();
        updates[
            "machines/" + props.route.params.machineId + "/RemainingTime"
        ] = 0;
        update(ref(firebase), updates);
    };

    function handleCTModal() {
        bottomSheetCTModalRef.current?.present();
        setModalOpen(true);
    }
    function handleWMModal() {
        bottomSheetWMModalRef.current?.present();
        setModalOpen(true);
    }

    // const navigation = useNavigation();
    // const route = useRoute();
    // const { itemId, otherParam } = route.params;
    // const { chamberId } = props.route.params;
    // const selectedChamber = CHAMBERS.find((chamId) => chamId.id === chamberId);
    return (
        <BottomSheetModalProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            title={
                                data.dateTimeMessage
                                    ? i18n.t("general.lastUpdated") +
                                      ": " +
                                      (data.dateTimeMessage.toLocaleDateString(
                                          i18n.locale
                                      ) ===
                                      new Date().toLocaleDateString(i18n.locale)
                                          ? i18n.t("general.today")
                                          : data.dateTimeMessage.toLocaleDateString(
                                                i18n.locale
                                            )) +
                                      " " +
                                      data.dateTimeMessage.toLocaleTimeString(
                                          i18n.locale
                                      )
                                    : ""
                            }
                            tintColor={Colors.Secondary}
                            titleColor={Colors.PrimaryDark}
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }
                    style={{ flex: 1 }}
                >
                    {data.remainingTime > 0 && (
                        <View
                            style={{
                                marginTop: -8,
                                marginBottom: 8,
                                height: Config.deviceHeight * 0.04,
                            }}
                        >
                            <CompactSlider
                                remainingTime={dataFB.remainingTime}
                                totalTime={dataFB.totalTime}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignContent: "center",
                            alignSelf: "center",
                            height: Config.deviceHeight * 0.34,
                            marginBottom: Config.deviceHeight * 0.015,
                            width: "90%",
                        }}
                    >
                        <View
                            style={{ alignItems: "center", marginTop: "auto" }}
                        >
                            <Thermometer
                                height={Config.deviceHeight * 0.045}
                                color={Colors.Secondary}
                            />
                            <Text
                                style={{
                                    fontFamily: "noto-sans-jp-regular",
                                    fontSize: Config.deviceWidth * 0.032,
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? 0
                                            : -Config.deviceHeight * 0.008,
                                }}
                            >
                                {i18n.t("general.temperature")}
                            </Text>
                            <Counter
                                item={"setPointTemp"}
                                actual={data.currentTemp}
                                setter={data.setPointTemp}
                                onChange={onChange}
                            />
                        </View>
                        <View
                            style={{ alignItems: "center", marginTop: "auto" }}
                        >
                            <AnimatedFan
                                height={Config.deviceHeight * 0.09}
                                color={Colors.Primary}
                                direction={directionValue(data.fanDirection)}
                            />
                            <Text
                                style={{
                                    fontFamily: "noto-sans-jp-regular",
                                    fontSize: Config.deviceWidth * 0.032,
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? 0
                                            : -Config.deviceHeight * 0.008,
                                }}
                            >
                                {i18n.t("general.rpm")}
                            </Text>
                            <View
                                style={{
                                    alignItems: "center",
                                    backgroundColor: Colors.PrimaryLight,
                                    width: Config.deviceWidth * 0.3,
                                    borderRadius: Config.deviceWidth * 0.02,
                                    marginBottom: Config.deviceHeight * 0.02,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceWidth * 0.042,
                                        marginVertical:
                                            Platform.OS === "ios"
                                                ? Config.deviceHeight * 0.008
                                                : -Config.deviceHeight * 0.006,
                                    }}
                                >
                                    {data.RPM}
                                </Text>
                            </View>
                            <Wood
                                height={Config.deviceHeight * 0.062}
                                color={Colors.Primary}
                            />
                            <Text
                                style={{
                                    fontFamily: "noto-sans-jp-regular",
                                    fontSize: Config.deviceWidth * 0.032,
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? 0
                                            : -Config.deviceHeight * 0.008,
                                }}
                            >
                                {i18n.t("general.woodMoisture")}
                            </Text>
                            <View
                                style={{
                                    alignItems: "center",
                                    backgroundColor: Colors.PrimaryLight,
                                    width: Config.deviceWidth * 0.3,
                                    borderRadius: Config.deviceWidth * 0.02,
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceWidth * 0.042,
                                        marginVertical:
                                            Platform.OS === "ios"
                                                ? Config.deviceHeight * 0.008
                                                : -Config.deviceHeight * 0.006,
                                    }}
                                >
                                    {typeof data.currentWM !== "undefined"
                                        ? data.currentWM.toFixed(1)
                                        : "-"}
                                    {"%"}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{ alignItems: "center", marginTop: "auto" }}
                        >
                            <Humidity
                                height={Config.deviceHeight * 0.045}
                                color={Colors.Secondary}
                            />
                            <Text
                                style={{
                                    fontFamily: "noto-sans-jp-regular",
                                    fontSize: Config.deviceWidth * 0.032,
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? 0
                                            : -Config.deviceHeight * 0.008,
                                }}
                            >
                                {i18n.t("general.humidity")}
                            </Text>
                            <Counter
                                item={"setPointHum"}
                                actual={data.currentHum}
                                setter={data.setPointHum}
                                onChange={onChange}
                            />
                        </View>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-around",
                            alignSelf: "center",
                            width: "90%",
                            height: Config.deviceHeight * 0.15,
                            marginVertical: Config.deviceHeight * 0.015,
                        }}
                    >
                        <View
                            style={{
                                width: "25%",
                                backgroundColor: Colors.PrimaryLight,
                                borderTopLeftRadius: Config.deviceWidth * 0.02,
                                borderBottomLeftRadius:
                                    Config.deviceWidth * 0.02,
                            }}
                        >
                            <View
                                style={{ alignItems: "center", height: "45%" }}
                            >
                                <View
                                    style={{
                                        height: "75%",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Valve
                                        width={
                                            Config.deviceHeight * 0.04 +
                                            Config.deviceWidth * 0.03
                                        }
                                        color={Colors.Secondary}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.012,
                                    }}
                                >
                                    {i18n.t("general.valves")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    height: "55%",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.015,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {opModeTitle(data.damperOpMode)}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.018,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {data.damperPos}%
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderRightWidth: 1.5,
                                borderColor: Colors.PrimaryLight,
                            }}
                        />
                        <View
                            style={{
                                width: "25%",
                                backgroundColor: Colors.PrimaryLight,
                            }}
                        >
                            <View
                                style={{ alignItems: "center", height: "45%" }}
                            >
                                <View
                                    style={{
                                        height: "75%",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Heating
                                        width={Config.deviceHeight * 0.035}
                                        color={Colors.Secondary}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.012,
                                    }}
                                >
                                    {i18n.t("general.heating")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    height: "55%",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.015,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {opModeTitle(data.heaterOpMode)}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.018,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {data.heatingValvePos}%
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderRightWidth: 1.5,
                                borderColor: Colors.PrimaryLight,
                            }}
                        />
                        <View
                            style={{
                                width: "25%",
                                backgroundColor: Colors.PrimaryLight,
                            }}
                        >
                            <View
                                style={{ alignItems: "center", height: "45%" }}
                            >
                                <View
                                    style={{
                                        height: "75%",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <Sprayer
                                        width={
                                            Config.deviceHeight * 0.028 +
                                            Config.deviceWidth * 0.028
                                        }
                                        color={Colors.Secondary}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.012,
                                    }}
                                >
                                    {i18n.t("general.sprayer")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    height: "55%",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.015,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {opModeTitle(data.sprayOpMode)}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.018,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {data.sprayPos}%
                                </Text>
                            </View>
                        </View>
                        <View
                            style={{
                                borderRightWidth: 1.5,
                                borderColor: Colors.PrimaryLight,
                            }}
                        />
                        <View
                            style={{
                                width: "25%",
                                backgroundColor: Colors.PrimaryLight,
                                borderTopRightRadius: Config.deviceWidth * 0.02,
                                borderBottomRightRadius:
                                    Config.deviceWidth * 0.02,
                            }}
                        >
                            <View
                                style={{ alignItems: "center", height: "45%" }}
                            >
                                <View
                                    style={{
                                        height: "75%",
                                        justifyContent: "flex-end",
                                    }}
                                >
                                    <FanDirection
                                        width={
                                            Config.deviceHeight * 0.04 +
                                            Config.deviceWidth * 0.06
                                        }
                                        color={Colors.Secondary}
                                    />
                                </View>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.012,
                                    }}
                                >
                                    {i18n.t("general.direction")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    alignItems: "center",
                                    height: "55%",
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.015,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {opModeFanTitle(data.fansOpMode)}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceHeight * 0.018,
                                        marginVertical:
                                            Platform.OS == "ios"
                                                ? Config.deviceHeight * 0.003
                                                : -Config.deviceHeight * 0.01,
                                    }}
                                >
                                    {directionTitle(data.fanDirection)}
                                </Text>
                            </View>
                        </View>
                    </View>

                    <View
                        style={{
                            alignSelf: "center",
                            width: "90%",
                            marginTop: Config.deviceHeight * 0.015,
                        }}
                    >
                        {data.numOfCTProbes > 0 && (
                            <TouchableOpacity
                                style={{
                                    marginBottom: Config.deviceHeight * 0.005,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: Colors.PrimaryLight,
                                    borderRadius: 9,
                                    paddingHorizontal:
                                        Config.deviceWidth * 0.04,
                                    paddingVertical:
                                        Platform.OS === "ios"
                                            ? Config.deviceHeight * 0.015
                                            : Config.deviceHeight * 0.005,
                                }}
                                onPress={handleCTModal}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                    }}
                                >
                                    {i18n.t("general.coreTemperatures")}
                                </Text>
                                <MaterialIcons
                                    name="keyboard-arrow-down"
                                    size={Config.deviceWidth * 0.06}
                                    color={Colors.PrimaryDark}
                                />
                            </TouchableOpacity>
                        )}
                        {data.numOfWmProbes > 0 && (
                            <TouchableOpacity
                                style={{
                                    marginVertical: Config.deviceHeight * 0.005,
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    backgroundColor: Colors.PrimaryLight,
                                    borderRadius: 9,
                                    paddingHorizontal:
                                        Config.deviceWidth * 0.04,
                                    paddingVertical:
                                        Platform.OS === "ios"
                                            ? Config.deviceHeight * 0.015
                                            : Config.deviceHeight * 0.005,
                                }}
                                onPress={handleWMModal}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceWidth * 0.035,
                                    }}
                                >
                                    {i18n.t("general.measurements")}
                                </Text>
                                <MaterialIcons
                                    name="keyboard-arrow-down"
                                    size={Config.deviceWidth * 0.06}
                                    color={Colors.PrimaryDark}
                                />
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity
                            style={{
                                marginVertical: Config.deviceHeight * 0.005,
                                flexDirection: "row",
                                alignItems: "center",
                                justifyContent: "space-between",
                                backgroundColor: Colors.PrimaryLight,
                                borderRadius: 9,
                                paddingHorizontal: Config.deviceWidth * 0.04,
                                paddingVertical:
                                    Platform.OS === "ios"
                                        ? Config.deviceHeight * 0.015
                                        : Config.deviceHeight * 0.005,
                            }}
                            onPress={() => {
                                props.navigation.navigate("Graph", {
                                    machineId: props.route.params.machineId,
                                    deviceName: data.deviceName,
                                });
                            }}
                        >
                            <Text
                                style={{
                                    fontFamily: "noto-sans-jp-regular",
                                    fontSize: Config.deviceWidth * 0.035,
                                }}
                            >
                                {i18n.t("general.viewGraph")}
                            </Text>
                            <MaterialIcons
                                name="keyboard-arrow-right"
                                size={Config.deviceWidth * 0.06}
                                color={Colors.PrimaryDark}
                            />
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={{
                            marginTop: Config.deviceHeight * 0.03,
                            backgroundColor: Colors.Primary,
                            paddingVertical:
                                Platform.OS === "ios"
                                    ? Config.deviceHeight * 0.01
                                    : 0,
                        }}
                        onPress={onRefresh}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                width: "90%",
                                alignSelf: "center",
                                justifyContent: "space-between",
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Feather
                                    name="rotate-ccw"
                                    size={Config.deviceWidth * 0.05}
                                    color={Colors.PrimaryLight}
                                />
                                <Text
                                    style={{
                                        paddingLeft: Config.deviceWidth * 0.04,
                                        fontFamily: "noto-sans-jp-regular",
                                        fontSize: Config.deviceWidth * 0.036,
                                        color: Colors.PrimaryLight,
                                    }}
                                >
                                    {i18n.t("general.lastUpdated")}
                                </Text>
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-bold",
                                        fontSize: Config.deviceWidth * 0.036,
                                        color: Colors.PrimaryLight,
                                        paddingRight: Config.deviceWidth * 0.04,
                                    }}
                                >
                                    {data.dateTimeMessage
                                        ? data.dateTimeMessage.toLocaleDateString(
                                              i18n.locale,
                                              {
                                                  year: "numeric",
                                                  month: "2-digit",
                                                  day: "2-digit",
                                              }
                                          )
                                        : ""}
                                </Text>
                                <Text
                                    style={{
                                        fontFamily: "noto-sans-jp-bold",
                                        fontSize: Config.deviceWidth * 0.036,
                                        color: Colors.PrimaryLight,
                                    }}
                                >
                                    {data.dateTimeMessage
                                        ? data.dateTimeMessage.toLocaleTimeString(
                                              i18n.locale,
                                              {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                                  second: "2-digit",
                                              }
                                          )
                                        : ""}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
            <BottomSheetModal
                ref={bottomSheetCTModalRef}
                index={0}
                snapPoints={[
                    `${
                        Config.deviceHeight < 720
                            ? 12 + data.numOfWmProbes * 7.5
                            : 9.5 + data.numOfWmProbes * 6.9
                    }%`,
                ]}
                backgroundStyle={{
                    borderRadius: Config.deviceWidth * 0.08,
                    elevation: 4,
                }}
                onDismiss={() => setModalOpen(false)}
            >
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                        style={{
                            fontFamily: "noto-sans-jp-bold",
                            fontSize: Config.deviceWidth * 0.035,
                        }}
                    >
                        {i18n.t("general.coreTemperatures")}
                    </Text>
                    {data.CTs?.slice(0, data.numOfCTProbes).map((ct) => {
                        return (
                            <View
                                key={ct.id}
                                style={{
                                    width: "90%",
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? Config.deviceHeight * 0.02
                                            : 0,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "noto-sans-jp-regular",
                                            fontSize:
                                                Config.deviceWidth * 0.035,
                                        }}
                                    >
                                        {i18n.t("general.coreT")}
                                        {ct.id}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: "noto-sans-jp-regular",
                                            fontSize:
                                                Config.deviceWidth * 0.035,
                                        }}
                                    >
                                        {typeof ct.value !== "undefined"
                                            ? ct.value.toFixed(1)
                                            : "-"}
                                    </Text>
                                </View>
                                {ct.id !== data.numOfCTProbes && (
                                    <View
                                        style={{
                                            borderBottomWidth: 1,
                                            borderColor: Colors.PrimaryLight,
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </BottomSheetModal>
            <BottomSheetModal
                ref={bottomSheetWMModalRef}
                index={0}
                snapPoints={[
                    `${
                        Config.deviceHeight < 720
                            ? 12 + data.numOfWmProbes * 7.5
                            : 9.5 + data.numOfWmProbes * 6.9
                    }%`,
                ]}
                backgroundStyle={{
                    borderRadius: Config.deviceWidth * 0.08,
                    elevation: 4,
                }}
                onDismiss={() => setModalOpen(false)}
            >
                <View style={{ flex: 1, alignItems: "center" }}>
                    <Text
                        style={{
                            fontFamily: "noto-sans-jp-bold",
                            fontSize: Config.deviceWidth * 0.035,
                        }}
                    >
                        {i18n.t("general.measurements")}
                    </Text>
                    {data.WMs?.slice(0, data.numOfWmProbes).map((wm) => {
                        return (
                            <View
                                key={wm.id}
                                style={{
                                    width: "90%",
                                    marginVertical:
                                        Platform.OS === "ios"
                                            ? Config.deviceHeight * 0.005
                                            : 0,
                                }}
                            >
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontFamily: "noto-sans-jp-regular",
                                            fontSize:
                                                Config.deviceWidth * 0.035,
                                        }}
                                    >
                                        M{wm.id}
                                    </Text>
                                    <Text
                                        style={{
                                            fontFamily: "noto-sans-jp-regular",
                                            fontSize:
                                                Config.deviceWidth * 0.035,
                                        }}
                                    >
                                        {typeof wm.value !== "undefined"
                                            ? wm.value.toFixed(1)
                                            : "-"}
                                    </Text>
                                    <Switch
                                        trackColor={{
                                            true: Colors.Secondary,
                                            false:
                                                Platform.OS == "android"
                                                    ? Colors.SecondaryLight
                                                    : "#fbfbfb",
                                        }}
                                        thumbColor={
                                            Platform.OS == "ios"
                                                ? "#FFFFFF"
                                                : wm.active
                                                ? Colors.Secondary
                                                : "#ffffff"
                                        }
                                        ios_backgroundColor="#fbfbfb"
                                        onValueChange={(value) =>
                                            onWMChange(wm.id, wm.value, value)
                                        }
                                        value={wm.active}
                                        style={
                                            wm.active
                                                ? styles.switchEnableBorder
                                                : styles.switchDisableBorder
                                        }
                                    />
                                </View>
                                {wm.id !== data.numOfWmProbes && (
                                    <View
                                        style={{
                                            borderBottomWidth: 1,
                                            borderColor: Colors.SecondaryLight,
                                            marginVertical:
                                                Platform.OS === "ios"
                                                    ? Config.deviceHeight *
                                                      0.005
                                                    : 0,
                                        }}
                                    />
                                )}
                            </View>
                        );
                    })}
                </View>
            </BottomSheetModal>
        </BottomSheetModalProvider>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Primary + "1a", // opacity of 0.1
        // alignItems: "center",
        // width: "100%",
    },
    switchEnableBorder: {
        borderColor: "#6fa6d3",
        borderWidth: 1,
    },

    switchDisableBorder: {
        borderColor: "#f2f2f2",
        borderWidth: 1,
    },
    graphBox: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 20,
        borderRadius: 4,
        elevation: 3,
    },
});

export default DetailsScreen;
