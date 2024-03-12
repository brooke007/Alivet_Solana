import { json, useLoaderData } from "@remix-run/react";
import { Helius } from "helius-sdk";
import type { FunctionComponent, SetStateAction } from "react";
import React, { useState, useCallback, useEffect } from "react";

// 定义图片类型，包括URL和位置
interface ImageInfo {
  id: number;
  url: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}


const wallet = "BKt1HrepS5fxesfoydj5ug5jviqeM5pTFNMc6mcNeV5h";
const helius = new Helius("f46e7c57-a4d4-43b0-b65b-1f287e2380cb");


// nft.tsx
export const loader = async () => {
  const response = await helius.rpc.getAssetsByOwner({
    ownerAddress: wallet,
    page: 1,
  });
  return json(response.items);
};


export default function NFT() {
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('点击编辑名字');

  // 处理文本点击事件，进入编辑模式
  const handleNameClick = () => {
    setIsEditing(true);
  };

  // 处理输入变化事件，更新名字
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  // 处理输入失焦事件，退出编辑模式
  const handleInputBlur = () => {
    setIsEditing(false);
  };

  // 处理键盘事件，允许在按下回车键时保存并退出编辑模式
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setIsEditing(false);
    }
  };

  // 检测是否s键被按下
  const [isSPressed, setIsSPressed] = useState(false);

  const scaleImage = useCallback((id: number, scaleFactor: number) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, scale: Math.max(img.scale + scaleFactor, 0.1) } : img // 确保缩放比例不会小于0.1
      )
    );
  }, []);
  

  const data = useLoaderData<typeof loader>();

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
        { id: prevImages.length, url: imageUrl, x, y, rotation:0, scale: 1 }
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

  const rotateImage = useCallback((id: number) => {
    setImages(prevImages =>
      prevImages.map(img =>
        img.id === id ? { ...img, rotation: (img.rotation + 90) % 360 } : img
      )
    );
  }, []);

  
    useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 's' || e.key === 'S') {
          setIsSPressed(true);
        }
      };
  
      console.log(`isSPressed: ${isSPressed}`);
      const handleKeyUp = (e: KeyboardEvent) => {
        if (e.key === 's' || e.key === 'S') {
          setIsSPressed(false);
        }
      };
      console.log(`isSPressed: ${isSPressed}`);

      // 添加键盘事件监听器
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
  
      // 清理函数
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      };
    }, []);

  return (
    <div style = {{ 
      display: 'flex', 
      flexDirection: 'row', 
      padding: '0 20px'}}>
    <div className="p-4"
      style = {{
        width: '35%',
        overflowY: 'auto',
        height: '100vh',
        marginRight: '10px'
      }}>
      <ul>
          {data.map((nft) => (
            <li key={nft.id}>
              <div className="max-w-sm  m-2 rounded overflow-hidden shadow-lg item">
                <img
                  className="w-full"
                  src={nft.content?.files?.[0]?.cdn_uri}
                  alt={nft.content?.metadata.description}
                  draggable="true"
                  onDragStart={(e) => {
                    // 确保URL存在，否则传递一个空字符串或默认值
                    const imageUrl = nft.content?.files?.[0]?.cdn_uri || '';
                    e.dataTransfer.setData("text/plain", imageUrl);
                  }}
                />
          
                  { <div className="text-xl mb-2">
                    {nft.content?.metadata.name}
                  </div> }

                  
              </div>
            </li>
          ))}

                  
        </ul>
    </div>

    <div
      className="drawing-board"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onMouseMove={onBoardMouseMove} 
      style={{ 
        position: 'sticky',
        top: 50,
        width: '65%', 
        minHeight: '700px', 
        border: '2px dashed #ccc',  
        display: 'flex', 
        flexDirection: 'row' ,
        left: 350,
        alignSelf: 'flex-start',
        marginLeft: '10px'}}
    >
      {images.map((image) => {

        return (
          <img
            key={image.id}
            src={image.url}
            draggable="true"
            onDragStart={(e) => onImageDragStart(e, image.id)}
            onDragEnd={onDragEnd}
            onClick={() => {
              if (isSPressed){
                scaleImage(image.id, image.scale + 0.01);
              }else{
                rotateImage(image.id);
              }
              //console.log(`${isSPressed}`);
            }}
            style={{ 
            position: 'absolute', 
            left: image.x, 
            top: image.y, 
            cursor: 'pointer',
            transform: `rotate(${image.rotation}deg) scale(${image.scale})` ,
            maxWidth: '100px' }}
          />
          
        );
      })}
      
    </div>

    </div>
  );
}