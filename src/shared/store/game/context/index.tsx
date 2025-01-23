import { createContext, useContext } from 'react'
import {IGameContext} from "@/shared/store";
import {create2DArray} from "@/shared/utils";

const DEFAULT_VALUES: IGameContext = {
  board: create2DArray(4),
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
