/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { calculateNewPosition, transferOffset } from "@/shared/board/postion";
import { IBoardImgItem } from "@/shared/types/img";
import clsx from "clsx";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import style from "./style.module.css";
import MyButton from "@/components/ui/myButton";
import { Check, Download, Eraser, Play, Plus } from "lucide-react";
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
import { Button } from "@/components/ui/button";

const DrawingBoard: FC = () => {
  const [images, setImages] = useState<IBoardImgItem[]>([]);
  const boardRef = useRef(null);
  const draggingStatus = useRef({
    isDragging: false,
    draggingId: null as string | null,
  });
  const keyboardStatus = useRef({
    isSPressed: false,
    isDPressed: false,
    isWPressed: false,
  });
  const [nftData, setnftData] = useState({
    name: "",
  });

  const varifyPostion = (x: number, y: number) => {
    let validx = x;
    let validy = y;
    if (x < 0) validx = 0;
    if (y < 0) validx = 0;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { clientWidth, clientHeight } = (boardRef as any).current;
    if (x > clientWidth) validx = clientWidth;
    if (y > clientHeight) validy = clientHeight;

    return [validx, validy];
  };

  const onBoardMouseDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    console.log(e);
    const draggedId = e.dataTransfer.getData("text/id");
    const imageUrl = e.dataTransfer.getData("text/plain");
    const check = images.find((i) => i.uri === imageUrl);

    if (check) {
      alert("ops!you have alreay added this NFT to the board.");
      return;
    }
    // return;
    // }

    const { x, y } = calculateNewPosition(e);
    const [validX, validY] = varifyPostion(x, y);
    if (draggedId) {
      // 在画布内移动
      setImages((prevImages) => {
        return prevImages.map((img) =>
          img.id === draggedId ? { ...img, x: validX, y: validY } : img
        );
      });
    } else if (imageUrl) {
      const newItem: IBoardImgItem = {
        id: imageUrl,
        uri: imageUrl,
        x: validX,
        y: validY,
        rotation: 0,
        scale: 1,
      };
      setImages((preImgs) => preImgs.concat([newItem]));
    }
  };

  const onBoardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggingStatus.current || !draggingStatus.current.draggingId) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { x, y } = calculateNewPosition(e as any);

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === draggingStatus.current.draggingId ? { ...img, x, y } : img
        )
      );
    },
    []
  );
  const onImageDragStart = useCallback(
    (e: React.DragEvent<HTMLImageElement>, id: string) => {
      const boardRect = e.currentTarget.getBoundingClientRect();
      transferOffset(e);
      draggingStatus.current.isDragging = true;
      draggingStatus.current.draggingId = id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/id", id.toString());
      e.dataTransfer.setData("number/w", boardRect.width + "");
      e.dataTransfer.setData("number/h", boardRect.height + "");
    },
    []
  );
  const onImageDragEnd = useCallback(() => {
    draggingStatus.current.isDragging = false;
    draggingStatus.current.draggingId = null;
  }, []);
  const onClickImage = useCallback((id: string) => {
    const scaleImage = (scaleFactor: number) => {
      setImages((prevImages) => {
        return prevImages.map((img) =>
          img.id === id
            ? { ...img, scale: Math.max(img.scale + scaleFactor, 0.3) }
            : img
        );
      });
    };
    const rotateImage = () => {
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
        )
      );
    };
    const deleteImage = () => {
      setImages((prevImages) => prevImages.filter((i) => i.id !== id));
    };

    if (keyboardStatus.current.isWPressed) {
      scaleImage(0.1);
    } else if (keyboardStatus.current.isSPressed) {
      scaleImage(-0.1);
    } else if (keyboardStatus.current.isDPressed) {
      deleteImage();
    } else {
      rotateImage();
    }
  }, []);

  const addkeyframe = () => {
    console.log("Set it to add Keyframe");
    // 实现设置关键帧的逻辑
    saveKeyframes();
  };

  const save = () => {
    console.log("set it to save");
    // 实现逻辑
    downloadAllKeyframes();
  };

  // keyframes
  const saveKeyframes = () => {
    // 尝试从localStorage中获取已存在的关键帧数据
    const existingKeyframes = localStorage.getItem("keyframes");
    const keyframes = existingKeyframes ? JSON.parse(existingKeyframes) : [];

    localStorage.setItem("keyframesSaved", "true");

    // 添加当前的images数据到关键帧列表
    keyframes.push(images); // 假设`images`是当前的图片状态

    // 将更新后的关键帧列表保存回localStorage
    localStorage.setItem("keyframes", JSON.stringify(keyframes, null, 2));
  };

  function downloadKeyframeData(data: string, filename: string) {
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  const clearKeyframes = () => {
    localStorage.removeItem("keyframes");
    setImages([]);
    alert("Keyframes cleared.");
  };

  const playLocalKeyframes = () => {
    const localItem = localStorage.getItem("keyframes") || "";
    const keyframes = JSON.parse(localItem);
    playKeyframes(keyframes);
  };

  const playKeyframes = (keyframesData: any) => {
    if (keyframesData === "" || !keyframesData) return;

    let currentFrame = 0;
    const interval = 100; // 假设每帧间隔100毫秒,需要再计算一下

    const intervalId = setInterval(() => {
      if (currentFrame < keyframesData.length) {
        setImages(keyframesData[currentFrame]);
        currentFrame++;
      } else {
        clearInterval(intervalId); // 播放完毕，清除定时器
      }
    }, interval);
  };

  const downloadAllKeyframes = () => {
    // 从localStorage中获取所有关键帧数据
    const keyframesData = localStorage.getItem("keyframes");

    if (keyframesData) {
      // 如果有关键帧数据，触发下载
      downloadKeyframeData(keyframesData, "all-keyframes.json");
    } else {
      alert("No keyframes data to download.");
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        keyboardStatus.current.isSPressed = true;
      }
      if (e.key === "d" || e.key === "D") {
        keyboardStatus.current.isDPressed = true;
      }
      if (e.key === "w" || e.key === "W") {
        keyboardStatus.current.isWPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        keyboardStatus.current.isSPressed = false;
      }
      if (e.key === "d" || e.key === "D") {
        keyboardStatus.current.isDPressed = false;
      }
      if (e.key === "w" || e.key === "W") {
        keyboardStatus.current.isWPressed = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const mintNFTHandler = () => {};

  return (
    <div
      ref={boardRef}
      className={clsx([
        "relative h-full w-full  border-dashed rounded-md bg-white border-gray-300 border-2",
        style.boardBackground,
      ])}
      onDrop={onBoardMouseDrop}
      onDragOver={(e) => e.preventDefault()}
      onMouseMove={onBoardMouseMove}
    >
      {images.map((image) => {
        return (
          <img
            key={image.id}
            src={image.uri}
            draggable
            onDragStart={(e) => onImageDragStart(e, image.id)}
            onDragEnd={onImageDragEnd}
            onClick={() => onClickImage(image.id)}
            className={`absolute cursor-pointer max-w-[100px]`}
            style={{
              transform: `rotate(${image.rotation}deg) scale(${image.scale})`,
              left: image.x,
              top: image.y,
            }}
          />
        );
      })}
      <div className="h-[280px] w-[50px] bg-black color-[#fff] absolute rounded-full flex flex-col items-center justify-center gap-4 right-5 bottom-5">
        <MyButton
          onClick={addkeyframe}
          desc="add keyframe"
          content={<Plus />}
        />
        <MyButton
          onClick={clearKeyframes}
          desc="clear keyframes"
          content={<Eraser />}
        />
        <MyButton
          onClick={downloadAllKeyframes}
          desc="download"
          content={<Download />}
        />
        <MyButton onClick={playLocalKeyframes} desc="play" content={<Play />} />
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
              <DialogDescription>MINT your GIF as a NFT</DialogDescription>
            </DialogHeader>
            <div>
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={nftData.name}
                className="col-span-3"
                onChange={(e) => {
                  setnftData({ name: e.currentTarget.value });
                }}
              />
            </div>
            <DialogFooter>
              <Button type="submit" onClick={mintNFTHandler}>
                Finsh
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DrawingBoard;
