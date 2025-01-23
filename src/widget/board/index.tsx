import {FC, HTMLAttributes} from "react";
import {CellComponent} from "@/shared/components";
import {useGameContext} from "@/shared/store";
import {useCellUseCase} from "@/entities/cell";
import {useBoardUseCase} from "@/entities/board";

type IBoardWidgetProps = HTMLAttributes<HTMLDivElement>;

const BoardWidget: FC<IBoardWidgetProps> = ({className, ...props}) => {
	const {board} = useGameContext()
	const { handleCellClick } = useCellUseCase()
	useBoardUseCase()

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				gap: 8,
			}}
			{...props}
		>
			{board.map((row, index) => (
				<div key={index} style={{
					display: "flex",
					gap: 8,
				}}>
					{row.map((column) => (
						<CellComponent
							cell={column}
							key={column.id}
							onClick={handleCellClick}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export default BoardWidget
