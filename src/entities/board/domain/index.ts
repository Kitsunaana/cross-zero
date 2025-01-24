import {IBoard, IInfoCell, IPlayer} from "@/shared/interfaces";

const numberToWin = 5
const players = ["X", "O"]

const getWinCombinations = () => players.map(player => player.repeat(numberToWin))

const winCombinations = getWinCombinations()

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
  win: IPlayer
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
          win: info.cell.player,
          cells: candidate,
        })
      }
    })
  })
)

type IIterateAcrossBoardCallbacks<T> = {
  rowIterate: Array<(row: number) => Promise<T>>
  columnIterate: Array<(row: number, column: number) => Promise<T>>
}

const iterateAcrossBoard = <T>(board: IBoard, callbacks: IIterateAcrossBoardCallbacks<T>) => (
  new Promise<T>((resolve) => {
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

const isNoEnemyInCells = (cells: IInfoCell[], bot: IPlayer) => (
  cells.every(info => info.cell.player === bot || info.cell.player === null)
)

const getCandidateWinCells = (cells: IInfoCell[], bot: IPlayer): Array<IInfoCell[]> => {
  if (cells.length < numberToWin) return []

  return cells.reduce((result, cell, index, array) => {
    const candidateToWin = array.slice(index, index + numberToWin)

    if (isNoEnemyInCells(candidateToWin, bot) && candidateToWin.length === numberToWin) {
      result.push(candidateToWin)
    }

    return result
  }, [])
}

const getCountOccupiedCells = (cells: IInfoCell[], player: IPlayer) => (
  cells.reduce((result, info) => {
    if (info.cell.player === player) result += 1
    return result
  }, 0)
)

const getSortCellsVariants = (variants: Array<IInfoCell[]>, player: IPlayer) => (
  variants.sort((a, b) => (
    getCountOccupiedCells(a, player) < getCountOccupiedCells(b, player)
      ? 1
      : -1
  ))
)

const getFreeCells = (cells: IInfoCell[]) => (
  cells.filter(info => info.cell.player === null)
)

const randomIndex = (to: number) => Math.floor(Math.random() * to)

export const runMoveBot = (board: IBoard, bot: IPlayer) => {
  const variants: Record<string, Array<IInfoCell[]>> = {
    vertical: [],
    horizontal: [],
    diagonalFromLeftToRight: [],
    diagonalFromRightToLeft: [],
  }

  iterateAcrossBoard(board, {
    rowIterate: [
      (row) => new Promise(() => {
        variants.horizontal.push(...getCandidateWinCells(
          getHorizontal(board, row), bot
        ))

        variants.vertical.push(...getCandidateWinCells(
          getVertical(board, row), bot
        ))
      })
    ],
    columnIterate: [
      (row, column) => new Promise(() => {
        variants.diagonalFromLeftToRight.push(...getCandidateWinCells(
          getDiagonal(board, row, column, 1), bot
        ))

        variants.diagonalFromRightToLeft.push(...getCandidateWinCells(
          getDiagonal(board, row, column, -1), bot
        ))
      })
    ],
  })

  const mergeVariants = [
    ...variants.diagonalFromRightToLeft,
    ...variants.diagonalFromLeftToRight,
    ...variants.vertical,
    ...variants.horizontal,
  ]

  const firstCombinationOfOption = getSortCellsVariants(mergeVariants, bot)[0]
  const freeCellsOfFirstCombination = getFreeCells(firstCombinationOfOption)

  console.log(
    freeCellsOfFirstCombination[randomIndex(freeCellsOfFirstCombination.length)]
  )
}

export const checkWinner = (board: IBoard) => {
  runMoveBot(board, "X")

  return (
    iterateAcrossBoard<ICheckWinnerResult>(board, {
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
}
