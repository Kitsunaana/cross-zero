import { makeClassname } from "@/shared/utils";
import { ComponentPropsWithoutRef, FC } from "react";
import styles from './style.module.scss';

type IButtonProps = ComponentPropsWithoutRef<'button'>

const Button: FC<IButtonProps> = ({className, ...props}) => (
	<button className={makeClassname(styles.button ,className)} {...props}/>
)

export {
  Button
};
