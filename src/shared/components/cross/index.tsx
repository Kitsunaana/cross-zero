import styles from "./styles.module.scss"

export const Cross = () => {
	return (
		<svg width="50" height="50">
			<line x1="5" y1="5" x2="45" y2="45" className={styles.cross} />
			<line x1="45" y1="5" x2="5" y2="45" className={styles.cross} />
		</svg>
	)
}
