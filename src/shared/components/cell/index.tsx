import type {ComponentPropsWithoutRef, CSSProperties, FC} from "react";
import type {ICell} from "@/shared/interfaces";

import styles from "./styles.module.scss";
import {makeClassname} from "@/shared/utils";
import {Circle, Cross} from "@/shared/components";

interface ICellComponentProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
	cell: ICell
	onClick?(cell: ICell): void
}

const CellComponent: FC<ICellComponentProps> = ({className, cell, onClick, ...props}) => {
	const {player, id} = cell
	const handleClick = () => onClick && onClick(cell)

	return (
		<button
			style={{ '--cellId': `"${id}"` } as CSSProperties}
			onClick={handleClick}
			className={makeClassname(styles.cell, className)}
			{...props}
		>
			{player === "O" && <Circle />}
			{player === "X" && <Cross />}
		</button>
	)
}

export {
	CellComponent
};
