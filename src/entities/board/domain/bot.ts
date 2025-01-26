import {IBoard, IInfoCell, IPlayer} from "@/shared/interfaces";
import {
  NUMBER_TO_WIN,
  getDiagonal,
  getHorizontal,
  getVertical,
} from "./index.ts"

// ---------------------------------------------------------------------------
// --------- [ types ] -------------------------------------------------------
type ICombinationsToWin = {
  vertical: Array<IInfoCell[]>
  horizontal: Array<IInfoCell[]>
  diagonalFromLeftToRight: Array<IInfoCell[]>
  diagonalFromRightToLeft: Array<IInfoCell[]>
}

type IIterateAcrossBoardParams<T> = {
  board: IBoard
  rowIterate: Array<(row: number) => Promise<T>>
  columnIterate: Array<(row: number, column: number) => Promise<T>>
}


// ---------------------------------------------------------------------------
// --------- [ const ] -------------------------------------------------------
const getBaseCombinationsToWin = (): ICombinationsToWin => ({
  vertical: [],
  horizontal: [],
  diagonalFromLeftToRight: [],
  diagonalFromRightToLeft: [],
})



// ---------------------------------------------------------------------------
// --------- [ utils ] -------------------------------------------------------
const combiningProperties = (record: Record<number, IInfoCell[][]>) => (
  Object
    .values(record)
    .reduce((result, value) => result.concat(value), [])
)

const isNoEnemyInCells = (cells: IInfoCell[], bot: IPlayer) => (
  cells.every((info) => info.cell.player === bot || info.cell.player === null)
)

const getFreeCells = (cells: IInfoCell[]) => (
  cells.filter((info) => info.cell.player === null)
)

const getCountOccupiedCells = (cells: IInfoCell[], player: IPlayer) => (
  cells.reduce((result, info) => {
    if (info.cell.player === player) result += 1
    return result
  }, 0)
)

const iterateAcrossBoard = <T>(params: IIterateAcrossBoardParams<T>) => (
  new Promise<T>((resolve) => {
    params.board.forEach((row, rowIndex) => {
      params.rowIterate.forEach((callback) => (
        callback(rowIndex).then(resolve)
      ))

      row.forEach((column, columnIndex) => (
        params.columnIterate.forEach((callback) => (
          callback(rowIndex, columnIndex).then(resolve)
        ))
      ))
    })
  })
)



// ---------------------------------------------------------------------------
// --------- [ core ] -------------------------------------------------------
const getBaseGroupCombinations = () => {
  return Array
    .from({ length: NUMBER_TO_WIN - 1 }, (_, i) => i + 1)
    .reduce((result, num) => {
      result[num] = []
      return result
    }, {} as Record<number, IInfoCell[]>)
}

const getUniqueCells = (cells: IInfoCell[], result: IInfoCell[] = []): IInfoCell[] => {
  return cells.empty()
    ? result
    : (
      getUniqueCells(
        cells.slice(1, cells.length),
        result.concat(
          result.some(info => info.cell.id === cells[0].cell.id) ? [] : cells[0]
        )
      )
    )
}

const cleanCellsCombinations = <T extends Record<number, IInfoCell[]>>(record: T): T => (
  Object
    .entries(record)
    .reduce((result, [key, value]) => {
      result[key] = getUniqueCells(value)
      return result
    }, {} as T)
)

const getCandidateWinCells = (cells: IInfoCell[], bot: IPlayer): Array<IInfoCell[]> => {
  if (cells.length < NUMBER_TO_WIN) return []

  return cells.reduce((result, cell, index, array) => {
    const candidateToWin = array.slice(index, index + NUMBER_TO_WIN)

    if (candidateToWin.length === NUMBER_TO_WIN && isNoEnemyInCells(candidateToWin, bot)) {
      result.push(candidateToWin)
    }

    return result
  }, [])
}

const unionCombinations = (first: IInfoCell[], second: IInfoCell[]) => {
  const greatestLengthCells = first.length > second.length ? first : second
  const shortestLengthCells =  first.length > second.length ? second : first

  return shortestLengthCells.reduce<IInfoCell[]>((result, info) => {
    const isExist = greatestLengthCells.some(({ cell }) => cell.id === info.cell.id)

    if (isExist) return result.concat([ info ])

    return result
  }, [])
}

const groupingByNumberOfMatches = (combinationsCells: IInfoCell[][], player: IPlayer) => (
  combinationsCells.reduce((result, combination) => {
    const count = getCountOccupiedCells(combination, player)
    const different = NUMBER_TO_WIN - count

    const freeCells = getFreeCells(combination).reverse()

    result[different] = result[different]
      ? result[different].concat(freeCells)
      : freeCells

    return result
  }, getBaseGroupCombinations())
)



// ---------------------------------------------------------------------------
// --------- [ solution ] ----------------------------------------------------
const getBestMoveCell = (board: IBoard, player: IPlayer) => {
  const variants = getBaseCombinationsToWin()

  iterateAcrossBoard({
    board,
    rowIterate: [
      (row) => new Promise(() => {
        variants.horizontal.push(...getCandidateWinCells(
          getHorizontal(board, row), player
        ))

        variants.vertical.push(...getCandidateWinCells(
          getVertical(board, row), player
        ))
      }),
    ],
    columnIterate: [
      (row, column) => new Promise(() => {
        variants.diagonalFromLeftToRight.push(...getCandidateWinCells(
          getDiagonal(board, row, column, 1), player
        ))

        variants.diagonalFromRightToLeft.push(...getCandidateWinCells(
          getDiagonal(board, row, column, -1), player
        ))
      }),
    ],
  })

  return groupingByNumberOfMatches(combiningProperties(variants), player)
}

export const runMoveBot = (board: IBoard, bot: IPlayer) => {
  const bestMovesOpponent = cleanCellsCombinations(getBestMoveCell(board, "O"))
  const bestMovesBot = cleanCellsCombinations(getBestMoveCell(board, bot))

  const uniqueMoveCellsBot = getUniqueCells([
    ...(bestMovesBot["4"] ?? []),
    ...(bestMovesBot["3"] ?? []),
    ...(bestMovesBot["2"] ?? []),
    ...(bestMovesBot["1"] ?? []),
  ])

  if (bestMovesBot["1"].length) return bestMovesBot["1"][0]
  if (bestMovesOpponent["1"].length) return bestMovesOpponent["1"][0]

  const sortedWeights = Object
    .keys(bestMovesOpponent)
    .map(Number)
    .sort((a, b) => a > b ? 1 : -1)

  const findIndex = sortedWeights.findIndex((key) => bestMovesOpponent[key].length)
  const weight = sortedWeights[findIndex]

  if (!weight) return null

  const merge = unionCombinations(bestMovesOpponent[weight], uniqueMoveCellsBot)

  return (
    merge[0] ??
    bestMovesOpponent[weight]?.[0] ??
    uniqueMoveCellsBot[sortedWeights.length - 1]?.[0]
  )
}
