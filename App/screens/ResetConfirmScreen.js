import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    SafeAreaView
} from "react-native";

import Config from "../utils/config";
import Colors from "../assets/constants/colors";
import i18n from "../utils/i18n";
import TromaticNextLogo from "../assets/logos/Tromatic_Next";
import BesBollmannLogo from "../assets/logos/Bes_Bollmann";


const ResetConfirmScreen = (props) => {
    return (
        <SafeAreaView style={styles.container}>
            <View
                style={{
                    marginBottom: "auto",
                    marginTop: Platform.OS == "ios" ? Config.deviceHeight * 0.02 : 20 + Config.deviceHeight * 0.06,
                }}
            >
                <TromaticNextLogo width={Config.deviceWidth * 0.6} height={Config.deviceWidth * 0.6 * 0.3636} viewBox={"0 0 " + Config.deviceWidth * 0.7 + " " + Config.deviceWidth * 0.6 * 0.5} />
            </View>

            <View
                style={{
                    alignItems: "center",
                    flex: 1,
                    marginTop: Config.deviceHeight * 0.03,
                }}
            >
                <View style={{ paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.02 : 0, }}>
                    <Text style={styles.headText}>{i18n.t("authentication.resetHead")}</Text>
                </View>
                <View style={{ width: "80%", paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.01 : 0, }}>
                    <Text style={styles.bodyText}>{i18n.t("authentication.resetBodyInfo")}</Text>
                </View>
                <View style={{ width: "60%", paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.01 : 0, }}>
                    <Text style={styles.bodyText}>{i18n.t("authentication.resetBodyReceived")}</Text>

                </View>
                <TouchableOpacity style={styles.button} onPress={() => { props.navigation.navigate("SignIn") }}>
                    <Text
                        style={styles.headText}
                    >
                        {i18n.t("authentication.signIn")}
                    </Text>
                </TouchableOpacity>
            </View>

            <View
                style={{
                    marginBottom: Platform.OS == "android" ? Config.deviceHeight * 0.02 : 0,
                }}
            >
                <BesBollmannLogo width={Config.deviceWidth * 0.4} height={Config.deviceWidth * 0.4 * 0.1818} viewBox={"0 0 " + Config.deviceWidth * 0.4 + " " + Config.deviceWidth * 0.4 * 0.1818} />
            </View>
        </SafeAreaView>
    );
};

export const stackOptions = (navData) => {
    return {
        headerShown: false,
    };
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.PrimaryBackground,
        alignItems: "center",
    },
    headText: {
        fontFamily: "noto-sans-jp-bold",
        color: Colors.TextLight,
        fontSize: Config.deviceWidth * 0.07,
    },
    bodyText: {
        fontFamily: "noto-sans-jp-regular",
        color: Colors.TextLight,
        fontSize: Config.deviceWidth * 0.037,
        textAlign: "center",
    },
    button: {
        marginTop: Config.deviceHeight * 0.08,
        backgroundColor: Colors.PrimaryForeground,
        borderRadius: 8,
        paddingHorizontal: Config.deviceWidth * 0.2,
        paddingVertical: Platform.OS == "ios" ? Config.deviceHeight * 0.015 : 0,
    },
});

export default ResetConfirmScreen;
