import BoardWidget from "@/widget/board";
import TaskDescription from "@/widget/task";
import styles from './styles.module.scss';
import { BannerWin } from "./ui/banner-win";
import { CounterStep } from "./ui/counter-step";

const MainPage = () => {
	return (
		<main className={styles.page}>
			<BannerWin />
			<BoardWidget/>
			<CounterStep />

			{/* Описание задания */}
			<TaskDescription/>
		</main>
	);
};

export default MainPage;
