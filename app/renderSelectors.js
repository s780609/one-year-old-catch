"use client";

import { useState, useEffect } from "react";
import { Selector } from "./components/Selector";
import { useRouter } from "next/navigation";
import { ImageLoader } from "./components/ImageLoader";
import toast, { Toaster } from "react-hot-toast";

import image001 from "./assets/001.jpg";
import 手槍 from "./assets/手槍.jpg";
import 三角尺 from "./assets/三角尺.jpg";
import 黑板 from "./assets/黑板.jpg";
import 鎚子 from "./assets/鎚子.jpg";
import 書 from "./assets/書.jpg";
import 鍵盤 from "./assets/鍵盤.jpg";
import 阿公阿嬤的禮物 from "./assets/阿公阿嬤的禮物.jpg";
import 麥克風 from "./assets/麥克風.jpg";
import 算盤 from "./assets/算盤.jpg";
import 板手 from "./assets/板手.jpg";
import 場記板 from "./assets/場記板.jpg";
import 博士帽 from "./assets/博士帽.jpg";
import 急救箱 from "./assets/急救箱.jpg";
import 廚師帽 from "./assets/廚師帽.jpg";
import 樂器 from "./assets/樂器.jpg";
import 飛機 from "./assets/飛機.jpg";
import 相機 from "./assets/相機.jpg";
import 調色盤 from "./assets/調色盤.jpg";
import 特斯拉 from "./assets/特斯拉.jpg";
import Vtuber from "./assets/Vtuber.png";

export default function RenderSelectors({ items, pages }) {
  const router = useRouter();

  const [myName, setMyName] = useState();
  const [count, setCount] = useState(0);
  const [nameCheck, setNameCheck] = useState(false);

  useEffect(() => {
    if (count >= 3) {
      toast("選完囉，來看結果吧", {
        icon: "🍺",
        style: {
          borderRadius: "10px",
          background: "#f0e0be",
        },
      });

      setTimeout(() => {
        router.push("/result", { scroll: false });
      }, 1.5 * 1000);
    }
  }, [count]);

  return (
    <>
      <Toaster></Toaster>
      {count >= 3 && (
        <>
          <div className="text-center">
            <button
              onClick={() => {
                router.push("/result", { scroll: false });
              }}
              className="bg-green-500 text-white text-3xl rounded py-1 px-2 my-2"
            >
              去看結果
            </button>
          </div>
        </>
      )}
      {nameCheck || (
        <div className="flex flex-col h-full text-center text-3xl my-2">
          <div>🚂🚀🍺🍕🧱🔨⚒️🧙🚓⛴️🛋️🛏️⛱️❄️🔥🌈</div>
          <div>欣予抓周猜猜看</div>
          <div>投票選你猜的欣予會抓的目標，每人三票</div>
          <div>投票前，先告訴我你是誰</div>
          <div>
            <input
              className="border-2 w-full md:w-1/2"
              placeholder="輸入你的名字或稱謂"
              defaultValue={myName}
              onChange={(e) => setMyName(e.target.value)}
            ></input>
          </div>
          <div>
            <button
              onClick={() => {
                setNameCheck(true);
              }}
              className="bg-blue-500 text-white rounded py-1 px-2 my-2"
            >
              確定
            </button>
          </div>
          <div className="flex justify-center w-full">
            <div className="md:w-1/3 w-5/6">
              <ImageLoader src={image001}></ImageLoader>
            </div>
          </div>
        </div>
      )}
      {nameCheck && (
        <div className="grid md:grid-cols-10 grid-cols-2">
          <Selector
            myName={myName}
            src={手槍}
            data={pages.results[0]}
            title={items[0]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={三角尺}
            data={pages.results[0]}
            title={items[1]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={黑板}
            data={pages.results[0]}
            title={items[2]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={鎚子}
            data={pages.results[0]}
            title={items[3]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={書}
            data={pages.results[0]}
            title={items[4]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={鍵盤}
            data={pages.results[0]}
            title={items[5]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={阿公阿嬤的禮物}
            data={pages.results[0]}
            title={items[6]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={麥克風}
            data={pages.results[0]}
            title={items[7]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={算盤}
            data={pages.results[0]}
            title={items[8]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={板手}
            data={pages.results[0]}
            title={items[9]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={場記板}
            data={pages.results[0]}
            title={items[10]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={博士帽}
            data={pages.results[0]}
            title={items[11]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={急救箱}
            data={pages.results[0]}
            title={items[12]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={廚師帽}
            data={pages.results[0]}
            title={items[13]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={樂器}
            data={pages.results[0]}
            title={items[14]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={飛機}
            data={pages.results[0]}
            title={items[15]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={相機}
            data={pages.results[0]}
            title={items[16]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={調色盤}
            data={pages.results[0]}
            title={items[17]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={特斯拉}
            data={pages.results[0]}
            title={items[18]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={Vtuber}
            data={pages.results[0]}
            title={items[19]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
        </div>
      )}
    </>
  );
}
