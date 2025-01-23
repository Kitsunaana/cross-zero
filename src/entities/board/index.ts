import { useGameContext } from "@/shared/store";
import { useEffect } from "react";
import { checkWinner } from "./domain"

export const useBoardUseCase = () => {
	const { board, setWinner } = useGameContext()

	useEffect(() => {
		checkWinner(board)
			.then((value) => setWinner(value!.win.player))
	}, [board]);
}
