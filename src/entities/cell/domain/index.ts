import { IBoard, ICell, IInfoCell, IPlayer } from "@/shared/interfaces";


// ---------------------------------------------------------------------------
// --------- [ utils ] -------------------------------------------------------
const getPosition = (position: string) => {
  const [row, column] = position.split("-")

  return {
    row: parseInt(row),
    column: parseInt(column),
  }
}

const findCellById = (cells: IInfoCell[], id: string) => (
  cells.find((info) => info.cell.id === id)
)



// ---------------------------------------------------------------------------
// --------- [ solution ] ----------------------------------------------------
const insertCellInBoard = (board: IBoard, cell: ICell, player: IPlayer) => {
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

export {
  findCellById,
  insertCellInBoard
};
