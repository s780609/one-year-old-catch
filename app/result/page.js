import Notion from "../notion";
import { ResultBlock } from "../components/ResultBlock";

export default function Result() {
  let arr = [];
  for (let i = 0; i <= 18; i++) {
    arr.push(i);
  }

  return (
    <>
      <Notion></Notion>
      <div className="grid grid-cols-8">
        {arr.map((index) => {
          return <ResultBlock key={index} index={index}></ResultBlock>;
        })}
        {/* <ResultBlock title={"急救箱"}></ResultBlock>
        <ResultBlock title={"算盤"}></ResultBlock>
        <ResultBlock title={"相機"}></ResultBlock>
        <ResultBlock title={"金幣"}></ResultBlock>
        <ResultBlock title={"鎚子"}></ResultBlock>
        <ResultBlock title={"樂器"}></ResultBlock>
        <ResultBlock title={"鍵盤"}></ResultBlock>
        <ResultBlock title={"飛機"}></ResultBlock>
        <ResultBlock title={"書"}></ResultBlock>
        <ResultBlock title={"麥克風"}></ResultBlock>
        <ResultBlock title={"調色盤"}></ResultBlock>
        <ResultBlock title={"廚師帽"}></ResultBlock>
        <ResultBlock title={"手槍"}></ResultBlock>
        <ResultBlock title={"板手"}></ResultBlock>
        <ResultBlock title={"博士帽"}></ResultBlock>
        <ResultBlock title={"場記板"}></ResultBlock>
        <ResultBlock title={"黑板"}></ResultBlock>
        <ResultBlock title={"三角尺"}></ResultBlock> */}
      </div>
    </>
  );
}
