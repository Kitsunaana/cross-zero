interface ICell {
	id: string
	player: IWinner
}

type IPlayer = 'X' | 'O'
type IWinner = IPlayer | null
type IBoard = Array<ICell[]>

export type {
	ICell,
	IPlayer,
	IWinner,
	IBoard
}
