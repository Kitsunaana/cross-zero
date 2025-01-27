import { IBoard, IPlayer, IWinnerInfo } from "@/shared/interfaces";
import { Dispatch, SetStateAction } from "react";

interface IGameContext {
  board: IBoard;
  setBoard: Dispatch<SetStateAction<IBoard>>
  currentPlayer: IPlayer
  setCurrentPlayer: Dispatch<SetStateAction<IPlayer>>
  setWinner: Dispatch<SetStateAction<IWinnerInfo>>
  restart: () => void
  counterStep: number
  setCounterStep: Dispatch<SetStateAction<number>>
  winner: IWinnerInfo
}

export type {
  IGameContext
};
