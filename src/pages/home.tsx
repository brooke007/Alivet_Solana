/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from "@solana/wallet-adapter-react";
import { getNFT } from "@/lib/helius";
import { useEffect, useRef, useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IImgItem } from "@/shared/types/img";
import clsx from "clsx";
import MyButton from "@/components/ui/myButton";
import { Check, Download, Eraser, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fabric } from "fabric";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import GIF from "gif.js";
import Loading from "@/components/layout/loading";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { publicKey } = useWallet();
  const [page] = useState({
    pageNumber: 1,
    pageSize: 10,
    width: 1000,
    height: 1000,
  });
  const [isloading, setIsloading] = useState(false);
  const [items, setItems] = useState([] as any);
  const wallet = useMemo(() => publicKey?.toString(), [publicKey]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasObj = useRef<any>(null);
  const addImg = (uri: string) => {
    setIsloading(true); // 开始加载时显示加载状态

    fabric.Image.fromURL(
      uri,
      function (img) {
        const targetWidth = 200;
        const scaleRatio = targetWidth / (img.width as any);
        img.set({
          left: 100,
          top: 100,
          selectable: true,
          hasControls: true,
          scaleX: scaleRatio,
          scaleY: scaleRatio,
          hasBorders: true,
        });

        // 图片加载并设置完成后，添加到画布上
        setTimeout(() => {
          canvasObj.current.add(img);
          setIsloading(false); // 隐藏加载状态
        }, 200);
      },
      { crossOrigin: "anonymous" }
    );
  };

  const gif = new GIF({
    workers: 2,
    quality: 10,
    width: 1800,
    height: 1600,
    workerScript: "/src/lib/gif.worker.js",
  });

  function addKeyframe() {
    if (confirm("use current paint as a frame")) {
      canvasObj.current?.discardActiveObject(); // 取消选中当前活动对象
      canvasObj.current?.requestRenderAll();
      const canvasElement = canvasObj.current.getElement();
      gif.addFrame(canvasElement, { delay: 200, copy: true });
      setIsloading(false);
    }
  }
  function clearKeyframe() {
    confirm("Do you want to clear current paint?") && canvasObj.current.clear();
  }

  function downloadGif() {
    if (confirm("download GIF")) {
      setIsloading(true);
      gif.on("finished", function (blob: any) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "animation.gif";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsloading(false);
      });

      // 开始生成 GIF
      gif.render();
    }
  }
  function mintNFTHandler() {
    console.log("mint");
    gif.on("finished", function (blob: any) {
      // 创建一个指向生成的 GIF Blob 的 URL
      const url = URL.createObjectURL(blob);

      // 你可以使用这个 URL 来展示 GIF 图像或创建一个下载链接
      console.log(url); // 输出 URL 以便查看或进一步使用

      // 示例：展示 GIF 图像
      const img = document.createElement("img");
      img.src = url;
      document.body.appendChild(img);

      // 示例：创建一个下载链接
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = "animated.gif"; // 设置下载文件的名称
      downloadLink.innerText = "Download GIF";
      document.body.appendChild(downloadLink);
      downloadLink.click();
    });
    gif.render();
  }

  useEffect(() => {
    canvasObj.current = new fabric.Canvas(canvasEl.current);
    return () => {
      canvasObj?.current?.dispose();
    };
  }, []);
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
                <div className="text-center w-[160px] h-[120px] rounded-lg bg-[#353637] hover:bg-gray-700 py-4 px-2 hover:cursor-pointer ">
                  <img
                    draggable={false}
                    className="w-full h-full object-cover rounded"
                    onClick={() => {
                      const res = confirm("do you want to add this nft?");
                      if (res) {
                        addImg(data.uri);
                      }
                    }}
                    alt={data.desc}
                    key={data.id + "_" + index}
                    src={data.uri}
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

  return (
    <>
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
          <div className="flex flex-col h-full py-3 overflow-hidden bg-gray-300">
            <div className="w-full h-full px-3 pb-">
              <div
                className={clsx([
                  "relative h-full w-full overflow-hidden  border-dashed rounded-md bg-white border-white border-2",
                ])}
              >
                <canvas height={1000} width={1000} ref={canvasEl} />
                <div className="h-[280px] w-[50px] bg-black color-[#fff] absolute rounded-full flex flex-col items-center justify-center gap-4 right-5 bottom-5">
                  <MyButton
                    onClick={addKeyframe}
                    desc="add keyframe"
                    content={<Plus />}
                  />
                  <MyButton
                    onClick={clearKeyframe}
                    desc="clear keyframes"
                    content={<Eraser />}
                  />
                  <MyButton
                    onClick={downloadGif}
                    desc="download"
                    content={<Download />}
                  />
                  <Dialog>
                    <DialogTrigger asChild>
                      <MyButton
                        onClick={() => {}}
                        desc="Mint"
                        content={<Check />}
                      ></MyButton>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>MINT</DialogTitle>
                        <DialogDescription>
                          MINT your GIF as a NFT
                        </DialogDescription>
                      </DialogHeader>
                      <div>
                        <Label htmlFor="name" className="text-right">
                          Name
                        </Label>
                        <Input
                          id="name"
                          // value={nftData.name}
                          className="col-span-3"
                          onChange={(e) => {
                            // setnftData({ name: e.currentTarget.value });
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <Button>Cancel</Button>
                        <Button onClick={mintNFTHandler}>Finsh</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
        <ResizableHandle />
      </ResizablePanelGroup>
      {isloading && <Loading />}
    </>
  );
}
