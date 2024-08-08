"use client";

import ResultBlock from "../components/ResultBlock";
import axios from "axios";
import { useState, useEffect } from "react";

import 手槍 from "../assets/手槍.jpg";
import 三角尺 from "../assets/三角尺.jpg";
import 黑板 from "../assets/黑板.jpg";
import 鎚子 from "../assets/鎚子.jpg";
import 書 from "../assets/書.jpg";
import 鍵盤 from "../assets/鍵盤.jpg";
import 阿公阿嬤的禮物 from "../assets/阿公阿嬤的禮物.jpg";
import 麥克風 from "../assets/麥克風.jpg";
import 算盤 from "../assets/算盤.jpg";
import 板手 from "../assets/板手.jpg";
import 場記板 from "../assets/場記板.jpg";
import 博士帽 from "../assets/博士帽.jpg";
import 急救箱 from "../assets/急救箱.jpg";
import 廚師帽 from "../assets/廚師帽.jpg";
import 樂器 from "../assets/樂器.jpg";
import 飛機 from "../assets/飛機.jpg";
import 相機 from "../assets/相機.jpg";
import 調色盤 from "../assets/調色盤.jpg";
import 特斯拉 from "../assets/特斯拉.jpg";
import Vtuber from "../assets/Vtuber.jpg";

export default function Result() {
  const [pages, setPages] = useState();

  useEffect(() => {
    getPages();

    const intervalId = setInterval(() => {
      getPages();
    }, 5 * 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const getPages = async () => {
    try {
      const response = await axios.get(`/api`);

      setPages(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      {pages && (
        <div className="grid md:grid-cols-10 grid-cols-2">
          <ResultBlock
            data={pages.results[0]}
            title={"急救箱"}
            imageSrc={急救箱}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"算盤"}
            imageSrc={算盤}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"相機"}
            imageSrc={相機}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"阿公阿嬤的禮物"}
            imageSrc={阿公阿嬤的禮物}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"鎚子"}
            imageSrc={鎚子}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"樂器"}
            imageSrc={樂器}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"鍵盤"}
            imageSrc={鍵盤}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"飛機"}
            imageSrc={飛機}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"書"}
            imageSrc={書}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"麥克風"}
            imageSrc={麥克風}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"調色盤"}
            imageSrc={調色盤}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"廚師帽"}
            imageSrc={廚師帽}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"手槍"}
            imageSrc={手槍}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"板手"}
            imageSrc={板手}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"博士帽"}
            imageSrc={博士帽}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"場記板"}
            imageSrc={場記板}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"黑板"}
            imageSrc={黑板}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"三角尺"}
            imageSrc={三角尺}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"特斯拉"}
            imageSrc={特斯拉}
          ></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"Vtuber"}
            imageSrc={Vtuber}
          ></ResultBlock>
        </div>
      )}
    </>
  );
}
