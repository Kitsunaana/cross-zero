import { IBoard, ICell, IInfoCell, IPlayer } from "@/shared/interfaces";
import { NUMBER_TO_WIN } from "@/shared/store";

// ---------------------------------------------------------------------------
// --------- [ const ] -------------------------------------------------------
export const PLAYERS: IPlayer[] = ["X", "O"]

const getWinCombinations = (players: IPlayer[]) => players.map((player) => player.repeat(NUMBER_TO_WIN))

const winCombinations = getWinCombinations(PLAYERS)



// ---------------------------------------------------------------------------
// --------- [ core ] --------------------------------------------------------
export const getAllEnemy = (player: IPlayer) => PLAYERS.filter((variant) => variant !== player)

export const getAvailableCells = (board: IBoard) => {
  return board.reduce((result, row) => {
    row.forEach((cell) => (cell.player === null) && result.push(cell))

    return result
  }, [] as ICell[])
}

export const getDiagonal = (
  board: IBoard,
  row: number,
  column: number,
  order: -1 | 1
): IInfoCell[] => (
  board
    .map((_, index) => ({
      row: row + index,
      column: column + index * order,
      cell: board[row + index]?.[column + index * order],
    }))
    .filter((position): position is IInfoCell => position.cell !== undefined)
)

export const getVertical = (board: IBoard, column: number): IInfoCell[] => (
  board.map((row, index) => ({
    row: index,
    column,
    cell: row[column]
  }))
)

export const getHorizontal = (board: IBoard, row: number): IInfoCell[] => (
  board[row].map((column, index) => ({
    row,
    column: index,
    cell: column
  }))
)



// ---------------------------------------------------------------------------
// --------- [ solution ] ----------------------------------------------------
export const isDraw = (board: IBoard) => getAvailableCells(board).empty()

export const checkCandidateWinner = (cells: IInfoCell[]) => {
  if (cells.length < NUMBER_TO_WIN) return null

  for (let i = 0; i < cells.length; i++) {
    const candidate = cells.slice(i, NUMBER_TO_WIN + i)
    if (candidate.length < NUMBER_TO_WIN) continue

    const stringifyCandidate = candidate
      .map(info => info.cell.player)
      .join("")

    if (winCombinations.includes(stringifyCandidate)) {
      return {
        win: cells[i].cell.player,
        cells: candidate,
      }
    }
  }

  return null
}

export const checkWinner = (board: IBoard) => {
  for (let row = 0; row < board.length; row++) {

    const isHorizontal = checkCandidateWinner(getHorizontal(board, row))
    if (isHorizontal && isHorizontal.win) return isHorizontal

    const isVertical = checkCandidateWinner(getVertical(board, row))
    if (isVertical && isVertical.win) return isVertical

    for (let column = 0; column < board[row].length; column++) {

      const isDiagonalLTR = checkCandidateWinner(getDiagonal(board, row, column, 1))
      if (isDiagonalLTR && isDiagonalLTR.win) return isDiagonalLTR

      const isDiagonalRTL = checkCandidateWinner(getDiagonal(board, row, column, -1))
      if (isDiagonalRTL && isDiagonalRTL.win) return isDiagonalRTL
    }
  }

  return {
    win: null,
    cells: [],
  }
}
