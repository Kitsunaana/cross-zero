import { makeClassname } from "@/shared/utils";
import {ComponentPropsWithoutRef, FC, ReactNode} from "react";

interface ITextAccentProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
	text: ReactNode;
}

const TextAccent: FC<ITextAccentProps> = ({className, text, ...props}) => (
	<span {...props} className={makeClassname("bg-accent font-semibold px-1 rounded-md", className)}>
		{text}
	</span>
)

export {
	TextAccent
};