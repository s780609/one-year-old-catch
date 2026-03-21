// 每個物件對應的「長大後職業/場景」描述
// 用於生成 AI 圖片的 prompt 中動態替換
const itemFutureMap = {
  手槍: {
    item: "手槍",
    futureOutfit: "帥氣的女警制服",
    futureScene: "在警察局裡自信地站崗，桌上有警徽、對講機",
    futureJob: "女警",
  },
  三角尺: {
    item: "三角尺",
    futureOutfit: "時髦設計師服裝",
    futureScene: "在明亮工作室拿著相同三角尺開心畫建築藍圖，桌上堆滿設計圖、模型、咖啡杯",
    futureJob: "建築設計師",
  },
  黑板: {
    item: "黑板",
    futureOutfit: "知性的教師套裝",
    futureScene: "在明亮教室裡站在黑板前開心教書，黑板上寫滿公式，桌上有書本、蘋果",
    futureJob: "老師",
  },
  鎚子: {
    item: "鎚子",
    futureOutfit: "專業的工程師安全帽與工作服",
    futureScene: "在大型建築工地自信地拿著鎚子指揮施工，背景有起重機和藍圖",
    futureJob: "工程師",
  },
  書: {
    item: "書",
    futureOutfit: "優雅的學者服裝",
    futureScene: "在古典圖書館裡被滿牆書籍環繞，手捧書本開心閱讀，桌上有筆記本、眼鏡",
    futureJob: "學者作家",
  },
  鍵盤: {
    item: "鍵盤",
    futureOutfit: "潮流科技公司的休閒穿搭",
    futureScene: "在超酷的科技辦公室裡敲打鍵盤寫程式，螢幕上顯示程式碼，桌上有咖啡、公仔",
    futureJob: "軟體工程師",
  },
  阿公阿嬤的禮物: {
    item: "阿公阿嬤的禮物",
    futureOutfit: "溫暖居家服裝",
    futureScene: "在溫馨的家裡陪伴家人，客廳充滿歡笑，桌上有家庭相框、茶具",
    futureJob: "幸福的家庭守護者",
  },
  麥克風: {
    item: "麥克風",
    futureOutfit: "閃亮的舞台表演服",
    futureScene: "在璀璨的演唱會舞台上拿著麥克風熱情演唱，背景有彩色燈光、歡呼的觀眾",
    futureJob: "歌手",
  },
  算盤: {
    item: "算盤",
    futureOutfit: "專業的會計師西裝",
    futureScene: "在高級辦公室裡自信地分析財務報表，桌上有計算機、文件、算盤",
    futureJob: "會計師",
  },
  板手: {
    item: "板手",
    futureOutfit: "專業的機械工程師工作服",
    futureScene: "在高科技車廠裡拿著板手修理超跑引擎，周圍有各種工具和零件",
    futureJob: "機械工程師",
  },
  場記板: {
    item: "場記板",
    futureOutfit: "時尚的導演裝扮，戴著貝雷帽",
    futureScene: "在電影片場拿著場記板喊 Action，背景有攝影機、燈光、演員",
    futureJob: "電影導演",
  },
  博士帽: {
    item: "博士帽",
    futureOutfit: "學術博士袍與博士帽",
    futureScene: "在大學畢業典禮上開心地拋博士帽，背景有校園建築、同學歡呼",
    futureJob: "博士學者",
  },
  急救箱: {
    item: "急救箱",
    futureOutfit: "白色醫師袍，掛著聽診器",
    futureScene: "在明亮的醫院裡溫柔地照顧病人，桌上有急救箱、醫療器材",
    futureJob: "醫生",
  },
  廚師帽: {
    item: "廚師帽",
    futureOutfit: "專業的主廚服裝與廚師帽",
    futureScene: "在高級餐廳廚房裡開心地烹飪美食，桌上有精緻料理、食材、鍋具",
    futureJob: "主廚",
  },
  樂器: {
    item: "樂器",
    futureOutfit: "優雅的演奏會禮服",
    futureScene: "在金碧輝煌的音樂廳舞台上優雅地演奏樂器，背景有交響樂團、觀眾",
    futureJob: "音樂家",
  },
  飛機: {
    item: "飛機",
    futureOutfit: "帥氣的機長制服與機長帽",
    futureScene: "在飛機駕駛艙裡自信地操控飛機，窗外是美麗的雲海和藍天",
    futureJob: "機長",
  },
  相機: {
    item: "相機",
    futureOutfit: "文青風格的攝影師穿搭",
    futureScene: "在美麗的戶外風景中拿著專業相機拍照，背景有夕陽、山景",
    futureJob: "攝影師",
  },
  調色盤: {
    item: "調色盤",
    futureOutfit: "充滿藝術氣息的畫家服裝",
    futureScene: "在陽光明媚的畫室裡拿著調色盤和畫筆創作，周圍有畫布、顏料、藝術品",
    futureJob: "畫家",
  },
  特斯拉: {
    item: "特斯拉",
    futureOutfit: "科技CEO的俐落穿搭",
    futureScene: "在未來感的科技公司總部前站在特斯拉旁，背景有火箭、太陽能板",
    futureJob: "科技CEO",
  },
  Vtuber: {
    item: "Vtuber角色模型",
    futureOutfit: "可愛的Vtuber虛擬偶像服裝",
    futureScene: "在炫酷的直播間裡開心地對著鏡頭直播，螢幕上有彈幕、粉絲留言、可愛貼圖",
    futureJob: "超人氣Vtuber",
  },
};

export function buildPrompt(itemName) {
  const info = itemFutureMap[itemName];
  if (!info) return null;

  return `使用第一張上傳的照片作為1歲秧予的精確臉部、五官、表情、整體可愛外貌參考（必須高度相似，寶寶特徵保留）。使用第二張上傳的照片作為細節參考。生成一張超可愛Q版（chibi）動畫風格抓週派對照片：1歲小秧予坐在傳統紅色抓週毯中央，胖嘟嘟開心笑著用小手抓起那個${info.item}（物品完全一樣），周圍散落其他抓週物品（筆、算盤、書、玩具等）、彩色氣球、綵帶、小蛋糕、喜氣氛圍。右上方或上方有大大的夢幻粉色/藍色泡泡，泡泡裡顯示長大後的Q版秧予（約22歲，可愛自信的年輕女性，臉部與寶寶高度相似但自然長大，大眼睛甜美笑容），她穿著${info.futureOutfit}，${info.futureScene}。整體風格：日式Q版可愛動畫、明亮色彩、圓潤線條、超萌表情、溫馨喜慶、夢幻未來感，highly detailed, vibrant colors, chibi anime style, adorable, joyful atmosphere, professional digital illustration, 8k quality。`;
}
