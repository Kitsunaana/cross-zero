import { makeClassname } from "@/shared/utils";
import { SVGProps } from "react";
import styles from "./styles.module.scss";

type CircleProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & {
	stroke?: boolean
}

export const Circle = ({ stroke, ...other }: CircleProps) => (
	<svg width="50" height="50" {...other}>
		<circle
			cx="25"
			cy="25"
			r="20"
			className={makeClassname(
				styles.circle,
				stroke && styles.win
			)}
		/>
	</svg>
)
