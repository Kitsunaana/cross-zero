import { ICell } from "@/shared/interfaces"
import { useGameContext } from "@/shared/store"
import { useEffect } from "react"
import { checkWinner, isDraw } from "./domain"
import { runMoveBot } from "./domain/bot.ts"

const useBoardUseCase = (handleCellBotClick?: (cell: ICell) => void) => {
  const game = useGameContext()

  useEffect(() => {
    if (isDraw(game.board)) return game.setWinner({ win: "none", cells: [] })

    const winner = checkWinner(game.board)
    if (winner.win) game.setWinner(winner)

    if (game.currentPlayer !== "X" && winner.win === null) {
      const infoCell = runMoveBot(game.board, "X")

      if (infoCell) {
        handleCellBotClick?.({
          id: infoCell.cell.id,
          player: infoCell.cell.player
        })
      }
    }
  }, [game.board])
}

export {
  useBoardUseCase
}

