import clsx from "clsx";
import { FC } from "react";

interface IKeyboardProps {
  content: string;
  className?: string;
}
const Keyboard: FC<IKeyboardProps> = ({ content, className }) => {
  return (
    <kbd
      className={clsx([
        "pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100",
        className,
      ])}
    >
      <span className="text-xs">{content}</span>
    </kbd>
  );
};

export default Keyboard;
