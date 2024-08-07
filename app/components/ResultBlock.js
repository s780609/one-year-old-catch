"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function ResultBlock({ data, title }) {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      router.refresh();
    }, 1000);
  });

  let results = ["NO results"];

  if (data && data.properties[title]) {
    results = data.properties[title].rich_text[0]?.plain_text;
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
  }

  const renderResult = (results) => {
    return results.map((result, index) => {
      const className = getClassName(index);

      var render = [];
      for (let i = 0; i < result.count; i++) {
        render.push(
          <>
            <span key={index + "_" + result.count} className={className}>
              {result.name}
            </span>{" "}
          </>
        );
      }

      return <>{render}</>;
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
