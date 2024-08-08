"use client";

import { useState, useEffect } from "react";
import { Selector } from "./components/Selector";
import image001 from "./assets/001.jpg";
import { useRouter } from "next/navigation";
import { ImageLoader } from "./components/ImageLoader";
import toast, { Toaster } from "react-hot-toast";

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
            src={image001}
            data={pages.results[0]}
            title={items[0]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[1]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[2]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[3]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[4]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[5]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[6]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[7]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[8]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[9]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[10]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[11]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[12]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[13]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[14]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[15]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[16]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[17]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
            data={pages.results[0]}
            title={items[18]}
            count={count}
            setCount={setCount}
            diabled={count >= 3}
          ></Selector>
          <Selector
            myName={myName}
            src={image001}
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
