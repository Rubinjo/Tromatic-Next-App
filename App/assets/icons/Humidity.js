import * as React from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

const originalWidth = 23.38;
const originalHeight = 32.131;
const aspectRatio = originalWidth / originalHeight;
const Humidity = (props) => (
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
				d="M.75 21.171C.75 14.223 11.69.75 11.69.75s10.94 13.473 10.94 20.421-4.9 10.21-10.94 10.21S.75 28.118.75 21.171Z"
			/>
			<Path
				fill={props.color}
				d="M8.767 24.566a.828.828 0 0 0 .759-.472l2.946-4.43 2.714-4.04a.977.977 0 0 0 .191-.533.712.712 0 0 0-.752-.711.867.867 0 0 0-.82.492l-2.83 4.273-2.816 4.17a.9.9 0 0 0-.185.561.735.735 0 0 0 .793.69Zm-.889-4.689c1.456 0 2.393-1.039 2.393-2.762 0-1.743-.943-2.728-2.393-2.728s-2.4.991-2.4 2.728.938 2.762 2.4 2.762Zm0-1.285c-.4 0-.677-.431-.677-1.47s.273-1.449.677-1.449.67.4.67 1.442-.273 1.477-.67 1.477Zm7.625 5.974c1.467 0 2.4-1.046 2.4-2.757 0-1.743-.943-2.728-2.393-2.728s-2.395.987-2.395 2.728.929 2.757 2.388 2.757Zm0-1.292c-.4 0-.67-.424-.67-1.47s.27-1.449.67-1.449.67.4.67 1.449-.262 1.47-.67 1.47Z"
			/>
		</Svg>
	</View>
);
export default Humidity;
