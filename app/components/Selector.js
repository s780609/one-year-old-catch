"use client";

import { useState, useEffect } from "react";
import { ImageLoader } from "./ImageLoader";
import axios from "axios";

export function Selector({ data, myName, src, title, count, setCount }) {
  const [pageData, setPageData] = useState(data);
  const [vote, setVote] = useState(0);

  const plus = async () => {
    if (!pageData) {
      return;
    }

    let plaiText = pageData.properties[title].rich_text[0]?.plain_text;

    let newText = plaiText + "," + myName;
    if (!plaiText) {
      newText = myName;
    }

    try {
      const response = await axios.patch(
        `/api`,
        {
          pageId: pageData.id,
          propName: title,
          text: newText,
        },
        {
          headers: {},
        }
      );

      setPageData(response.data.result);
    } catch (error) {
      console.error(error);
    }
  };

  const buttonStyle = "bg-blue-500 text-white rounded m-1 px-3 py-1";

  return (
    <div className="w-full px-2 py-2 my-5">
      <div className="text-center text-xl">
        <button
          onClick={() => {
            if (!myName) {
              alert("請輸入你的名字");

              return;
            }

            if (count >= 3) {
              alert("不能投票超過三次");

              return;
            }

            plus();
            setCount(count + 1);
            setVote(vote + 1);
          }}
          className={buttonStyle}
        >
          +
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
