const puppeteer = require('puppeteer');

async function captureScreenshot(url, outputFilePath) {
  const browser = await puppeteer.launch({headless: true});
  printColor("开始启动.......", 32); 

  const page = await browser.newPage();
  printColor("等待页面加载完毕.......", 32); 


  await page.goto(url, { waitUntil: 'networkidle0' }); // 等待页面加载完成

  printColor("获取网站完整页面中.......", 32); 


  // 获取页面的整个高度和宽度
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  // const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

  // 设置视口大小和截图尺寸
  await page.setViewport({ width: 1366, height: bodyHeight });
  await page.screenshot({ path: outputFilePath, fullPage: true });

  await browser.close();
}
const url = 'https://www.yuque.com/webkubor';


const outPath = 'screenshot/' + getMainDomain(url) + '.png';

captureScreenshot(url, outPath)
  .then(() => console.log('Screenshot captured'))
  .catch(error => console.error(error));


  
function getMainDomain(url) {
 const parsedUrl = new URL(url);
 return parsedUrl.hostname.replace(/\./g, '.');
}


function printColor(text, color) {
  const colorCode = `\u001b[${color}m`;
  const textCode = `${text}\u001b[0m`;
  process.stdout.write(`${colorCode}${textCode}\n`);
 }