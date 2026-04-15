"use client";

import { useState, useEffect, useRef } from "react";
import { ImageLoader } from "./ImageLoader";
import { useCarousel } from "../hooks/useCarousel";
import { carouselItems } from "../data/voteData";

const PRELOAD_AHEAD = 2; // 除了 current 還預載接下來 2 個 slot

export function PhotoCarousel() {
  const { currentIndex, setCurrentIndex } = useCarousel(carouselItems);
  const [videoReady, setVideoReady] = useState(false);
  const videoRefs = useRef(new Map());

  // 切換時：重置 ready、播 current、暫停其他
  useEffect(() => {
    setVideoReady(false);
    videoRefs.current.forEach((el, idx) => {
      if (!el) return;
      if (idx === currentIndex) {
        el.currentTime = 0;
        el.play().catch(() => {});
      } else {
        el.pause();
      }
    });
  }, [currentIndex]);

  function isInPreloadWindow(i) {
    for (let step = 0; step <= PRELOAD_AHEAD; step++) {
      if (i === (currentIndex + step) % carouselItems.length) return true;
    }
    return false;
  }

  return (
    <div className="relative w-48 h-48 md:w-56 md:h-56 mb-6">
      {carouselItems.map((item, i) => {
        const isCurrent = i === currentIndex;
        const shouldPreload = isInPreloadWindow(i);

        return (
          <div
            key={i}
            className={`absolute inset-0 rounded-2xl overflow-hidden
              bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100
              transition-all duration-700 ease-in-out
              ${isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
            style={{
              boxShadow: "0 0 0 1px rgb(3 7 18 / 0.08), 0 12px 28px -8px rgb(3 7 18 / 0.18)",
            }}
          >
            {item.type === "video" ? (
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(i, el);
                  else videoRefs.current.delete(i);
                }}
                src={item.src}
                muted
                loop
                playsInline
                preload={shouldPreload ? "auto" : "none"}
                className={`w-full h-full object-cover transition-all duration-700 ease-out
                  ${isCurrent && videoReady ? "blur-0 scale-100 opacity-100" : "blur-lg scale-110 opacity-80"}`}
                onCanPlay={isCurrent ? () => setVideoReady(true) : undefined}
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
        );
      })}

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
