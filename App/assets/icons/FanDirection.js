import * as React from "react";
import { View } from "react-native";
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg";

const originalWidth = 47.716;
const originalHeight = 20.55;
const aspectRatio = originalWidth / originalHeight;

const FanDirection = (props) => (
	<View style={[{ aspectRatio: aspectRatio }, { ...props }]}>
		<Svg
			xmlns="http://www.w3.org/2000/svg"
			width="100%"
			height="100%"
			viewBox={`0 0 ${originalWidth} ${originalHeight}`}
			fill="none"
		>
			<Defs>
				<ClipPath id="a">
					<Path fill={props.color} d="M0 0h20.016v20.421H0z" />
				</ClipPath>
			</Defs>
			<G clipPath="url(#a)">
				<Path
					fill={props.color}
					d="M.001 11.665c.243-1.305 1.685-.586 1.685-.586a7.857 7.857 0 0 0 5.474.287 3.055 3.055 0 0 1-.19-.683C.886 8.623 1.114 6.069 1.114 6.069a4.877 4.877 0 0 1 2.633-3.794c1.254-.442 1.354 1.167 1.354 1.167a7.856 7.856 0 0 0 2.486 4.884 3.1 3.1 0 0 1 .5-.505C6.822 1.517 9.148.437 9.148.437a4.877 4.877 0 0 1 4.6.384c1.009.864-.335 1.753-.335 1.753a7.858 7.858 0 0 0-2.985 4.6 3.05 3.05 0 0 1 .686.177c4.828-4.244 6.926-2.77 6.926-2.77a4.877 4.877 0 0 1 1.971 4.175c-.243 1.305-1.685.586-1.685.586a7.857 7.857 0 0 0-5.474-.287 3.043 3.043 0 0 1 .189.684c6.09 2.062 5.86 4.614 5.86 4.614a4.877 4.877 0 0 1-2.633 3.793c-1.252.442-1.35-1.166-1.35-1.166a7.856 7.856 0 0 0-2.489-4.884 3.087 3.087 0 0 1-.5.505c1.262 6.3-1.064 7.384-1.064 7.384a4.876 4.876 0 0 1-4.6-.384c-1.009-.864.335-1.753.335-1.753a7.856 7.856 0 0 0 2.985-4.6 3.049 3.049 0 0 1-.686-.177c-4.828 4.244-6.926 2.77-6.926 2.77a4.876 4.876 0 0 1-1.972-4.176m11.419-1.454a1.412 1.412 0 1 0-1.412 1.412 1.412 1.412 0 0 0 1.412-1.412"
				/>
			</G>
			<G
				stroke={props.color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
			>
				<Path d="M46.966 6.606H26.088M29.06 3.126l-3.542 3.542 3.542 3.542" />
			</G>
			<G
				stroke={props.color}
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
			>
				<Path d="M25.518 15.886h20.878M43.229 19.49l3.542-3.542-3.542-3.542" />
			</G>
		</Svg>
	</View>
);
export default FanDirection;
