/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

interface IMyButtonProps {
  content: any;
  desc: string;
  onClick: () => void;
}
const MyButton: FC<IMyButtonProps> = ({ content, desc, onClick }) => {
  return (
    <TooltipProvider delayDuration={20}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className="w-[40px] h-[40px] rounded-full bg-yellow-50 flex items-center justify-center"
          >
            {content}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{desc}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default MyButton;
