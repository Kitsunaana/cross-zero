import {IBoard, ICell, IInfoCell, IPlayer} from "@/shared/interfaces";
import {getPosition} from "@/entities/cell/domain";

const numberToWin = 5
const players: IPlayer[] = ["X", "O"]

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

/*const getSortCellsVariants = (variants: Array<IInfoCell[]>, player: IPlayer) => (
  variants.sort((a, b) => (
    getCountOccupiedCells(a, player) < getCountOccupiedCells(b, player)
      ? 1
      : -1
  ))
)*/

const getFreeCells = (cells: IInfoCell[]) => (
  cells.filter(info => info.cell.player === null)
)

const randomIndex = (to: number) => Math.floor(Math.random() * to)

const getAllOpponents = (player: IPlayer) => players.filter(p => p !== player)

const isEmptyArray = <T>(array: T[]) => array.length === 0

const getUniqueCells = (cells: IInfoCell[], result: IInfoCell[] = []): IInfoCell[] => {
  return isEmptyArray(cells)
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

type ICombinationsToWin = {
  vertical: Array<IInfoCell[]>
  horizontal: Array<IInfoCell[]>
  diagonalFromLeftToRight: Array<IInfoCell[]>
  diagonalFromRightToLeft: Array<IInfoCell[]>
}

const getBaseCombinationsToWin = (): ICombinationsToWin => ({
  vertical: [],
  horizontal: [],
  diagonalFromLeftToRight: [],
  diagonalFromRightToLeft: [],
})

const getBaseGroupCombinations = () => {
  return Array
    .from({ length: numberToWin - 1 }, (_, i) => i + 1)
    .reduce((result, num) => {
      result[num] = []
      return result
    }, {} as Record<number, IInfoCell[]>)
}

const groupingByNumberOfMatches = (combinationsCells: IInfoCell[][], player: IPlayer) => (
  combinationsCells.reduce((result, combination) => {
    const count = getCountOccupiedCells(combination, player)
    const different = numberToWin - count

    const freeCells = getFreeCells(combination).reverse()

    result[different] = result[different]
      ? result[different].concat(freeCells)
      : freeCells

    return result
  }, getBaseGroupCombinations())
)

const combiningProperties = <T extends Record<string, unknown>>(record: T) => (
  Object
    .values(record)
    .reduce((result, value) => {
      // console.log(getUniqueCells(value.flat()))
      return result.concat(value as any)
    }, [])
)

type GetBestMoveCellReturn = {
  weight: number,
  value: IInfoCell
}


/*const getBestMoveCell = (board: IBoard, player: IPlayer): GetBestMoveCellReturn => {
  const variants = getBaseCombinationsToWin()

  iterateAcrossBoard(board, {
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

  const combinationsForPlayerToWin = groupingByNumberOfMatches(
    combiningProperties(variants) as IInfoCell[][],
    player,
  )

  return Object
    .entries(combinationsForPlayerToWin)
    .reduce((result, [key, value]) => {
      if (value.length === 0) return

      if (result?.weight === undefined && value.length !== 0) {
        return {
          weight: Number(key),
          value: value[0],
        }
      }

      if (key > result?.weight) return result

      return {
        weight: Number(key),
        value: value[0]
      }
    }, {} as GetBestMoveCellReturn)
}*/

const getBestMoveCell = (board: IBoard, player: IPlayer): GetBestMoveCellReturn => {
  const allOpponents = getAllOpponents(player)

  const variants = {
    [player]: getBaseCombinationsToWin(),

    ...(allOpponents.reduce((result, opponent) => {
      result[opponent] = getBaseCombinationsToWin()
      return result
    }, {} as Record<IPlayer, ICombinationsToWin>))
  }

  iterateAcrossBoard(board, {
    rowIterate: [
      (row) => new Promise(() => {
        variants[player].horizontal.push(...getCandidateWinCells(
          getHorizontal(board, row), player
        ))

        variants[player].vertical.push(...getCandidateWinCells(
          getVertical(board, row), player
        ))
      }),

      (row) => new Promise(() => {
        allOpponents.forEach(opponent => {
          variants[opponent].horizontal.push(...getCandidateWinCells(
            getHorizontal(board, row), opponent
          ))

          variants[opponent].vertical.push(...getCandidateWinCells(
            getVertical(board, row), opponent
          ))
        })
      })
    ],
    columnIterate: [
      (row, column) => new Promise(() => {
        variants[player].diagonalFromLeftToRight.push(...getCandidateWinCells(
          getDiagonal(board, row, column, 1), player
        ))

        variants[player].diagonalFromRightToLeft.push(...getCandidateWinCells(
          getDiagonal(board, row, column, -1), player
        ))
      }),

      (row, column) => new Promise(() => {
        allOpponents.forEach(opponent => {
          variants[opponent].diagonalFromLeftToRight.push(...getCandidateWinCells(
            getDiagonal(board, row, column, 1), opponent
          ))

          variants[opponent].diagonalFromRightToLeft.push(...getCandidateWinCells(
            getDiagonal(board, row, column, -1), opponent
          ))
        })
      })
    ],
  })

  const combinationsForPlayerToWin = groupingByNumberOfMatches(
    combiningProperties(variants[player]) as IInfoCell[][],
    player,
  )

  const combinationsForOpponentToWin = groupingByNumberOfMatches(
    combiningProperties(variants[allOpponents[0]]) as IInfoCell[][],
    player,
  )

 /* if (combinationsForPlayerToWin["1"].length) {
    return {
      weight: 1,
      value: combinationsForPlayerToWin["1"][0]
    }
  }

  if (combinationsForOpponentToWin["1"].length) {
    return {
      weight: 1,
      value: combinationsForOpponentToWin["1"][0]
    }
  }

  if (combinationsForOpponentToWin["2"].length) {
    return {
      weight: 2,
      value: combinationsForOpponentToWin["2"][0]
    }
  }

  if (combinationsForOpponentToWin["3"].length) {
    return {
      weight: 3,
      value: combinationsForOpponentToWin["3"][0]
    }
  }*/

  return Object
    .entries(combinationsForPlayerToWin)
    .reduce((result, [key, value]) => {
      if (value.length === 0) return

      if (result?.weight === undefined && value.length !== 0) {
        return {
          weight: Number(key),
          value: value[0],
        }
      }

      if (key > result?.weight) return result

      return {
        weight: Number(key),
        value: value[0]
      }
    }, {} as GetBestMoveCellReturn)
}

const updateBoardCell = (board: IBoard, cell: ICell, player: IPlayer) => {
  const cellPosition = getPosition(cell.id)

  const findRow = board[cellPosition.row]
  const findCell = findRow[cellPosition.column]

  if (findCell.player !== null) return board

  const replacedEmptyCellToPlayer = findRow.replace(cellPosition.column, {
    id: cell.id,
    player
  })

  return board.replace(cellPosition.row, replacedEmptyCellToPlayer)
}

export const runMoveBot = (board: IBoard, bot: IPlayer) => {
  const allFreeCells: IInfoCell[] = []

  const allOpponents = getAllOpponents(bot)

  const variants: Record<IPlayer, ICombinationsToWin> = {
    [bot]: getBaseCombinationsToWin(),

    ...(allOpponents.reduce((result, opponent) => {
      result[opponent] = getBaseCombinationsToWin()
      return result
    }, {} as Record<IPlayer, ICombinationsToWin>))
  }

  iterateAcrossBoard(board, {
    rowIterate: [
      (row) => new Promise(() => {
        variants[bot].horizontal.push(...getCandidateWinCells(
          getHorizontal(board, row), bot
        ))

        variants[bot].vertical.push(...getCandidateWinCells(
          getVertical(board, row), bot
        ))
      }),

      (row) => new Promise(() => {
        allOpponents.forEach(opponent => {
          variants[opponent].horizontal.push(...getCandidateWinCells(
            getHorizontal(board, row), opponent
          ))

          variants[opponent].vertical.push(...getCandidateWinCells(
            getVertical(board, row), opponent
          ))
        })
      })
    ],
    columnIterate: [
      (row, column) => new Promise(() => {
        const cell = board[row][column]

        if (cell.player === null) {
          allFreeCells.push({
            cell,
            row,
            column,
          })
        }
      }),

      (row, column) => new Promise(() => {
        variants[bot].diagonalFromLeftToRight.push(...getCandidateWinCells(
          getDiagonal(board, row, column, 1), bot
        ))

        variants[bot].diagonalFromRightToLeft.push(...getCandidateWinCells(
          getDiagonal(board, row, column, -1), bot
        ))
      }),

      (row, column) => new Promise(() => {
        allOpponents.forEach(opponent => {
          variants[opponent].diagonalFromLeftToRight.push(...getCandidateWinCells(
            getDiagonal(board, row, column, 1), opponent
          ))

          variants[opponent].diagonalFromRightToLeft.push(...getCandidateWinCells(
            getDiagonal(board, row, column, -1), opponent
          ))
        })
      })
    ],
  })

  try {
    const bestMoveOpponent = getBestMoveCell(board, "O")
    const newBoard = updateBoardCell(
      JSON.parse(JSON.stringify(board)),
      bestMoveOpponent.value.cell,
      "O"
    )
    const bestMoveBot = getBestMoveCell(newBoard, bot)

    if (bestMoveBot.weight === 1) return bestMoveBot.value

    if ([1, 2, 3, 4].includes(bestMoveOpponent.weight)) {
      return bestMoveOpponent.value
    }

    // return [bestMoveOpponent.value, bestMoveBot.value][randomIndex(2)]
    /*console.log({
      bestMoveOpponent,
      bestMoveBot
    })*/

    return bestMoveBot.value
  } catch (e) {
    console.log(e)
  }
  /*const combinationsInWhichOpponentWin = [
    ...variants.O.horizontal,
    ...variants.O.vertical,
    ...variants.O.diagonalFromLeftToRight,
    ...variants.O.diagonalFromRightToLeft,
  ]
    .reduce((result, combination) => {
      const count = getCountOccupiedCells(combination, "O")
      const different = numberToWin - count

      const freeCells = getFreeCells(combination).reverse()

      result[different] = result[different]
        ? result[different].concat(freeCells)
        : freeCells

      return result
    }, getBaseGroupCombinations())

  const combinationsForBotToWin = [
    ...variants[bot].horizontal,
    ...variants[bot].vertical,
    ...variants[bot].diagonalFromLeftToRight,
    ...variants[bot].diagonalFromRightToLeft,
  ]

  const test_v2 = combinationsForBotToWin.reduce((result, combination) => {
    const count = getCountOccupiedCells(combination, bot)
    const different = numberToWin - count

    const freeCells = getFreeCells(combination).reverse()

    result[different] = result[different]
      ? result[different].concat(freeCells)
      : freeCells

    return result
  }, getBaseGroupCombinations())

  if (test_v2[1].length) {
    return test_v2[1][0]
  }

  if (combinationsInWhichOpponentWin[1].length) {
    return combinationsInWhichOpponentWin[1][0]
  }

  if (combinationsInWhichOpponentWin[2].length) {
    return combinationsInWhichOpponentWin[2][0]
  }

  if (combinationsInWhichOpponentWin[3].length && test_v2[3].length) {
    return test_v2[3][0]
  }

  if (combinationsInWhichOpponentWin[4].length) {
    return combinationsInWhichOpponentWin[4][0]
  }

  const cellsForProtection = getUniqueCells([
    ...(combinationsInWhichOpponentWin["1"] ?? []),
    ...(combinationsInWhichOpponentWin["2"] ?? []),
    ...(combinationsInWhichOpponentWin["3"] ?? []),
  ])

  const test_v3 = getUniqueCells([
    ...(test_v2["1"] ?? []),
    ...(test_v2["2"] ?? []),
    ...(test_v2["3"] ?? []),
  ])

  const test = test_v3.concat(cellsForProtection)

  if (test.length > 0) return test[0]

  const firstCombinationOfOption = getSortCellsVariants(combinationsForBotToWin, bot)[0]

  if (firstCombinationOfOption === undefined) {
    return allFreeCells[randomIndex(allFreeCells.length)]
  }

  const freeCellsOfFirstCombination = getFreeCells(firstCombinationOfOption)
  const randomIndexCellOfFree = randomIndex(freeCellsOfFirstCombination.length)

  return freeCellsOfFirstCombination[randomIndexCellOfFree]*/
}

export const checkWinner = (board: IBoard) => {
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
