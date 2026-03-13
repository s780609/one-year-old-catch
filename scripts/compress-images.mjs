import sharp from "sharp";
import fs from "fs";
import path from "path";

const ASSETS_DIR = path.resolve("app/assets");
const MAX_WIDTH = 800;   // 最大寬度
const QUALITY = 80;      // JPEG 品質 (1-100)

const files = fs.readdirSync(ASSETS_DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

console.log(`找到 ${files.length} 張圖片，開始壓縮...\n`);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const filePath = path.join(ASSETS_DIR, file);
  const stat = fs.statSync(filePath);
  const beforeKB = (stat.size / 1024).toFixed(0);
  totalBefore += stat.size;

  const image = sharp(filePath);
  const metadata = await image.metadata();

  // 只有寬度超過 MAX_WIDTH 才縮小
  const resizeOpts = metadata.width > MAX_WIDTH ? { width: MAX_WIDTH } : {};

  const tmpPath = filePath + ".tmp";
  await image
    .resize(resizeOpts)
    .jpeg({ quality: QUALITY, mozjpeg: true })
    .toFile(tmpPath);

  const afterStat = fs.statSync(tmpPath);
  totalAfter += afterStat.size;
  const afterKB = (afterStat.size / 1024).toFixed(0);
  const ratio = ((1 - afterStat.size / stat.size) * 100).toFixed(0);

  fs.unlinkSync(filePath);
  fs.renameSync(tmpPath, filePath);
  console.log(`  ${file.padEnd(25)} ${beforeKB}KB → ${afterKB}KB  (-${ratio}%)`);
}

console.log(`\n✅ 完成！`);
console.log(`   壓縮前: ${(totalBefore / 1024 / 1024).toFixed(1)} MB`);
console.log(`   壓縮後: ${(totalAfter / 1024 / 1024).toFixed(1)} MB`);
console.log(`   節省:   ${((1 - totalAfter / totalBefore) * 100).toFixed(0)}%`);
