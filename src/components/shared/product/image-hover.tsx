// 'use client'
// import Image from "next/image";
// import { useRef, useState } from "react";

// const ImageHover = ({
//     src,
//     hoverSrc,
//     alt,
// }:
// {
//     src: string,
//     hoverSrc: string,
//     alt: string,
// }) => {
//     const [isHovered, setIsHovered ] = useState(false);
//   const hoverTimeout = useRef<NodeJS.Timeout | null>(null); // 👈 persist across renders


//      const handleMouseEnter = () => {
//     hoverTimeout.current = setTimeout(() => setIsHovered(true), 300); // shorter delay
//      }
//      const handleMouseLeave = () => {
//         if (hoverTimeout.current) {
//       clearTimeout(hoverTimeout.current);
//     }
//     setIsHovered(false);

//      }
//     return(
//         <div
//         className="relative h-52"
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         >
//          <Image 
//          src={src}
//          alt={alt}
//          fill
//          sizes= '80vw'
//          className = {` object-contain transition-opacity duration-500 ${
//             isHovered ? "opacity-0": "opacity-100"
//          }}`}/>
//          <Image 
//          src={hoverSrc}
//          alt={alt}
//          fill
//          sizes='80vw'
//          className = {`absolute object-contain transition-opacity duration-500 ${
//             isHovered ? "opacity-100": "opacity-0"
//          }}`}/>
//         </div>
//     )
// }
// export default ImageHover;



"use client";
import Image from "next/image";
import { useState } from "react";

const ImageHover = ({
  src,
  hoverSrc,
  alt,
}: {
  src: string;
  hoverSrc: string;
  alt: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative h-52 w-full overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        className={`absolute top-0 left-0 object-contain transition-opacity duration-500 ${
          isHovered ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={hoverSrc}
        alt={alt}
        fill
        sizes="100vw"
        className={`absolute top-0 left-0 object-contain transition-opacity duration-5
            00 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default ImageHover;

