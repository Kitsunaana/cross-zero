import {ReactNode} from "react";
import BoardWidget from "@/widget/board";
import styles from './styles.module.scss'
import {useGameContext} from "@/shared/store";
import TaskDescription from "@/widget/task";

const MainPage = (): ReactNode => {
	const {winner} = useGameContext()

	return (
		<main className={styles.page}>
			{!!winner && <h1 className="text-4xl">Игрок {winner} победил!</h1>}

			<BoardWidget />

			{/* Описание задания */}
			<TaskDescription />
		</main>
	);
};

export default MainPage;