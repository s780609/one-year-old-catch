"use client";

import ResultBlock from "../components/ResultBlock";
import axios from "axios";
import { useState, useEffect } from "react";

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
          <ResultBlock data={pages.results[0]} title={"急救箱"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"算盤"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"相機"}></ResultBlock>
          <ResultBlock
            data={pages.results[0]}
            title={"阿公阿嬤的禮物"}
          ></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"鎚子"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"樂器"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"鍵盤"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"飛機"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"書"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"麥克風"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"調色盤"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"廚師帽"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"手槍"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"板手"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"博士帽"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"場記板"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"黑板"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"三角尺"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"特斯拉"}></ResultBlock>
          <ResultBlock data={pages.results[0]} title={"Vtuber"}></ResultBlock>
        </div>
      )}
    </>
  );
}
