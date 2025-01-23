import { createContext, useContext } from 'react'
import {IGameContext} from "@/shared/store";

const createBoard = (size) => {
  return Array
    .from({ length: size }, (_, i) => i)
    .map((row) => Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      player: null
    })))
}

const DEFAULT_VALUES: IGameContext = {
  board: createBoard(3),
  setBoard: () => {},
  currentPlayer: 'X',
  setCurrentPlayer: () => {},
  winner: null,
  setWinner: () => {}
}

const GameContext = createContext<IGameContext>(DEFAULT_VALUES)

const useGameContext = (): IGameContext => useContext(GameContext)

export {
  DEFAULT_VALUES,
  GameContext,
  useGameContext
}
