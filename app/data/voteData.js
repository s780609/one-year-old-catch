import 秧予1 from "../assets/秧予/秧予_IMG_1937.jpeg";
import 秧予3 from "../assets/秧予/秧予_IMG_2032.jpeg";
import 秧予5 from "../assets/秧予/秧予_IMG_2034.jpeg";
import 秧予6 from "../assets/秧予/秧予_IMG_1499.jpeg";
import 秧予7 from "../assets/秧予/秧予_IMG_1928.jpeg";
import 秧予9 from "../assets/秧予/秧予_IMG_1966.jpeg";
import 秧予10 from "../assets/秧予/秧予_IMG_2047.jpeg";
import 秧予11 from "../assets/秧予/秧予_IMG_0999.jpg";
import 秧予12 from "../assets/秧予/秧予_IMG_1799.jpeg";
import 秧予13 from "../assets/秧予/秧予_IMG_1885.jpeg";
import 手槍 from "../assets/手槍.jpg";
import 三角尺 from "../assets/三角尺.jpg";
import 黑板 from "../assets/黑板.jpg";
import 鎚子 from "../assets/鎚子.jpg";
import 書 from "../assets/書.jpg";
import 鍵盤 from "../assets/鍵盤.jpg";
import 阿公阿嬤的禮物 from "../assets/阿公阿嬤的禮物.jpg";
import 麥克風 from "../assets/麥克風.jpg";
import 算盤 from "../assets/算盤.jpg";
import 板手 from "../assets/板手.jpg";
import 場記板 from "../assets/場記板.jpg";
import 博士帽 from "../assets/博士帽.jpg";
import 急救箱 from "../assets/急救箱.jpg";
import 廚師帽 from "../assets/廚師帽.jpg";
import 樂器 from "../assets/樂器.jpg";
import 飛機 from "../assets/飛機.jpg";
import 相機 from "../assets/相機.jpg";
import 調色盤 from "../assets/調色盤.jpg";
import 特斯拉Img from "../assets/特斯拉.jpg";
import VtuberImg from "../assets/Vtuber.jpg";
export const imageMap = {
  手槍, 三角尺, 黑板, 鎚子, 書,
  鍵盤, 阿公阿嬤的禮物, 麥克風, 算盤, 板手,
  場記板, 博士帽, 急救箱, 廚師帽, 樂器,
  飛機, 相機, 調色盤, 特斯拉: "/投票物件/特斯拉.mp4", Vtuber: "/投票物件/Vtuber.mp4",
};

// AI 圖片生成用的靜態圖（特斯拉、Vtuber 投票用 mp4，但 AI 生成需要 jpg）
export const aiImageMap = {
  ...imageMap,
  特斯拉: 特斯拉Img,
  Vtuber: VtuberImg,
};

export const familyNames = [
  "五股阿公", "五股阿嬤", "北投阿公", "北投阿嬤",
  "乾阿公", "乾阿嬤", "小榆姑姑", "小莆叔叔",
  "彥廷舅舅", "大姑婆", "小姑婆", "姨婆",
  "大叔公", "大嬸婆", "大欣欣姑姑", "昉昉姑姑",
  "阿暐叔叔", "美麗姑姑", "培涓阿北", "洋溢阿北",
  "惠瑩姑姑", "玉嬋姑姑", "自強阿北", "瑩芳姑姑",
  "曉茹阿姆", "涵涵姑姑", "雯雯姑姑", "依晨姊姊",
  "彤彤姊姊",
];

export const carouselItems = [
  { type: "video", src: "/秧予/秧予_吃1.mp4" },
  { type: "video", src: "/秧予/秧予_吃2.mp4" },
  { type: "video", src: "/秧予/秧予_公園1.mp4" },
  { type: "video", src: "/秧予/秧予_公園2.mp4" },
  { type: "image", src: 秧予11 },
  { type: "image", src: 秧予12 },
  { type: "image", src: 秧予13 },
  { type: "image", src: 秧予1 },
  { type: "image", src: 秧予3 },
  { type: "image", src: 秧予5 },
  { type: "image", src: 秧予6 },
  { type: "image", src: 秧予7 },
  { type: "image", src: 秧予9 },
  { type: "image", src: 秧予10 },
];
