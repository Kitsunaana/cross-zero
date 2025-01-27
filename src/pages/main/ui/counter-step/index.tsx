import { RestartIcon } from "@/shared/components/restart-icon"
import styles from "./styles.module.scss"
import { useGameContext } from "@/shared/store"

export const CounterStep = () => {
  const game = useGameContext()

  return (
    <div className={styles.counterStep}>
      <span className="text-2xl">Ход: {game.counterStep}</span>

      <button onClick={game.restart}>
        <RestartIcon width={40} height={40} />
      </button>
    </div>
  )
}