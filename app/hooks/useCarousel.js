"use client";

import { useState, useEffect, useRef } from "react";

export function useCarousel(items) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRef = useRef(null);

  // 依類型決定停留時長，影片 6 秒、照片 3 秒
  useEffect(() => {
    const current = items[currentIndex];
    const delay = current?.type === "video" ? 6000 : 3000;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, delay);
    return () => clearInterval(timer);
  }, [items.length, currentIndex]);

  // 切換到影片時從頭播放
  useEffect(() => {
    const current = items[currentIndex];
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentIndex]);

  return { currentIndex, setCurrentIndex, videoRef };
}
