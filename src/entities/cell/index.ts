import {useGameContext} from "@/shared/store";
import {ICell} from "@/shared/interfaces";
import { getPosition } from "./domain"

const useCellUseCase = () => {
	const game = useGameContext()

	const handleCellClick = (cell: ICell): void => {
		if (game.winner !== null) return

		const cellPosition = getPosition(cell.id)

		const player = game.currentPlayer === "X" ? "O" : "X"

		game.setCurrentPlayer(player)

		game.setBoard((prevBoard) => {
			const findRow = prevBoard[cellPosition.row]

			const replacedEmptyCellToPlayer = findRow.replace(cellPosition.column, {
				id: cell.id,
				player
			})

			return prevBoard.replace(cellPosition.row, replacedEmptyCellToPlayer)
		})
	}

	return {
		handleCellClick
	}
}

export {
	useCellUseCase,
}
