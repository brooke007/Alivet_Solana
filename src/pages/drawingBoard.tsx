/* eslint-disable react-hooks/exhaustive-deps */
import { IBoardImgItem } from "@/shared/types/img";
import { FC, useCallback, useEffect, useState } from "react";

const DrawingBoard: FC = () => {
  const [images, setImages] = useState<IBoardImgItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState<string | null>(null);

  // 按键监听 TODO：这块感觉怪怪的，需要重构
  const [isSPressed, setIsSPressed] = useState(false);
  const [isDPressed, setIsDPressed] = useState(false);

  // 画板处理函数：
  // TODO: 这块要封装（如果后续还是采用这个方案的话，我觉得这里的算法还是太简陋了）
  // 允许在画板上放置
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    // TODO：我觉得这儿有bug，text/id 是否会被清除？如果不的话就有bug
    const draggedId = e.dataTransfer.getData("text/id");
    const imageUrl = e.dataTransfer.getData("text/plain");

    console.log(`Dragged ID: ${draggedId}, Image URL: ${imageUrl}`);

    // 计算坐标，TODO：这块要抽离出来
    const boardRect = e.currentTarget.getBoundingClientRect();
    // TODO: 减去盒子本身的宽高
    const newX = e.clientX - boardRect.left;
    const newY = e.clientY - boardRect.top;

    if (draggedId) {
      // 在画布内移动
      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === draggedId ? { ...img, newX, newY } : img
        )
      );
    } else if (imageUrl) {
      // TODO: 验证新移入的图片的初始坐标
      const newItem: IBoardImgItem = {
        id: String(images.length + 1),
        uri: imageUrl,
        x: newX,
        y: newY,
        rotation: 0,
        scale: 1,
      };
      setImages((preImgs) => [...preImgs, newItem]);
    }
  }, []);
  const onBoardMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      // TODO: 这里严重冗余，需要重构
      if (!isDragging || draggedImageId === null) return;

      const boardRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - boardRect.left;
      const y = e.clientY - boardRect.top;

      setImages((prevImages) =>
        prevImages.map((img) =>
          img.id === draggedImageId ? { ...img, x, y } : img
        )
      );
    },
    []
  );

  // ImgItem处理函数：
  const onImageDragStart = useCallback(
    (e: React.DragEvent<HTMLImageElement>, id: string) => {
      setIsDragging(true);
      setDraggedImageId(id);
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/id", id.toString());
    },
    []
  );
  const onDragEnd = useCallback(() => {
    setIsDragging(false);
    setDraggedImageId(null);
  }, []);

  // 关键帧相关函数：

  // 工具函数：
  const scaleImage = useCallback((id: string, scaleFactor: number) => {
    setImages((prevImages) => {
      return prevImages.map(
        (img) =>
          img.id === id
            ? { ...img, scale: Math.max(img.scale + scaleFactor, -100) }
            : img // 确保缩放比例不会小于0.1
      );
    });
  }, []);
  const rotateImage = useCallback((id: string) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  }, []);

  // 初始化：注册事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        setIsSPressed(true);
      }

      if (e.key === "d" || e.key === "D") {
        setIsDPressed(true);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        setIsSPressed(false);
      }

      if (e.key === "d" || e.key === "D") {
        setIsDPressed(false);
      }
    };

    // 添加键盘事件监听器
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    // 清理函数
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      className="relative h-full w-full bg-white"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={onBoardMouseMove}
      style={{
        border: "3px dashed #ccc",
      }}
    >
      {images.map((image) => {
        return (
          <img
            key={image.id}
            src={image.uri}
            draggable
            onDragStart={(e) => onImageDragStart(e, image.id)}
            onDragEnd={onDragEnd}
            onClick={() => {
              if (isSPressed) {
                scaleImage(image.id, 0.1);
              } else if (isDPressed) {
                scaleImage(image.id, -0.1);
              } else {
                rotateImage(image.id);
              }
            }}
            className={`absolute l-[${image.x}] r-[${image.y}] cursor-pointer max-w-[100px]`}
            style={{
              transform: `rotate(${image.rotation}deg) scale(${image.scale})`,
            }}
          />
        );
      })}
    </div>
  );
};

export default DrawingBoard;
