import { useGameContext } from "@/shared/store";
import { makeClassname } from "@/shared/utils";
import { Circle, Cross } from "@/widget/board";
import styles from "./styles.module.scss";

export const BannerWin = () => {
	const game = useGameContext()

  return (
    <div
      className={makeClassname(
        styles.bannerWin,
        game.winner.win ? styles.bannerShow : styles.bannerHide
      )}
    >
      {game.winner.win === "X" && <Cross />}
      {game.winner.win === "O" && <Circle />}
      {game.winner.win === "none" && (
        <div className="flex gap-2">
          <Cross />
          <Circle />
        </div>
      )}

      <h1 className={styles.caption}>
        {game.winner.win === "none"
          ? "Ничья"
          : "Победитель!"
        }
      </h1>

      <button
        className={styles.button}
        onClick={game.restart}
      >
        Играть снова
      </button>
    </div>
  )
}
