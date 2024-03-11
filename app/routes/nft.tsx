import React, { useState } from 'react';

export default function sfe() {
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

  return (
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
  );
}
