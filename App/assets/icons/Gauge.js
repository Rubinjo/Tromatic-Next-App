import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"
const Gauge = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={28.5} height={19.5} {...props}>
        <Defs>
            <ClipPath id="a">
                <Path fill="none" stroke={props.color} d="M0 0h28.5v19.5H0z" />
            </ClipPath>
        </Defs>
        <G
            fill="none"
            stroke={props.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            clipPath="url(#a)"
        >
            <Path d="M.75 18.75h27v-4.5a13.5 13.5 0 0 0-27 0Z" />
            <Path d="M23.25 14.25a8.786 8.786 0 0 0-1.215-4.5M5.25 14.25a9.007 9.007 0 0 1 9-9M9.75 18.75a4.5 4.5 0 0 1 9 0M18.75 6.75l-3.27 7.68" />
        </G>
    </Svg>
)
export default Gauge
