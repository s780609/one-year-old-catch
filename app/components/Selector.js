"use client";

import { useState, useEffect } from "react";
import { ImageLoader } from "./ImageLoader";
import axios from "axios";

export function Selector({ result, myName, src, onClick }) {
  const [count, setCount] = useState(0);

  const plus = async () => {
    let plaiText = result.properties.Frame.rich_text[0].plain_text;

    console.log(result.properties.Frame.rich_text);

    if (!plaiText) {
      plaiText = "";
    }

    try {
      // Make a POST request to the Notion API to update the database
      const response = await axios.patch(
        `/api`,
        {
          pageId: result.id,
          text: plaiText + "," + myName,
        },
        {
          headers: {},
        }
      );

      // Handle the response
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  let title = "NO TITLE";

  if (result && result.properties.Name.title[0]) {
    title = result.properties.Name.title[0]?.plain_text;
  }

  const buttonStyle = "bg-blue-500 text-white rounded m-1 px-3 py-1";

  return (
    <div className="w-full px-2 py-2 my-5">
      <div className="text-center text-xl">
        <button
          onClick={() => {
            plus();
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
