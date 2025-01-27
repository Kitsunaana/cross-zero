type IPlayer = 'X' | 'O'
type IWinner = IPlayer | null | "none"

interface ICell {
  id: string
  player: IWinner
}

interface IInfoCell {
  row: number
  column: number
  cell: ICell
}

interface IWinnerInfo {
  win: IWinner,
  cells: Array<IInfoCell>
}

type IBoard = Array<ICell[]>

export type {
  IBoard, ICell, IInfoCell, IPlayer,
  IWinner, IWinnerInfo
}

