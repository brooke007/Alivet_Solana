import clsx from "clsx";
import style from "./style.module.css";
import { Link } from "react-router-dom";

const Show = () => {
  return (
    <div className="w-screen h-screen flex flex-col">
      <header
        className="w-full h-16 z-10 py-2 flex items-end flex-row-reverse px-10 relative"
        style={{
          background: "#000",
        }}
      >
        <Link
          to="/home"
          className="w-40 rounded-full flex items-center justify-center font-[Alivet] h-full text-white bg-black/15 border-white border"
        >
          ALIVET
        </Link>
      </header>
      <main className="w-full h-full flex-1 relative">
        <div className="fixed h-full w-full">
          <video
            autoPlay
            muted
            loop
            className={clsx([style.myVedio, "h-full"])}
          >
            <source src="/src/assets/bg.mp4" type="video/mp4"></source>
          </video>
        </div>
        <div className="h-full w-full relative text-white  font-bold font-[Alivet] flex flex-col items-center justify-center">
          <div className="-translate-y-16">
            <div className="w-full text-center text-[1.4rem]">
              Alive Your NFT
            </div>
            <div className="text-[3.5rem] px-10 text-center">
              Unlock the Power of Your NFTs.
              <span className="text-[0.8rem]">@2024</span>
            </div>
          </div>
          <Link
            to="/home"
            className="text-black bg-yellow-100 w-[240px] h-[60px] rounded-full flex items-center justify-center text-[1.2rem] font-bold"
          >
            TRY IT!
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Show;
