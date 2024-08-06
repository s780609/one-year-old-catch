"use client";

import { useState, useEffect } from "react";
import { ImageLoader } from "./ImageLoader";

export function Selector({ src, title }) {
  const [count, setCount] = useState(0);

  const plus = (e) => {
    console.log(e);
  };

  const buttonStyle = "bg-blue-500 text-white rounded m-1 px-3 py-1";

  return (
    <div className="w-full px-2 py-2 my-5">
      <div className="text-center text-xl">
        <button
          onClick={() => {
            setCount(count + 1);
          }}
          className={buttonStyle}
        >
          +
        </button>
        <span>{count}</span>
        <button
          onClick={() => {
            setCount(count - 1);
          }}
          className={buttonStyle}
        >
          -
        </button>
      </div>
      <div className="text-center text-xl">{title}</div>
      <ImageLoader src={src}></ImageLoader>
    </div>
  );
}
