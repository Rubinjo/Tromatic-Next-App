import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
} from "react-native";
import Config from "../utils/config";
import Colors from "../assets/constants/colors";

const Counter = (props) => {
    return (
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity
                onPress={() => props.onChange(props.item, props.setter + 0.1)}
                style={[
                    styles.input,
                    {
                        borderTopLeftRadius: Config.deviceWidth * 0.02,
                        borderTopRightRadius: Config.deviceWidth * 0.02,
                    },
                ]}
                disabled={props.disabled}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: Colors.Secondary,
                            fontSize: Config.deviceHeight * 0.06,
                            marginTop:
                                Platform.OS === "ios"
                                    ? -Config.deviceHeight * 0.012
                                    : -Config.deviceHeight * 0.0525,
                        },
                    ]}
                >
                    +
                </Text>
            </TouchableOpacity>
            <View
                style={[
                    styles.input,
                    {
                        height: Config.deviceHeight * 0.07,
                        flexDirection: "row",
                        borderTopWidth: 1,
                        borderBottomWidth: 1,
                        borderColor: Colors.SecondaryLight,
                    },
                ]}
            >
                <View
                    style={{
                        height: "100%",
                        width: "50%",
                        backgroundColor: Colors.SecondaryLight,
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "noto-sans-jp-regular",
                            fontSize: Config.deviceHeight * 0.014,
                            position: "absolute",
                            top: Platform.OS === "ios" ? 0 : "-15%",
                            right: "4%",
                        }}
                    >
                        ACT
                    </Text>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: Config.deviceHeight * 0.025,
                                alignSelf: "center",
                                paddingTop: "8%",
                            },
                        ]}
                    >
                        {typeof props.actual !== "undefined"
                            ? props.actual.toFixed(1)
                            : "-"}
                    </Text>
                </View>

                <View
                    style={{
                        height: "100%",
                        borderLeftWidth: 1,
                        borderColor: Colors.SecondaryLight,
                    }}
                />
                <View
                    style={{
                        height: "100%",
                        width: "50%",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        style={{
                            fontFamily: "noto-sans-jp-regular",
                            fontSize: Config.deviceHeight * 0.014,
                            position: "absolute",
                            top: Platform.OS === "ios" ? 0 : "-15%",
                            right: "4%",
                        }}
                    >
                        SET
                    </Text>
                    <Text
                        style={[
                            styles.text,
                            {
                                fontSize: Config.deviceHeight * 0.025,
                                alignSelf: "center",
                                paddingTop: "8%",
                            },
                        ]}
                    >
                        {typeof props.setter !== "undefined"
                            ? props.setter.toFixed(1)
                            : "-"}
                    </Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={() => props.onChange(props.item, props.setter - 0.1)}
                style={[
                    styles.input,
                    {
                        borderBottomLeftRadius: Config.deviceWidth * 0.02,
                        borderBottomRightRadius: Config.deviceWidth * 0.02,
                    },
                ]}
                disabled={props.disabled}
            >
                <Text
                    style={[
                        styles.text,
                        {
                            color: Colors.Secondary,
                            fontSize: Config.deviceHeight * 0.07,
                            marginTop:
                                Platform.OS === "ios"
                                    ? -Config.deviceHeight * 0.025
                                    : -Config.deviceHeight * 0.07,
                        },
                    ]}
                >
                    -
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        fontFamily: "noto-sans-jp-regular",
    },
    input: {
        width: Config.deviceWidth * 0.24,
        height: Config.deviceHeight * 0.07,
        backgroundColor: Colors.PrimaryLight,
        alignItems: "center",
        justifyContent: "center",
    },
});

export default Counter;
