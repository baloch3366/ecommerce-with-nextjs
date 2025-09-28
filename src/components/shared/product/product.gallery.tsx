'use client'
import Image from "next/image";
import { useState } from "react";
import Zoom from "react-medium-image-zoom"
import 'react-medium-image-zoom/dist/styles.css'


export default function ProductGallery ({images}: {images: string[]}) {

    const [selectedImage, setSelectedImage] = useState(0);

      return (
        <div className="flex flex-col md:flex-row gap-4">
            {/* main image */}
            <div className="w-full">
                <Zoom>
                    <div className="relative h-[500px]">
                        <Image
                        src={images[selectedImage]}
                        alt={`Selected Product image ${selectedImage + 1}`}
                        fill
                        className="object-contain transition-opacity duration-300"
                        priority
                        />
                    </div>
                </Zoom>
            </div>

             {/* thumbnail  */}
             <div className="flex md:flex-col flex-row gap-2 md:mt-8 overflow-x-auto md:overflow-visible">
                {images.map((image,index) => (
                    <button key={index}
                    onClick={() => setSelectedImage(index)}
                    onMouseOver={() => setSelectedImage(index)}
                    aria-label= {`select image ${index + 1}`}
                    className= {`bg-white rounded-lg overflow-hidden ${
                        selectedImage == index ?
                        "ring-2 ring-blue-500" :
                        "ring-1 ring-gray-300"
                    }`}
                    >
                     <Image 
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      width={48}
                      height={48}
                      loading='lazy'
                     />
                    </button>
                ))}
             </div>
        </div>
      )
}