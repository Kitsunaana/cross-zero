import type { ICell, IWinner } from "@/shared/interfaces";
import { makeClassname } from "@/shared/utils";
import type { ComponentPropsWithoutRef, CSSProperties, FC, ReactNode } from "react";
import styles from "./styles.module.scss";

interface ICellComponentProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onClick'> {
	cell: ICell
	onClick?: (cell: ICell) => void
	renderIcon: (player: IWinner, id: string) => ReactNode
}

export const CellComponent: FC<ICellComponentProps> = ({
	className,
	cell,
	renderIcon,
	onClick,
	...props
}) => {
	const handleClick = () => onClick && onClick(cell)

	return (
		<button
			style={{ '--cellId': `"${cell.id}"` } as CSSProperties}
			className={makeClassname(styles.cell, className)}
			onClick={handleClick}
			{...props}
		>
			{renderIcon(cell.player, cell.id)}
		</button>
	)
}
