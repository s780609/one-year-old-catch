"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function ChosenResult() {
  const [voteResult, setVoteResult] = useState();
  const [voteResultRender, setVoteResultRender] = useState([
    { name: "", order: "" },
  ]);

  useEffect(() => {
    getChosenResult();
  }, []);

  const getChosenResult = async () => {
    try {
      const response = await axios.get(`/api`);

      const data = response.data;

      let newVoteResult = {};

      for (let index = 0; index < data.results.length; index++) {
        const tempResult = data.results[index];
        const tempProps = tempResult.properties;
        if (tempProps.Name.title[0].plain_text === "選擇結果") {
          newVoteResult = tempResult;
        }
      }

      setVoteResult(newVoteResult);

      const porps = newVoteResult.properties;

      let tempVoteResultRender = [];
      var propsKeyName = Object.keys(porps);

      for (let index = 0; index < propsKeyName.length; index++) {
        const keyName = propsKeyName[index];

        if (
          porps[keyName].rich_text &&
          porps[keyName].rich_text.length > 0 &&
          porps[keyName].rich_text[0]?.plain_text
        ) {
          tempVoteResultRender.push({
            name: keyName,
            order: porps[keyName].rich_text[0].plain_text,
          });
        }
      }

      tempVoteResultRender.sort((a, b) => {
        return a.order - b.order;
      });

      setVoteResultRender(tempVoteResultRender);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center text-center">
        <div className="text-2xl">欣予選擇結果</div>
        {voteResultRender.map((item, index) => {
          return (
            <div key={index} className="text-2xl">
              {item.order}. {item.name}
            </div>
          );
        })}
        {/* 📌 這裡用註解紀錄一下 免得以後notion database消失 */}
        {/* <div className="text-2xl">1. 鍵盤</div>
        <div className="text-2xl">2. 算盤</div>
        <div className="text-2xl">3. 麥克風</div>
        <div className="text-2xl">4. Vtuber</div>
        <div className="text-2xl">5. 阿公阿嬤的禮物</div> */}
      </div>
    </>
  );
}
