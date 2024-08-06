import { Client } from "@notionhq/client";

import image001 from "./assets/001.jpg";
import { Selector } from "./components/Selector";
import UpdateNotion from "./components/UpdateNotion";

export default async function Home() {
  const myName = "myName";

  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  //console.log("pages ===> ", pages.results[0].id);

  return (
    <main className="">
      <UpdateNotion></UpdateNotion>
      <div className="grid grid-cols-8">
        {pages.results.map((page, index) => {
          return (
            <Selector
              key={index}
              result={pages.results[index]}
              myName={myName}
              src={image001}
            ></Selector>
          );
        })}
        {/* <Selector
          result={pages.results[0]}
          myName={myName}
          src={image001}
        ></Selector>
        <Selector src={image001} title={"算盤"}></Selector>
        <Selector src={image001} title={"相機"}></Selector>
        <Selector src={image001} title={"金幣"}></Selector>
        <Selector src={image001} title={"鎚子"}></Selector>
        <Selector src={image001} title={"樂器"}></Selector>
        <Selector src={image001} title={"鍵盤"}></Selector>
        <Selector src={image001} title={"飛機"}></Selector>
        <Selector src={image001} title={"書"}></Selector>
        <Selector src={image001} title={"麥克風"}></Selector>
        <Selector src={image001} title={"調色盤"}></Selector>
        <Selector src={image001} title={"廚師帽"}></Selector>
        <Selector src={image001} title={"手槍"}></Selector>
        <Selector src={image001} title={"板手"}></Selector>
        <Selector src={image001} title={"博士帽"}></Selector>
        <Selector src={image001} title={"場記板"}></Selector>
        <Selector src={image001} title={"黑板"}></Selector>
        <Selector src={image001} title={"三角尺"}></Selector> */}
      </div>
    </main>
  );
}
