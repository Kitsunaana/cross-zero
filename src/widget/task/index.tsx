import Sidebar from "@/feature/sidebar/base";
import styles from "@/pages/main/styles.module.scss";
import {TextAccent} from "@/shared/components/text-accent";

const TaskDescription = () => (
	<Sidebar className={styles.sidebarBtn} btnText="Задание" title="Реализация логики игры «Крестики нолики»">
		<div className="mt-2 flex flex-col gap-3">
			<hr/>

			<article>
				<h2 className="text-xl font-semibold">Цель:</h2>
				<p>
					Вам необходимо реализовать логику игры "Крестики-нолики",
					используя предоставленный каркас приложения.
					Основная логика игры должна быть реализована в <b>entities</b>.
				</p>
			</article>

			<article>
				<h2 className="text-xl font-semibold">Описание:</h2>
				<ul className="pl-5 list-decimal flex flex-col gap-3">
					<li>Логика нажатия на ячейку:
						<ul className="list-disc pl-5">
							<li>Расположена в файле <TextAccent text="useCellUseCase"/>.</li>
							<li>В методе <TextAccent text="handleCellClick"/> реализуйте:</li>

							<ul className="list-disc pl-5">
								<li>Проверку, занята ли ячейка.</li>
								<li>Учет текущего игрока (<TextAccent text="X"/> или <TextAccent text="O"/>).</li>
								<li>Обновление состояния игровой доски (<TextAccent text="board"/>) после хода.</li>
								<li>Смена игрока после каждого хода.</li>
								<li>Вывод сообщений, если ячейка уже занята или есть победитель.</li>
							</ul>
						</ul>
					</li>

					<li>Проверка победителя:
						<ul className="list-disc pl-5">
							<li>Расположена в файле <TextAccent text="useBoardUseCase"/>.</li>
							<li>Реализуйте функцию <TextAccent text="checkWinner"/>, которая:</li>

							<ul className="list-disc pl-5">
								<li>Проверяет горизонтальные, вертикальные и диагональные линии на наличие одинаковых символов.</li>
								<li>Если есть победитель, обновляет соответствующее состояние через <TextAccent text="setWinner"/>.
								</li>
							</ul>
						</ul>
					</li>

				</ul>
			</article>

			<hr/>

			<article>
				<h2 className="text-xl font-semibold">Место для реализации логики:</h2>
				<ul className="list-disc pl-5">
					<li>Основная работа ведется в папке <TextAccent text="entities"/>:</li>

					<ul className="list-disc pl-5">
						<li><TextAccent text="useCellUseCase"/>: Реализация логики обработки кликов по ячейкам.</li>
						<li><TextAccent text="useBoardUseCase"/>: Реализация проверки победителя после каждого хода.</li>
					</ul>
				</ul>
			</article>

			<hr/>

			<article>
				<h2 className="text-xl font-semibold">На что обратить внимание:</h2>
				<ul className="pl-5 list-decimal flex flex-col gap-3">
					<li>Проверка состояния ячейки:
						<ul className="list-disc pl-5">
							<li>Убедитесь, что ячейка не занята перед обновлением.
								Если занята, выводите сообщение в консоль и завершайте выполнение функции.
							</li>
						</ul>
					</li>

					<li>Проверка победителя:
						<ul className="list-disc pl-5">
							<li>Обратите внимание на все возможные комбинации для победы:</li>

							<ul className="list-disc pl-5">
								<li>Горизонтали.</li>
								<li>Вертикали.</li>
								<li>Диагонали.</li>
							</ul>
						</ul>
					</li>

					<li>Обработка завершения игры:
						<ul className="list-disc pl-5">
							<li>Если есть победитель, запретите дальнейшие ходы.</li>
							<li>Выводите сообщение о победителе в консоль или на экран.</li>
						</ul>
					</li>
				</ul>
			</article>

			<hr/>

			<article>
				<h2 className="text-xl font-semibold">Дополнительные задания:</h2>
				<ul className="pl-5 list-decimal flex flex-col gap-3">
					<li>Счетчик ходов:
						<ul className="list-disc pl-5">
							<li>Добавьте компонент на странице, который отслеживает количество сделанных ходов.</li>
							<li>Счетчик должен увеличиваться после каждого хода.</li>
						</ul>
					</li>

					<li>Обработка ничьей:
						<ul className="list-disc pl-5">
							<li>Если все ячейки заполнены и победителя нет, выводите сообщение о ничьей.</li>
						</ul>
					</li>

					<li>Перезапуск игры:
						<ul className="list-disc pl-5">
							<li>Реализуйте кнопку <TextAccent text="Новая игра"/>, которая сбрасывает игру:</li>
							<ul className="list-disc pl-5">
								<li>Очищает доску.</li>
								<li>Сбрасывает победителя и счетчик ходов.</li>
							</ul>
						</ul>
					</li>
				</ul>
			</article>
		</div>
	</Sidebar>
)

export default TaskDescription;