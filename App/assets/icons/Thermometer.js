import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const originalWidth = 29.92;
const originalHeight = 39.524;
const aspectRatio = originalWidth / originalHeight;
const Thermometer = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
			fill="none"
		>
			<Path
				stroke={props.color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M12.826 23.83V4.75a4 4 0 0 0-8 0v19.08a8 8 0 0 0-3.755 8.938 7.9 7.9 0 0 0 5.79 5.748 8 8 0 0 0 5.965-14.686Z"
			/>
			<Path
				fill={props.color}
				d="M17.847 11.657a2.287 2.287 0 0 0 2.332-2.307 2.285 2.285 0 0 0-2.331-2.3 2.277 2.277 0 0 0-2.332 2.3 2.278 2.278 0 0 0 2.331 2.307Zm0-1.23a1.068 1.068 0 0 1-1.052-1.077 1.058 1.058 0 0 1 1.052-1.077A1.049 1.049 0 0 1 18.9 9.35a1.055 1.055 0 0 1-1.053 1.077Zm8.026 6.487a4.029 4.029 0 0 0 3.876-2.146 1.506 1.506 0 0 0 .164-.663.767.767 0 0 0-.82-.786.783.783 0 0 0-.786.567 2.473 2.473 0 0 1-2.447 1.531c-1.709 0-2.789-1.388-2.789-3.6s1.087-3.6 2.782-3.6A2.543 2.543 0 0 1 28.28 9.83a.882.882 0 0 0 .861.622.727.727 0 0 0 .779-.772 1.551 1.551 0 0 0-.164-.663 4.075 4.075 0 0 0-3.917-2.3c-2.789 0-4.573 1.948-4.573 5.093-.001 3.169 1.76 5.104 4.607 5.104Z"
			/>
		</Svg>
	</View>
);
export default Thermometer;
