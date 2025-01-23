import styles from "./styles.module.scss"

export const Circle = () => {
	return (
		<svg width="50" height="50">
			<circle cx="25" cy="25" r="20" className={styles.circle} />
		</svg>
	)
}
