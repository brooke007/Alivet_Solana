import React, { useState, useCallback } from 'react';

// 定义图片类型，包括URL和位置
interface ImageInfo {
  id: number;
  url: string;
  x: number;
  y: number;
}

export default function DrawingBoard() {
  const [images, setImages] = useState<ImageInfo[]>([]);
  const [dragging, setDragging] = useState(false);
  const [draggedImageId, setDraggedImageId] = useState<number | null>(null);

  const onBoardMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging || draggedImageId === null) return;
  
    const boardRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - boardRect.left;
    const y = e.clientY - boardRect.top;
  
    setImages(prevImages => prevImages.map(img => img.id === draggedImageId ? { ...img, x, y } : img));
  }, [dragging, draggedImageId]);
  

  // 处理放置图片到画板
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    // 尝试获取被拖拽图片的ID，如果有的话表示这是一个内部移动操作
    const draggedId = e.dataTransfer.getData("text/id");
    const imageUrl = e.dataTransfer.getData("text/plain");
    console.log(`Dragged ID: ${draggedId}, Image URL: ${imageUrl}`);

    const boardRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - boardRect.left; // 调整x坐标
    const y = e.clientY - boardRect.top; // 调整y坐标
  
    if (draggedId) {
      // 如果是内部移动，更新现有图片的位置
      setImages(prevImages =>
        prevImages.map(img => img.id === Number(draggedId) ? { ...img, x, y } : img)
      );
    } else if (imageUrl) {
      // 如果是从外部拖入的图片，添加新图片
      setImages(prevImages => [
        ...prevImages,
        { id: prevImages.length, url: imageUrl, x, y }
      ]);
    }
  }, []);

  // 允许在画板上放置
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // 开始拖拽画板上的图片
  const onImageDragStart = useCallback((e: React.DragEvent<HTMLImageElement>, id: number) => {
    setDragging(true);
    setDraggedImageId(id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/id", id.toString()); // 需要设置数据，否则不会触发drop
  }, []);

  // 移动画板上的图片
  const onImageDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!dragging || draggedImageId === null) return;

    // 更新被拖拽图片的位置
    setImages((prevImages) => prevImages.map(img => {
      if (img.id === draggedImageId) {
        return { ...img, x: e.clientX, y: e.clientY };
      }
      return img;
    }));
  }, [dragging, draggedImageId]);

  // 结束拖拽
  const onDragEnd = useCallback(() => {
    setDragging(false);
    setDraggedImageId(null);
  }, []);

  
  return (
    <div
      className="drawing-board"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={onBoardMouseMove} 
      style={{ position: 'relative', width: '100%', minHeight: '500px', border: '2px dashed #ccc' }}
    >
      {images.map((image) => {

        return (
          <img
            key={image.id}
            src={image.url}
            draggable
            onDragStart={(e) => onImageDragStart(e, image.id)}
            onDragEnd={onDragEnd}
            style={{ position: 'absolute', left: image.x, top: image.y, maxWidth: '100px' }}
          />

        );
      })}
      
    </div>
  );
  
}
