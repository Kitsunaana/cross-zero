const board = [
  ["x", "x", "x", "z", "x", "x"],
  ["x", "x", "o", "x", "x", "o"],
  ["o", "o", "o", "x", "o", "o"],
  ["x", "o", "x", "o", "o", "x"],
  ["o", "x", "x", "o", "o", "x"],
  ["x", "o", "x", "o", "o", "x"],
]

console.log(board)

const getDiagonal = (row, column, order) => (
  board
    .map((_, index) => ({
      row: row + index,
      column: column + index * order,
      cell: board[row + index]?.[ column + index * order ],
    }))
    .filter(position => position.cell !== undefined)
)

const getVertical = (column) => {
  return board.map((row, index) => ({
    row: index,
    column,
    cell: row[column]
  }))
}

const getHorizontal = (row) => {
  return board[row].map((column, index) => ({
    row,
    column: index,
    cell: column
  }))
}

const numberToWin = 5
const players = ["x", "o"]

const getWinCombinations = () => players.map(player => player.repeat(numberToWin))
const winCombinations = getWinCombinations()

const checkCandidateWinner = (cells) => {
  return cells.reduce((result, info, index, array) => {
    const candidate = array.slice(0 + index, numberToWin + index)

    if (candidate.length < numberToWin) return result

    const stringifyCandidate = candidate
      .map(info => info.cell)
      .join("")

    if (winCombinations.includes(stringifyCandidate)) {
      return {
        win: info.cell,
        cells: candidate,
      }
    }

    return result
  }, {
    win: null,
    cells: [],
  })
}

const checkWinner = (board) => {
  let result

  for (let row = 0; row < board.length; row++) {
    const horizontal = getHorizontal(row)
    if (horizontal.length >= numberToWin) {
      const isWin = checkCandidateWinner(horizontal)
      if (isWin.win !== null) {
        result = isWin
        break
      }
    }

    for (let column = 0; column < board[row].length; column++) {
      const vertical = getVertical(column)
      if (vertical.length >= numberToWin) {
        const isWin = checkCandidateWinner(vertical)
        if (isWin.win !== null) {
          result = isWin
          break
        }
      }

      const diagonalFromLeftToRight = getDiagonal(row, column, 1)
      if (diagonalFromLeftToRight.length >= numberToWin) {
        const isWin = checkCandidateWinner(diagonalFromLeftToRight)
        if (isWin.win !== null) {
          result = isWin
          break
        }
      }

      const diagonalFromRightToLeft = getDiagonal(row, board[row].length - 1, -1)
      if (diagonalFromRightToLeft.length >= numberToWin) {
        const isWin = checkCandidateWinner(diagonalFromRightToLeft)
        if (isWin.win !== null) {
          result = isWin
          break
        }
      }
    }
  }

  return result
}

console.log(
  checkWinner(board)
)

const createBoard = (size) => {
  return Array
    .from({ length: size }, (_, i) => i)
    .map((row) => Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      player: null
    })))
}

console.log(
  createBoard(3)
)
