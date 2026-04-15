"use client";

import { useState, useEffect } from "react";
import { ImageLoader } from "./ImageLoader";
import { useCarousel } from "../hooks/useCarousel";
import { carouselItems } from "../data/voteData";

export function PhotoCarousel() {
  const { currentIndex, setCurrentIndex, videoRef } = useCarousel(carouselItems);
  const [videoReady, setVideoReady] = useState(false);

  // 切到新 video slot 時淡入
  useEffect(() => {
    setVideoReady(false);
  }, [currentIndex]);

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
      {carouselItems.map((item, i) => (
        <div
          key={i}
          className={`absolute inset-0 rounded-2xl overflow-hidden
            bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100
            transition-all duration-700 ease-in-out
            ${i === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          style={{
            boxShadow: "0 0 0 1px rgb(3 7 18 / 0.08), 0 12px 28px -8px rgb(3 7 18 / 0.18)",
          }}
        >
          {item.type === "video" ? (
            i === currentIndex ? (
              <video
                key={`video-${i}`}
                ref={videoRef}
                src={item.src}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                className={`w-full h-full object-cover transition-all duration-700 ease-out
                  ${videoReady ? "blur-0 scale-100 opacity-100" : "blur-lg scale-110 opacity-80"}`}
                onCanPlay={() => setVideoReady(true)}
              />
            ) : null
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
            className={`h-1.5 rounded-full transition-all duration-300
              ${i === currentIndex
                ? (item.type === "video" ? "bg-pink-500 w-5" : "bg-emerald-500 w-5")
                : "bg-neutral-300 w-1.5 hover:bg-neutral-400"
              }`}
          />
        ))}
      </div>
    </div>
  );
}
