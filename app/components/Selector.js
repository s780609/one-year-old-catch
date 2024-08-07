"use client";

import { useState, useEffect } from "react";
import { ImageLoader } from "./ImageLoader";
import axios from "axios";

export function Selector({
  data,
  myName,
  src,
  title,
  count,
  setCount,
  disabled,
}) {
  const [pageData, setPageData] = useState(data);
  const [vote, setVote] = useState(0);
  const [loading, setLoading] = useState(false);

  const plus = async () => {
    if (!pageData) {
      return;
    }

    try {
      setLoading(true);
      setCount(count + 1);
      setVote(vote + 1);

      const response = await axios.patch(
        `/api`,
        {
          pageId: pageData.id,
          propName: title,
          text: myName,
        },
        {
          headers: {},
        }
      );

      setPageData(response.data.result);
    } catch (error) {
      setCount(count - 1);
      setVote(vote - 1);

      throw error;
    } finally {
      setLoading(false);
    }
  };

  let buttonStyle = "bg-blue-500 text-white rounded m-1 px-3 py-1";

  if (disabled) {
    buttonStyle += " bg-blue-300";
  }

  return (
    <div className="w-full px-2 py-2 my-5">
      <div className="text-center text-xl">
        <button
          onClick={async () => {
            if (!myName) {
              alert("請輸入你的名字");

              return;
            }

            if (count >= 3) {
              alert("不能投票超過三次");

              return;
            }

            plus();
          }}
          disabled={loading || disabled}
          className={buttonStyle}
        >
          {loading && (
            <svg
              className="animate-spin h-5 w-5 mr-3 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {loading || "選這個"}
        </button>
        <span>{vote}</span>
        {/* <button
          onClick={() => {
            alert("不能減少");
            //setCount(count - 1);
          }}
          className={buttonStyle}
        >
          -
        </button> */}
      </div>
      <div className="text-center text-xl">{title}</div>
      <ImageLoader src={src}></ImageLoader>
    </div>
  );
}
