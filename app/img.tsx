"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";

type Props = {
  src: string;
  title: string;
  fallbackSrc?: string;
  width?: number;
  height?: number;
};

const Img = ({
  src,
  title,
  fallbackSrc = "no-image-icon.png",
  width = 150,
  height = 110,
}: Props) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Fragment>
      {!isLoaded && (
        <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0 bg-transparent	z-[9999]">
          <div className="w-[50px] h-[50px] border-8 text-blue-400 text-4xl animate-spin border-gray-300 flex items-center justify-center border-t-blue-400 rounded-full"></div>
        </div>
      )}

      <Image
        key={imgSrc}
        src={`/images/${imgSrc}`}
        alt={title}
        className="rounded-lg !w-[150px] !h-[110px]"
        width={width}
        height={height}
        layout="responsive"
        priority={true} // Use priority for above-the-fold images
        onLoadingComplete={() => setIsLoaded(true)}
        onError={() => setImgSrc(fallbackSrc)} // If image fails, load fallback
        style={{ display: isLoaded ? "block" : "none" }}
      />
    </Fragment>
  );
};

export default Img;
