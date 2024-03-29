function transferOffset(e: React.DragEvent<HTMLImageElement>) {
  const boardRect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - boardRect.left;
  const offsetY = e.clientY - boardRect.top;
  e.dataTransfer.setData("text/x", String(offsetX));
  e.dataTransfer.setData("text/y", String(offsetY));
}

function calculateNewPosition(e: React.DragEvent<HTMLDivElement>) {
  const offsetX = e.dataTransfer.getData("text/x");
  const offsetY = e.dataTransfer.getData("text/y");
  const boardRect = e.currentTarget.getBoundingClientRect();
  const newX = e.clientX - boardRect.left - Number(offsetX);
  const newY = e.clientY - boardRect.top - Number(offsetY);
  return { x: newX, y: newY };
}

function calculateOffset(e: React.DragEvent<HTMLDivElement>) {
  const boardRect = e.currentTarget.getBoundingClientRect();
  const offsetX = e.clientX - boardRect.left;
  const offsetY = e.clientY - boardRect.top;
  e.dataTransfer.setData("text/x", String(offsetX));
  e.dataTransfer.setData("text/y", String(offsetY));
}

export {
  transferOffset,
  calculateNewPosition,
  calculateOffset,
}