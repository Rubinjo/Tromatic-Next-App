import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const originalWidth = 36.627;
const originalHeight = 21.334;
const aspectRatio = originalWidth / originalHeight;
const Valve = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
		>
			<Path
				stroke={props.color}
				strokeLinecap="round"
				strokeMiterlimit={10}
				strokeWidth={1.5}
				d="M3.378 10.667h29.871"
			/>
			<Path
				stroke={props.color}
				strokeDasharray="1 3"
				strokeLinecap="round"
				strokeMiterlimit={10}
				strokeWidth={1.5}
				d="m6.123 2.89 25.188 16.057"
			/>
			<Path
				fill={props.color}
				d="M21.653 10.667a3.332 3.332 0 1 1-3.332-3.332 3.332 3.332 0 0 1 3.332 3.332"
			/>
			<Path
				stroke={props.color}
				strokeLinecap="round"
				strokeMiterlimit={10}
				strokeWidth={1.5}
				d="M35.877.75v19.834M.75.75v19.834"
			/>
		</Svg>
	</View>
);
export default Valve;
