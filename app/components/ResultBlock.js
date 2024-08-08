export default function ResultBlock({ data, title }) {
  let results = ["No results"];
  let voteResult = 0;

  if (data && data.properties[title]) {
    results = data.properties[title].rich_text[0]?.plain_text;
    results = results?.split(",");

    voteResult = results?.length ?? 0;

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
          <span key={result.count + Math.random()} className={className}>
            {result.name}{" "}
          </span>
        );
      }

      return <span key={index + "_" + result.count}>{render}</span>;
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
      return "bg-orange-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 4) {
      return "bg-indigo-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 5) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 6) {
      return "bg-blue-700 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 7) {
      return "bg-blue-800 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 8) {
      return "bg-blue-900 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 9) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 10) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
    if (index === 11) {
      return "bg-blue-500 text-white rounded py-1 px-1 ml-1 mb-1 inline-block";
    }
  };

  return (
    <>
      <div className="w-full px-2 py-2 my-5">
        <div className="text-center text-xl bg-blue-200">
          得票數: {voteResult}
        </div>
        <div className="text-center text-xl text-white bg-blue-500">
          {title}
        </div>
        <div className="w-full border-2 min-h-60 text-wrap">
          {Array.isArray(results) && renderResult(results)}
        </div>
      </div>
    </>
  );
}
