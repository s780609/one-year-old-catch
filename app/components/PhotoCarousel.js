"use client";

import { ImageLoader } from "./ImageLoader";
import { useCarousel } from "../hooks/useCarousel";
import { carouselItems } from "../data/voteData";

export function PhotoCarousel() {
  const { currentIndex, setCurrentIndex, videoRef } = useCarousel(carouselItems);

  return (
    <div className="relative w-52 h-52 md:w-60 md:h-60 mb-6">
      {carouselItems.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 rounded-full overflow-hidden border-4 border-white shadow-xl
            transition-all duration-700 ease-in-out
            ${i === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {item.type === "video" ? (
            <video
              ref={i === currentIndex ? videoRef : null}
              src={item.src}
              muted
              loop
              playsInline
              autoPlay={i === currentIndex}
              className="w-full h-full object-cover"
              onLoadedData={(e) => {
                if (i === currentIndex) e.target.play();
              }}
            />
          ) : (
            <ImageLoader
              src={item.src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              priority={i === 0}
              sizes="240px"
            />
          )}
        </div>
      ))}

      {/* 指示點 */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {carouselItems.map((item, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300
              ${i === currentIndex
                ? (item.type === "video" ? "bg-pink-500 w-4" : "bg-teal-500 w-4")
                : "bg-gray-300 hover:bg-gray-400"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
