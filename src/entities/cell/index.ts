import { ICell } from "@/shared/interfaces";
import { useGameContext } from "@/shared/store";
import { findCellById, insertCellInBoard } from "./domain";

const useCellUseCase = () => {
	const game = useGameContext()

	const handleCellClick = (cell: ICell): void => {
		const cellOccupied = cell.player !== null
		const gameIsNotFinished = game.winner.win !== null

		if (cellOccupied || gameIsNotFinished) return

		const player = game.currentPlayer === "X" ? "O" : "X"

		game.setCurrentPlayer(player)
		game.setBoard((prevBoard) => insertCellInBoard(prevBoard, cell, player))

		game.setCounterStep((prev) => prev += 1)
	}

	return {
		handleCellClick,
	}
}

export {
	findCellById,
	useCellUseCase
};

