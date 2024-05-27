import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import Config from "../../utils/config";

const originalWidth = 120;
const originalHeight = 120;
const aspectRatio = originalWidth / originalHeight;
const Stop = (props) => (
    <View
        style={[
            {
                aspectRatio: aspectRatio,
                paddingHorizontal:
                    16 -
                    Config.deviceHeight * 0.008 -
                    Config.deviceWidth * 0.008,
                paddingTop:
                    16 -
                    Config.deviceHeight * 0.008 -
                    Config.deviceWidth * 0.008,
            },
            { ...props },
        ]}
    >
        <Svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox={`0 0 ${originalWidth} ${originalHeight}`}
            {...props.style}
        >
            <Path
                d="M33.01 45.829a12.071 12.071 0 0 0-12.098 12.097v71.912a12.071 12.071 0 0 0 12.098 12.097h71.911a12.07 12.07 0 0 0 12.098-12.097V57.926A12.07 12.07 0 0 0 104.92 45.83zm6.744 26.23c3.99 0 6.48 3.269 7.264 5.085l-3.24 6.84c-.58-1.27-1.944-3.935-4.468-3.935-1.705 0-2.66 1.695-2.66 3.814 0 6.84 10.982 5.812 10.982 19.311 0 6.356-2.967 12.531-9.038 12.531-4.604 0-7.47-3.632-8.288-5.267l2.967-7.627c1.024 1.816 3.104 5.085 6.003 5.085 2.08 0 3.07-1.876 3.07-4.116 0-6.72-11.017-5.812-11.017-19.19 0-7.022 3.48-12.531 8.425-12.531zm37.21 0c5.934 0 9.788 5.811 9.788 21.611 0 15.437-4.264 22.035-10.096 22.035-5.968 0-9.72-5.69-9.72-21.55 0-15.437 4.23-22.096 10.027-22.096zm-28.787.605h17.088v7.628H59.33v34.807h-5.218V80.292h-5.935zm42.906 0h8.186c4.843 0 8.356 3.209 8.356 12.592 0 7.93-2.353 14.77-9.345 14.77h-1.978V115.1h-5.219Zm-14.427 7.083c-2.558 0-4.365 3.269-4.365 13.802 0 10.715 1.773 14.468 4.672 14.468 2.729 0 4.4-3.45 4.4-13.923 0-10.594-1.808-14.347-4.707-14.347zm19.646.726V92.46h1.705c3.479 0 4.23-2.663 4.23-5.932 0-4.177-1.16-6.054-3.82-6.054z"
                style={{
                    fill: props.color,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                }}
                transform="translate(-20.912 -45.829)"
            />
        </Svg>
    </View>
);
export default Stop;
