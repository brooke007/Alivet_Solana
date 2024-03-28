export interface IImgItem {
  name: string;
  uri: string;
  id: string;
  desc: string;
}

export interface IBoardImgItem{
  id: string;
  uri: string;
  x: number;
  y: number;
  rotation: number;
  scale: number;
}