import { useBoardUseCase } from "@/entities/board";
import { findCellById, useCellUseCase } from "@/entities/cell";
import { CellComponent } from "@/shared/components";
import { useGameContext } from "@/shared/store";
import { makeClassname } from "@/shared/utils";
import { FC, HTMLAttributes } from "react";
import styles from "./styles.module.scss";
import { Circle } from "./ui/circle";
import { Cross } from "./ui/cross";

type IBoardWidgetProps = HTMLAttributes<HTMLDivElement>;

const BoardWidget: FC<IBoardWidgetProps> = ({ className, ...props }) => {
	const game = useGameContext()
	const cellUseCase = useCellUseCase()

	useBoardUseCase(cellUseCase.handleCellClick)

	return (
		<div
      className={makeClassname(
        className,
        styles.rootContainer,
        game.winner.win && styles.gameOver
      )}
			{...props}
		>
			{game.board.map((row, index) => (
				<div
          key={index}
          className={styles.rowContainer}
        >
					{row.map((column) => (
						<CellComponent
              key={column.id}
							cell={column}
							onClick={cellUseCase.handleCellClick}
              renderIcon={(player, id) => {
                const cellIsExistInWin = Boolean(findCellById(game.winner.cells, id))

                if (player === "X") return <Cross stroke={cellIsExistInWin} />
                if (player === "O") return <Circle stroke={cellIsExistInWin} />

                return null
              }}
						/>
					))}
				</div>
			))}
		</div>
	);
};

export {
	Circle,
	Cross,
}

export default BoardWidget
