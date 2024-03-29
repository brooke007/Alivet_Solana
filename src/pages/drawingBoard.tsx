/* eslint-disable react-hooks/exhaustive-deps */
import { calculateNewPosition, transferOffset } from "@/shared/board/postion";
import { IBoardImgItem } from "@/shared/types/img";
import { FC, useCallback, useEffect, useRef, useState } from "react";

const DrawingBoard: FC = () => {
  const [images, setImages] = useState<IBoardImgItem[]>([]);
  const draggingStatus = useRef({
    isDragging: false,
    draggingId: null as string | null,
  });
  const keyboardStatus = useRef({
    isSPressed: false,
    isDPressed: false,
  });

  const onBoardMouseDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    const draggedId = e.dataTransfer.getData("text/id");
    const imageUrl = e.dataTransfer.getData("text/plain");
    const { x, y } = calculateNewPosition(e);

    if (draggedId) {
      // 在画布内移动
      setImages((prevImages) => {
        return prevImages.map((img) =>
          img.id === draggedId ? { ...img, x, y } : img
        );
      });
    } else if (imageUrl) {
      const newItem: IBoardImgItem = {
        id: imageUrl,
        uri: imageUrl,
        x,
        y,
        rotation: 0,
        scale: 1,
      };
      setImages((preImgs) => preImgs.concat([newItem]));
    }
  }, []);
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
      transferOffset(e);
      draggingStatus.current.isDragging = true;
      draggingStatus.current.draggingId = id;
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/id", id.toString());
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
            ? { ...img, scale: Math.max(img.scale + scaleFactor, -100) }
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
    if (keyboardStatus.current.isSPressed) {
      scaleImage(0.1);
    } else if (keyboardStatus.current.isDPressed) {
      scaleImage(-0.1);
    } else {
      rotateImage();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        keyboardStatus.current.isSPressed = true;
      }
      if (e.key === "d" || e.key === "D") {
        keyboardStatus.current.isDPressed = true;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "s" || e.key === "S") {
        keyboardStatus.current.isSPressed = false;
      }
      if (e.key === "d" || e.key === "D") {
        keyboardStatus.current.isDPressed = false;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return (
    <div
      className="relative h-full w-full bg-white"
      onDrop={onBoardMouseDrop}
      onDragOver={(e) => e.preventDefault()}
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
    </div>
  );
};

export default DrawingBoard;
