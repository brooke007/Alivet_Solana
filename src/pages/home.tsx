/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from "@solana/wallet-adapter-react";
import { getNFT } from "@/lib/helius";
import { FC, useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IImgItem } from "@/shared/types/img";
import DrawingBoard from "./drawingBoard";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Check,
  Delete,
  Download,
  Eraser,
  MousePointerClick,
  Play,
  Plus,
  RotateCw,
} from "lucide-react";
import Keyboard from "@/components/ui/keyboard";
import MyButton from "@/components/ui/myButton";
// import Keyboard from "@/components/ui/keyboard";

export default function Home() {
  const { publicKey } = useWallet();
  const [page] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [items, setItems] = useState([] as any);
  const wallet = useMemo(() => publicKey?.toString(), [publicKey]);

  useEffect(() => {
    if (wallet) {
      getNFT(wallet, page.pageNumber).then((items) => {
        setItems(items);
      });
    }
  }, [page.pageNumber, publicKey, wallet]);

  const RenderImgs = () => {
    if (!wallet) {
      return (
        <div className="w-full text-center text-gray-500">Please Login</div>
      );
    }
    const renderData: IImgItem[] = items.map((it: any) => ({
      uri: it.content.files[0].cdn_uri,
      name: it.content?.metadata.name,
      desc: it.content?.metadata.description,
      id: it.id,
    }));
    return (
      <>
        {renderData?.length !== 0
          ? renderData.map((data, index) => (
              <div>
                <div className="text-center w-[160px] h-[120px] rounded-lg bg-[#353637] py-4 px-2">
                  <img
                    draggable
                    className="w-full h-full object-cover rounded"
                    alt={data.desc}
                    key={data.id + "_" + index}
                    src={data.uri}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", data.uri);
                    }}
                  ></img>
                </div>
                <div className="w-[160px] my-2  text-[14px] from-neutral-300  text-[#E8E8E8]  text-start items-center truncate ">
                  {data.name}
                </div>
              </div>
            ))
          : new Array(14).fill(
              <Skeleton className="h-[150px] w-full rounded-xl" />
            )}
      </>
    );
  };

  interface ITipProps {
    Icon: any;
    content?: string;
  }
  const Tip: FC<ITipProps> = ({ Icon, content }) => {
    const Render = () => {
      if (content) {
        return (
          <>
            + <Keyboard content={content}></Keyboard>
          </>
        );
      }
    };

    return (
      <div className="py-1 px-2 rounded-full border flex items-center gap-2 bg-white border-gray-300">
        <MousePointerClick />
        <Render />
        <ArrowRight color="#ccc"></ArrowRight> <Icon />
      </div>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="w-screen">
      <ResizablePanel className="min-w-[200px]" defaultSize={15}>
        <div className="flex flex-col h-full bg-[#252627] rounded-none">
          <div className="flex-1 flex flex-wrap  items-center justify-evenly gap-2 overflow-y-scroll p-5">
            <RenderImgs />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="min-w-[700px]" defaultSize={70}>
        <div className="flex flex-col h-full">
          <div className="h-14 w-full flex items-center px-10 gap-4 bg-gray-100">
            <div className="flex justify-center gap-2 -translate-x-6">
              <Tip Icon={RotateCw}></Tip>
            </div>
            <div className="flex items-center gap-2">
              <Tip Icon={ArrowUp} content="w" />
            </div>
            <div className="flex items-center gap-2">
              <Tip Icon={ArrowDown} content="s"></Tip>
            </div>
            <div className="flex items-center gap-2">
              <Tip Icon={Delete} content="d"></Tip>
            </div>
          </div>
          <div className="w-full h-full px-3 pb-2 bg-gray-100">
            <DrawingBoard />
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
    </ResizablePanelGroup>
  );
}
