"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import ResultBlock from "../components/ResultBlock";

export default function RenderResultBlock({ pages }) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.refresh();
    }, 3000);
  });

  return (
    <>
      <ResultBlock data={pages.results[0]} title={"急救箱"}></ResultBlock>
      <ResultBlock data={pages.results[0]} title={"算盤"}></ResultBlock>
      <ResultBlock data={pages.results[0]} title={"相機"}></ResultBlock>
      <ResultBlock data={pages.results[0]} title={"十萬元大紅包"}></ResultBlock>
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
      <ResultBlock data={pages.results[0]} title={"未知"}></ResultBlock>
    </>
  );
}
