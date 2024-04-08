/* eslint-disable @typescript-eslint/no-explicit-any */
import { useWallet } from "@solana/wallet-adapter-react";
import { getNFT } from "@/lib/helius";
import { useEffect, useRef, useMemo, useState, useCallback } from "react";
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
import mintCompressedNft from "@/lib/rpc/mint";
import upload from "@/lib/rpc/upload";
import { DialogClose } from "@radix-ui/react-dialog";
import { useAlert } from "react-alert";

function getFileUriFromCid(cid: string) {
  return `https://${cid}.ipfs.cf-ipfs.com/alivet.gif`;
}

export default function Home() {
  const [page] = useState({
    pageNumber: 1,
    pageSize: 10,
  });
  const [nftValue, setNftValue] = useState({
    name: "",
    desc: "",
  });
  const [isloading, setIsloading] = useState(false);
  const [items, setItems] = useState([] as any);
  const { publicKey } = useWallet();
  const wallet = useMemo(() => publicKey?.toString(), [publicKey]);
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const canvasObj = useRef<any>(null);
  const [frameCount, setFrameCount] = useState(0);
  const alert = useAlert();
  const gif = useRef(
    new GIF({
      workers: 2,
      quality: 5,
      width: 1800,
      height: 1600,
      workerScript: "/src/lib/gif.worker.js",
    })
  );

  function addImg(uri: string) {
    setIsloading(true); // 开始加载时显示加载状态

    try {
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

          setTimeout(async () => {
            await canvasObj.current.add(img);
            setIsloading(false);
          }, 100);
        },
        { crossOrigin: "anonymous" }
      );
    } catch (e) {
      alert.error("this img can't load");
    }
  }

  async function addKeyframe() {
    await canvasObj.current?.discardActiveObject();
    await canvasObj.current?.requestRenderAll();

    if (confirm("Do you want to use current paint as a frame?")) {
      const canvasElement = canvasObj.current.getElement();
      gif.current.addFrame(canvasElement, { delay: 200, copy: true });
      setFrameCount((pre) => pre + 1);
      setIsloading(false);
      alert.success("Add frame success", {
        timeout: 1500,
      });
    }
  }

  function clearKeyframe() {
    if (frameCount < 1) {
      alert.error("Please add frame first");
      return;
    }
    if (confirm("Do you want to clear current paint?")) {
      canvasObj.current.clear();
      alert.success("Add frame success", {
        timeout: 1500,
      });
      alert.success("Clear Success");
    }
  }

  function downloadGif() {
    if (frameCount < 1) {
      alert.error("Please add frame first");
      return;
    }
    if (confirm("download GIF")) {
      setIsloading(true);

      gif.current.on("finished", function (blob: any) {
        alert.show("download success", {
          type: "success",
        });
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
      gif.current.render();
    }
  }

  function mintNFTHandler() {
    if (frameCount < 1) {
      alert.error("Please add frame first");
      return;
    }
    if (!nftValue.desc || !nftValue.name) {
      alert.error("Please input your NFT info");
      return;
    } else {
      setIsloading(true);
      (() => {
        alert.info("generating GIF....");
        gif.current.on("finished", async (blob: any) => {
          alert.info("loading GIF....");
          const cid = await upload(blob);
          alert.info("MINT...It maybe take 1 min...", {
            timeout: 30000,
          });
          await mintCompressedNft({
            desc: nftValue.desc,
            name: nftValue.name,
            owner: wallet as string,
            uri: getFileUriFromCid(cid),
          }).finally(() => {
            setIsloading(false);
          });
          alert.success("MINT Success", {
            timeout: 5000,
          });
        });
        gif.current.render();
      })();
    }
  }

  const RenderImgs = useCallback(() => {
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
  }, [items, wallet]);

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
                  "relative h-full w-full overfl5w-hidden  border-dashed rounded-md bg-white border-white border-2",
                ])}
              >
                <canvas height={1000} width={1000} ref={canvasEl} />
                <div className="text-[1.2rem] uppercase font-bold text-[#D8B4FE] absolute right-5 top-5">
                  {frameCount} Frames Added
                </div>
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
                          value={nftValue.name}
                          className="col-span-3"
                          onChange={(e) => {
                            setNftValue({
                              ...nftValue,
                              name: e.currentTarget.value,
                            });
                          }}
                        />
                        <Label htmlFor="decsription" className="text-right">
                          Descriotion:
                        </Label>
                        <Input
                          id="desc"
                          value={nftValue.desc}
                          className="col-span-3"
                          onChange={(e) => {
                            setNftValue({
                              ...nftValue,
                              desc: e.currentTarget.value,
                            });
                          }}
                        />
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button type="button" variant="secondary">
                            Close
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button onClick={mintNFTHandler}>Finish</Button>
                        </DialogClose>
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
