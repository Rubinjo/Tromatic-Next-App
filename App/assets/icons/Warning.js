import * as React from "react"
import Svg, { Defs, ClipPath, Path, G } from "react-native-svg"
const Warning = (props) => (
    <Svg xmlns="http://www.w3.org/2000/svg" width={47} height={40} {...props}>
        <Defs>
            <ClipPath id="a">
                <Path fill="none" d="M0 0h3.937v24.385H0z" />
            </ClipPath>
        </Defs>
        <Path
            fill="#ffd800"
            d="M19.189 7.338a5 5 0 0 1 8.622 0l14.764 25.129A5 5 0 0 1 38.263 40H8.737a5 5 0 0 1-4.311-7.533Z"
        />
        <G fill="#161615" clipPath="url(#a)" transform="translate(21.531 11)">
            <Path d="M1.969 20.448a1.969 1.969 0 1 0 1.969 1.968 1.968 1.968 0 0 0-1.969-1.968M1.969 18.879a1.25 1.25 0 0 0 1.25-1.251l.718-15.659a1.969 1.969 0 0 0-3.937 0l.718 15.659a1.251 1.251 0 0 0 1.251 1.251" />
        </G>
    </Svg>
)
export default Warning
