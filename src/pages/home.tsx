/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from "@solana/wallet-adapter-react";
import { getNFT } from "@/lib/helius";
import { useEffect, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import style from "./style.module.css";
import clsx from "clsx";
import { IImgItem } from "@/shared/types/img";
import DrawingBoard from "./drawingBoard";

export default function Home() {
  const { publicKey } = useWallet();
  const [page, setPage] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [items, setItems] = useState([] as any);
  const wallet = useMemo(() => publicKey?.toString(), [publicKey]);

  useEffect(() => {
    wallet &&
      getNFT(wallet, page.pageNumber).then((items) => {
        setItems(items);
      });
  }, [page.pageNumber, publicKey, wallet]);

  const RenderImgs = () => {
    // TODO：暂时方案
    if (!wallet)
      return (
        <div className="w-full text-center text-gray-500">Please Login</div>
      );
    const renderData: IImgItem[] = items.map((it: any) => ({
      uri: it.content.files[0].cdn_uri,
      name: it.content?.metadata.name,
      desc: it.content?.metadata.description,
      id: it.id,
    }));
    return (
      <>
        {renderData?.length !== 0
          ? renderData.map((data, index: number) => (
              <div className="text-center rounded-lg shadow shadow-black bg-black">
                <img
                  draggable
                  className="w-full h-[139.5px] rounded"
                  alt={data.desc}
                  key={data.id + "_" + index}
                  src={data.uri}
                  onDragStart={(e) =>
                    e.dataTransfer.setData("text/plain", data.uri)
                  }
                ></img>
                <div className="my-2 px-3 text-[.6rem] font-bold text-white leading-tight w-full text-center items-center truncate">
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

  return (
    <div className="h-full flex">
      <div className="w-[200px] flex flex-col">
        <div className="flex-1 grid grid-cols-1 gap-3 overflow-y-scroll p-4">
          <RenderImgs />
        </div>
        <div
          className={clsx(
            "h-[70px] w-full flex items-center justify-center",
            style.topShadow
          )}
        >
          <Button className="w-[200px]" color="#C2EFB8">
            Refresh
          </Button>
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="h-full p-5 bg-[#F0F4F8]">
          <DrawingBoard />
        </div>
        <div
          className={clsx([
            "bg-white h-[70px] flex flex-col items-center",
            style.topShadow,
          ])}
        >
          <span className="text-gray-400 text-[.8rem]">keyframes</span>
          <div className="mt-1 gap-2 flex">
            <Button size="sm">Add</Button>
            <Button size="sm">Delete</Button>
            <Button size="sm">Download</Button>
            <Button size="sm">Play</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
