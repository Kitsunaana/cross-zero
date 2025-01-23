import {IBoard, ICell} from "@/shared/interfaces";

const numberToWin = 3
const players = ["X", "O"]

const getWinCombinations = () => players.map(player => player.repeat(numberToWin))

const winCombinations = getWinCombinations()

type IInfoCell = {
  row: number
  column: number
  cell: ICell
}

const getDiagonal = (
  board: IBoard,
  row: number,
  column: number,
  order: -1 | 1
): IInfoCell[] => (
  board
    .map((_, index) => ({
      row: row + index,
      column: column + index * order,
      cell: board[row + index]?.[ column + index * order ],
    }))
    .filter((position): position is IInfoCell => position.cell !== undefined)
)

const getVertical = (board: IBoard, column: number): IInfoCell[] => (
  board.map((row, index) => ({
    row: index,
    column,
    cell: row[column]
  }))
)


const getHorizontal = (board: IBoard, row: number): IInfoCell[] => (
  board[row].map((column, index) => ({
    row,
    column: index,
    cell: column
  }))
)

type ICheckWinnerResult = null | {
  win: ICell
  cells: IInfoCell[]
}

const checkCandidateWinner = (cells: IInfoCell[]) => (
  new Promise((resolve) => {
    if (cells.length < numberToWin) return

    cells.forEach((info, index, array) => {
      const candidate = array.slice(index, numberToWin + index)
      if (candidate.length < numberToWin) return

      const stringifyCandidate = candidate
        .map(info => info.cell.player)
        .join("")

      if (winCombinations.includes(stringifyCandidate)) {
        resolve({
          win: info.cell,
          cells: candidate,
        })
      }
    })
  })
)

type IIterateAcrossBoardCallbacks = {
  rowIterate: Array<(row: number) => Promise<ICheckWinnerResult>>
  columnIterate: Array<(row: number, column: number) => Promise<ICheckWinnerResult>>
}

const iterateAcrossBoard = (board: IBoard, callbacks: IIterateAcrossBoardCallbacks) => (
  new Promise<ICheckWinnerResult>((resolve) => {
    board.forEach((row, rowIndex) => {
      callbacks.rowIterate.forEach((callback) => (
        callback(rowIndex).then(resolve)
      ))

      row.forEach((column, columnIndex) => (
        callbacks.columnIterate.forEach((callback) => (
          callback(rowIndex, columnIndex).then(resolve)
        ))
      ))
    })
  })
)

export const checkWinner = (board: IBoard) => (
  iterateAcrossBoard(board, {
    rowIterate: [
      // horizontal
      (row) => checkCandidateWinner(getHorizontal(board, row)),
    ],
    columnIterate: [
      // vertical
      (row, column) => checkCandidateWinner(getVertical(board, column)),
      // diagonal from left to right
      (row, column) => checkCandidateWinner(getDiagonal(board, row, column, 1)),
      // diagonal from right to left
      (row, column) => checkCandidateWinner(getDiagonal(board, row, column, -1)),
    ]
  })
)
