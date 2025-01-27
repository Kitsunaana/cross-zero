import type { IBoard, IPlayer, IWinnerInfo } from "@/shared/interfaces"
import { FC, type PropsWithChildren, useState } from 'react'
import { DEFAULT_VALUES, GameContext } from '../context'

const GameProvider: FC<PropsWithChildren> = ({ children }) => {
	const {
		board: defaultBoard,
		currentPlayer: defaultCurrentPlayer,
		winner: defaultWinner
	} = DEFAULT_VALUES

	const [board, setBoard] = useState<IBoard>(defaultBoard);
	const [currentPlayer, setCurrentPlayer] = useState<IPlayer>(defaultCurrentPlayer);
	const [winner, setWinner] = useState<IWinnerInfo>(defaultWinner);
  const [counterStep, setCounterStep] = useState(0)

	const restart = () => {
		setBoard(defaultBoard)
		setCurrentPlayer(defaultCurrentPlayer)
		setWinner(defaultWinner)
		setCounterStep(0)
	}

	const context = {
		board,
    setBoard,
		currentPlayer,
    setCurrentPlayer,
		winner,
    setWinner,
    counterStep,
    setCounterStep,
		restart
	}

	return (
		<GameContext.Provider value={context}>
			{children}
		</GameContext.Provider>
	)
}

export { GameProvider }
