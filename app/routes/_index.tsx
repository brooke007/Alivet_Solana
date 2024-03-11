import { json, useLoaderData } from "@remix-run/react";
import { Helius } from "helius-sdk";
import type { FunctionComponent, SetStateAction } from "react";
import React, { useState } from "react";

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


  const data = useLoaderData<typeof loader>();
  return (
    <div className="p-4">
      <ul>
          {data.map((nft) => (
            <li key={nft.id}>
              <div className="max-w-sm  m-2 rounded overflow-hidden shadow-lg item">
                <img
                  className="w-full"
                  src={nft.content?.files?.[0]?.cdn_uri}
                  alt={nft.content?.metadata.description}
                />
                  <div>
                  {!isEditing ? (
                    <div onClick={handleNameClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
                      {name}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={name}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyPress={handleKeyPress}
                      autoFocus
                      style={{
                        padding: '8px',
                        fontSize: '16px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                    </div>
                  {/* <div className="text-xl mb-2">
                    {nft.content?.metadata.name}
                  </div> */}

                  
                  {/* <p className="text-gray-700 text-base">
                    {nft.content?.metadata.description}
                  </p> */}
                
                {/* <div className="px-6 pt-4 pb-2">
                  {nft.content?.metadata.attributes &&
                    nft.content?.metadata.attributes?.map((trait) => (
                      <span
                        className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                        key={trait["trait_type"]}
                      >
                        {trait["trait_type"]}: {trait.value}
                      </span>
                    ))}
                </div> */}
              </div>
            </li>
          ))}
        </ul>
    </div>
  );
}
