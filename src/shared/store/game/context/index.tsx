import { IGameContext } from "@/shared/store";
import { create2DArray } from "@/shared/utils";
import { createContext, useContext } from 'react';

const GAME_SIZE = 11
const NUMBER_TO_WIN = 5

const DEFAULT_VALUES: IGameContext = {
  board: create2DArray(GAME_SIZE),
  setBoard: () => {},
  currentPlayer: 'X',
  setCurrentPlayer: () => {},
  setWinner: () => {},
  restart: () => {},
  counterStep: 0,
  setCounterStep: () => {},
  winner: {
    win: null,
    cells: [],
  },
}

const GameContext = createContext<IGameContext>(DEFAULT_VALUES)

const useGameContext = (): IGameContext => useContext(GameContext)

export {
  DEFAULT_VALUES, GAME_SIZE, GameContext, NUMBER_TO_WIN, useGameContext
};

