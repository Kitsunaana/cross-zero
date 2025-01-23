import type {HTMLAttributes, ReactNode} from 'react'

import {useEffect, useMemo} from 'react'
import {X as CLoseIcon} from 'lucide-react';
import {useOpenBlock} from "@/shared/hooks";
import {makeClassname} from "@/shared/utils";

import styles from './style.module.scss'
import {Button} from "@/shared/components/button";

const sidebarRootElement = document.getElementById('sidebar')

interface ISidebarProps extends HTMLAttributes<HTMLDivElement> {
	btnText: string
	title?: string
}

const Sidebar = ({children, btnText, className, title, ...props}: ISidebarProps): ReactNode => {
	const element = useMemo(() => document.createElement('div'), [])
	const {isOpen, ref, handleToggle, handleClose} = useOpenBlock<HTMLDivElement>()

	useEffect(() => {
		if (isOpen) {
			sidebarRootElement?.appendChild(element)
			const html = document.querySelector('html')

			if (html) html.style.overflow = 'hidden'

			return () => {
				if (html) html.style.overflow = ''
				sidebarRootElement?.removeChild(element)
			}
		}
		return undefined
	})


	return (
		<div className={className} {...props}>
			<Button onClick={handleToggle}>
				{btnText}
			</Button>

			<div ref={ref} className={makeClassname(styles.sidebarWrapper, isOpen && styles.open)}>
				<div className={styles.sidebar}>
					<div className={styles.header}>
						<h1 className={styles.title}>{title}</h1>

						<button onClick={handleClose} className={styles.closeBtn}>
							<CLoseIcon/>
						</button>
					</div>

					{children}
				</div>
			</div>
		</div>
	)
}

export default Sidebar
