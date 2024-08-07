import "server-only";

import { Client } from "@notionhq/client";

export async function ResultBlock({ index, title }) {
  const notion = new Client({ auth: process.env.NOTION_TOKEN });
  const pages = await notion.databases.query({
    database_id: process.env.NOTION_DATABASE_ID,
  });

  let results = ["NO results"];

  if (pages.results[0] && pages.results[0].properties[title]) {
    results = pages.results[0].properties[title].rich_text[0]?.plain_text;
    results = results?.split(",");
    if (Array.isArray(results)) {
      results = results.reduce((prev, curr, index) => {
        prev = prev || [];

        if (prev.find((item) => item.name === curr) === undefined) {
          prev.push({ name: curr, count: 1 });
        } else {
          prev.find((item) => item.name === curr).count++;
        }

        return prev;
      }, []);
    }
    //console.log("results ===> ", results);
  }

  const renderResult = (results) => {
    return results.map((result, index) => {
      const className = getClassName(index);

      var render = [];
      for (let i = 0; i < result.count; i++) {
        render.push(
          <>
            <span className={className}>{result.name}</span>{" "}
          </>
        );
      }

      return <>{render}</>;

      // let className = `bg-sky-${index + 5}00`;
      // className += " px-2 py-1 rounded m-1";

      // return (
      //   <>
      //     <span key={index} className={className}>
      //       {result}
      //     </span>{" "}
      //   </>
      // );
    });
  };

  const getClassName = (index) => {
    if (index === 0) {
      return "bg-sky-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 1) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 2) {
      return "bg-violet-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 3) {
      return "bg-orange-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 4) {
      return "bg-indigo-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 5) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 6) {
      return "bg-blue-700 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 7) {
      return "bg-blue-800 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 8) {
      return "bg-blue-900 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 9) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 10) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
    if (index === 11) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1";
    }
  };

  return (
    <>
      <div className="w-full px-2 py-2 my-5">
        <div className="text-center text-xl bg-blue-400">{title}</div>
        <div className="w-full border-2 min-h-60 text-wrap">
          {Array.isArray(results) && renderResult(results)}
        </div>
      </div>
    </>
  );
}
