import { FC, useState } from "react";
import { Skeleton } from "./skeleton";
import useImageLoaded from "@/lib/hooks/useImageLoaded";

interface ImgProps {
  src: string;
  key: string | number;
  className?: string;
  alt?: string;
}
const ImgWithLoading: FC<ImgProps> = ({ src, alt, key, className }) => {
  const [ref, loaded, onLoad] = useImageLoaded();
  return (
    <>
      {loaded ? (
        <img
          ref={ref}
          onLoad={onLoad}
          src={src}
          alt={alt}
          className={className}
        />
      ) : (
        <Skeleton className="w-full rounded h-[140px] bg-slate-200" />
      )}
    </>
  );
};

export default ImgWithLoading;
