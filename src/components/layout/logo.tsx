import { FC } from "react";
import logo from "/src/assets/logo.png";

const Logo: FC = () => {
  return <img className="w-full object-contain h-full" src={logo}></img>;
};

export default Logo;
