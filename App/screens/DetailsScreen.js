import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Switch,
  Platform,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";

import { getAuth } from "firebase/auth";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { BottomSheetModal, BottomSheetModalProvider } from "@gorhom/bottom-sheet";

// import { CHAMBERS } from "../data/dummy-data";
import Config from "../utils/config";
import i18n from "../utils/i18n";
import Colors from "../assets/constants/colors";
import CompactSlider from "../components/CompactSlider"
import Thermometer from "../assets/icons/Thermometer"
import Counter from "../components/Counter";
import AnimatedFan from "../components/AnimatedFan"
import { directionTitle, directionValue, opModeTitle, opModeFanTitle } from "../utils/helper";
import Humidity from "../assets/icons/Humidity";
import Wood from "../assets/icons/Wood"
import Valve from "../assets/icons/Valve"
import Heating from "../assets/icons/Heating"
import Sprayer from "../assets/icons/Sprayer"
import FanDirection from "../assets/icons/FanDirection"

const DetailsScreen = (props) => {
  const [refreshing, setRefreshing] = useState(false);
  const [areChanges, setAreChanges] = useState(false);
  const [dataFB, setDataFB] = useState({})
  const [data, setData] = useState({
    deviceName: "",
    currentHum: 0,
    currentTemp: 0,
    damperPos: 0,
    EMCOffset: 0,
    fanDirection: 0,
    heatingValvePos: 0,
    numOfWmProbes: 5,
    RPM: 0,
    remainingTime: 0,
    setPointHum: 0,
    setPointTemp: 0,
    sprayPos: 0,
    status: 0,
    tempOffset: 0,
    numOfCTProbes: 5,
    damperOpMode: 0,
    heaterOpMode: 0,
    sprayOpMode: 0,
    fansOpMode: 0,
    timestamp: new Date(),
    CTs: [{ id: 1, value: 0 }, { id: 2, value: 0 }, { id: 3, value: 0 }, { id: 4, value: 0 }, { id: 5, value: 0 }, { id: 6, value: 0 }, { id: 7, value: 0 }, { id: 8, value: 0 }, { id: 9, value: 0 }, { id: 10, value: 0 }, { id: 11, value: 0 }, { id: 12, value: 0 }],
    WMs: [{ id: 1, value: 0, active: false }, { id: 2, value: 0, active: false }, { id: 3, value: 0, active: false }, { id: 4, value: 0, active: false }, { id: 5, value: 0, active: false }, { id: 6, value: 0, active: false }, { id: 7, value: 0, active: false }, { id: 8, value: 0, active: false }, { id: 9, value: 0, active: false }, { id: 10, value: 0, active: false }],
  });
  const [modalOpen, setModalOpen] = useState(false);

  const bottomSheetCTModalRef = useRef(null);
  const bottomSheetWMModalRef = useRef(null);

  useEffect(() => {
    const db = getDatabase();
    const machineRef = ref(db, "machines/" + props.route.params.machineId);
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
        status: machine.Status,
        tempOffset: machine.TempOffset,
        numOfCTProbes: machine.NumOfCTProbes,
        damperOpMode: machine.DamperOpMode,
        heaterOpMode: machine.HeaterOpMode,
        sprayOpMode: machine.SprayOpMode,
        fansOpMode: machine.FansOpMode,
        timestamp: new Date(machine.Timestamp),
        CTs: [{ id: 1, value: machine.CTValue1 }, { id: 2, value: machine.CTValue2 }, { id: 3, value: machine.CTValue3 }, { id: 4, value: machine.CTValue4 }, { id: 5, value: machine.CTValue5 }, { id: 6, value: machine.CTValue6 }, { id: 7, value: machine.CTValue7 }, { id: 8, value: machine.CTValue8 }, { id: 9, value: machine.CTValue9 }, { id: 10, value: machine.CTValue10 }, { id: 11, value: machine.CTValue11 }, { id: 12, value: machine.CTValue12 }],
        WMs: [{ id: 1, value: machine.WMValue1, active: machine.WMActive1 }, { id: 2, value: machine.WMValue2, active: machine.WMActive2 }, { id: 3, value: machine.WMValue3, active: machine.WMActive3 }, { id: 4, value: machine.WMValue4, active: machine.WMActive4 }, { id: 5, value: machine.WMValue5, active: machine.WMActive5 }, { id: 6, value: machine.WMValue6, active: machine.WMActive6 }, { id: 7, value: machine.WMValue7, active: machine.WMActive7 }, { id: 8, value: machine.WMValue8, active: machine.WMActive8 }, { id: 9, value: machine.WMValue9, active: machine.WMActive9 }, { id: 10, value: machine.WMValue10, active: machine.WMActive10 }]
      });
    });
  }, []);

  useEffect(() => {
    if (areChanges == false) {
      setData(dataFB)
    }
  }, [dataFB])

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: (props) =>
        areChanges ? (
          <TouchableOpacity onPress={sendData} style={{ marginRight: 12 }}>
            <MaterialCommunityIcons name={"check"} size={34} color={"white"} />
          </TouchableOpacity>
        ) : (
          <View></View>
        ),
    });
  }, [areChanges, data]);

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: data.deviceName
    });
  }, [data.deviceName]);

  const onWMChange = (id, value, active) => {
    const newArray = [...data.WMs]
    newArray.splice(id - 1, 1)
    newArray.splice(id - 1, 0, { id: id, value: value, active: active })
    onChange("WMs", newArray)
  }

  const onChange = (item, value) => {
    setAreChanges(true);
    setData({ ...data, [item]: value });
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setData(dataFB)
      setAreChanges(false);
      setRefreshing(false);
    }, 1000)
  };

  const sendData = () => {
    const db = getDatabase();
    const updates = {};
    if (data.setPointTemp != dataFB.setPointTemp) {
      updates["machines/" + props.route.params.machineId + "/SetPointTemp"] =
        data.setPointTemp;
    }
    if (data.setPointHum != dataFB.setPointHum) {
      updates["machines/" + props.route.params.machineId + "/SetPointHum"] =
        data.setPointHum;
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
      updates["machines/" + props.route.params.machineId + "/WMActive10"] =
        data.WMs[9].active;
    }
    updates["machines/" + props.route.params.machineId + "/Timestamp"] =
      new Date().toISOString();
    const auth = getAuth();
    updates["machines/" + props.route.params.machineId + "/LastEditor"] =
      "u" + auth.currentUser.uid;
    update(ref(db), updates);
    setAreChanges(false);
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
      <ScrollView
        refreshControl={<RefreshControl title={data.timestamp ? (i18n.t("general.lastUpdated") + ": " + (data.timestamp.toLocaleDateString() === new Date().toLocaleDateString() ? i18n.t("general.today") : data.timestamp.toLocaleDateString()) + " " + data.timestamp.toLocaleTimeString()) : ""} titleColor="black" refreshing={refreshing} onRefresh={onRefresh} />}
        style={styles.container}
      >
        {data.remainingTime > 0 &&
          <View style={{ marginTop: -8, marginBottom: 8, height: Config.deviceHeight * 0.04 }}>
            <CompactSlider remainingTime={dataFB.remainingTime} totalTime={dataFB.totalTime} />
          </View>
        }
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignContent: "center",
            alignSelf: "center",
            height: Config.deviceHeight * 0.35,
            width: "90%"
          }}
        >
          <View style={{ alignItems: "center" }}>
            <Thermometer />
            <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Temperature</Text>
            <Counter
              item={"setPointTemp"}
              actual={data.currentTemp}
              setter={data.setPointTemp}
              onChange={onChange}
            />
          </View>
          <View style={{ alignItems: "center" }}>
            <AnimatedFan
              direction={directionValue(data.fanDirection)}
            />
            <Text style={{ fontFamily: "noto-sans-jp-regular" }}>RPM</Text>
            <View style={{ alignItems: "center", backgroundColor: Colors.TextLight, width: Config.deviceWidth * 0.2, borderRadius: Config.deviceWidth * 0.02 }}>
              <Text style={{ fontFamily: "noto-sans-jp-regular" }}>{data.RPM}</Text>
            </View>
            <Wood />
            <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Woodmoisture</Text>
            <View style={{ alignItems: "center", backgroundColor: Colors.TextLight, width: Config.deviceWidth * 0.2, borderRadius: Config.deviceWidth * 0.02 }}>
              <Text style={{ fontFamily: "noto-sans-jp-regular" }}>?%</Text>
            </View>
          </View>
          <View style={{ alignItems: "center" }}>
            <Humidity />
            <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Humidity</Text>
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
            width: "90%"
          }}
        >
          <View style={{ width: "25%", alignItems: "center", backgroundColor: Colors.TextLight, borderTopLeftRadius: Config.deviceWidth * 0.02, borderBottomLeftRadius: Config.deviceWidth * 0.02 }}>
            <View style={{ alignItems: "center" }}>
              <Valve />
              <Text>Valve</Text>
            </View>
            <View style={{ alignItems: "center", marginTop: 2 }}>
              <Text>{opModeTitle(data.damperOpMode)}</Text>
              <Text>{data.damperPos}</Text>
            </View>
          </View>
          <View style={{ borderRightWidth: 1.5, borderColor: Colors.DetailsLight }} />
          <View style={{ width: "25%", alignItems: "center", backgroundColor: Colors.TextLight }}>
            <View style={{ alignItems: "center" }}>
              <Heating />
              <Text>Heating</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>{opModeTitle(data.heaterOpMode)}</Text>
              <Text>{data.heatingValvePos}%</Text>
            </View>
          </View>
          <View style={{ borderRightWidth: 1.5, borderColor: Colors.DetailsLight }} />
          <View style={{ width: "25%", alignItems: "center", backgroundColor: Colors.TextLight }}>
            <View style={{ alignItems: "center" }}>
              <Sprayer />
              <Text>Sprayer</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>{opModeTitle(data.sprayOpMode)}</Text>
              <Text>{data.sprayPos}%</Text>
            </View>
          </View>
          <View style={{ borderRightWidth: 1.5, borderColor: Colors.DetailsLight }} />
          <View style={{ width: "25%", alignItems: "center", backgroundColor: Colors.TextLight, borderTopRightRadius: Config.deviceWidth * 0.02, borderBottomRightRadius: Config.deviceWidth * 0.02 }}>
            <View style={{ alignItems: "center" }}>
              <FanDirection />
              <Text>Direction</Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text>{opModeFanTitle(data.fansOpMode)}</Text>
              <Text>{directionTitle(data.fanDirection)}</Text>
            </View>
          </View>
        </View>

        <View style={{
          alignSelf: "center",
          width: "90%"
        }}>
          <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Information</Text>
          <TouchableOpacity onPress={handleCTModal}>
            <Text>Core temperatures</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleWMModal}>
            <Text>Measurements</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Graph",
              {
                machineId: props.route.params.machineId,
              });
          }}
        >
          <View style={styles.graphBox}>
            <Text>View graph</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <BottomSheetModal
        ref={bottomSheetCTModalRef}
        index={0}
        snapPoints={["48%"]}
        backgroundStyle={{
          borderRadius: Config.deviceWidth * 0.08, elevation: 4
        }}
        onDismiss={() => setModalOpen(false)}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontFamily: "noto-sans-jp-bold" }}>Core temperatures</Text>
          {data.CTs?.slice(0, data.numOfCTProbes).map((ct) => {
            return (
              <View key={ct.id} style={{ width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: "noto-sans-jp-regular" }}>Core T{ct.id}</Text>
                <Text style={{ fontFamily: "noto-sans-jp-regular" }}>{ct.value}</Text>
              </View>
            )
          })}
        </View>
      </BottomSheetModal>
      <BottomSheetModal
        ref={bottomSheetWMModalRef}
        index={0}
        snapPoints={["48%"]}
        backgroundStyle={{ borderRadius: Config.deviceWidth * 0.08, elevation: 4 }}
        onDismiss={() => setModalOpen(false)}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ fontFamily: "noto-sans-jp-bold" }}>Measurements</Text>
          {data.WMs?.slice(0, data.numOfWmProbes).map((wm) => {
            return (
              <View key={wm.id} style={{ width: "90%", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <Text>M{wm.id}</Text>
                <Text>{wm.value}</Text>
                <Switch
                  trackColor={{
                    true: Colors.PrimaryForeground,
                    false: Platform.OS == "android" ? Colors.DetailsLight : "#fbfbfb",
                  }}
                  thumbColor={
                    Platform.OS == "ios"
                      ? "#FFFFFF"
                      : wm.active
                        ? Colors.PrimaryForeground
                        : "#ffffff"
                  }
                  ios_backgroundColor="#fbfbfb"
                  onValueChange={(value) => onWMChange(wm.id, wm.value, value)}
                  value={wm.active}
                  style={
                    wm.active
                      ? styles.switchEnableBorder
                      : styles.switchDisableBorder
                  }
                />

              </View>
            )
          })}
        </View>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PrimaryBackground + "1a", // opacity of 0.1
    // alignItems: "center",
    width: "100%",
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
  }
});

export default DetailsScreen;
