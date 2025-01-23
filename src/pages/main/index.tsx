import {ReactNode} from "react";
import BoardWidget from "@/widget/board";
import styles from './styles.module.scss'
import {useGameContext} from "@/shared/store";
import TaskDescription from "@/widget/task";
import {create2DArray} from "@/shared/utils";

export const useStartGame = () => {
	const game = useGameContext()

	return () => {
		game.setBoard(create2DArray(4))
		game.setCurrentPlayer("X")
		game.setWinner(null)
	}
}

const MainPage = (): ReactNode => {
	const {winner} = useGameContext()
	const startGame = useStartGame()

	return (
		<main className={styles.page}>
			{!!winner && <h1 className="text-4xl">Игрок {winner} победил!</h1>}

			<BoardWidget/>

			{/* Описание задания */}
			<TaskDescription/>

			<button onClick={startGame}>Играть снова</button>
		</main>
	);
};

export default MainPage;
