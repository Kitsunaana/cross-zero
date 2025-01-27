import { makeClassname } from "@/shared/utils";
import { SVGProps } from "react";
import styles from "./styles.module.scss";

type CrossProps = Omit<SVGProps<SVGSVGElement>, "stroke"> & {
	stroke?: boolean
}

export const Cross = ({ stroke, ...other }: CrossProps) => (
	<svg width="50" height="50" {...other}>
		<line
			x1="5"
			y1="5"
			x2="45"
			y2="45"
			className={makeClassname(
				styles.cross,
				stroke && styles.win
			)}
		/>
		<line
			x1="45"
			y1="5"
			x2="5"
			y2="45"
			className={makeClassname(
				styles.cross,
				stroke && styles.win
			)}
		/>
	</svg>
)
