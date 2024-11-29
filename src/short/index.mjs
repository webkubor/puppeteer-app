import puppeteer from "puppeteer";

async function captureScreenshot(url, outputFilePath) {
  try {
    printColor("开始启动.......", 32); 
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    printColor("等待页面加载完毕.......", 32);
    await page.goto(url, { waitUntil: 'networkidle0' }); // 等待页面加载完成

    printColor("获取网站完整页面中.......", 32);

    // 等待页面上的某些关键元素加载完成
    await page.waitForSelector('body');  // 确保页面的主体部分已经渲染完毕

    // 获取页面的整个高度和宽度
    const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

    // 设置视口大小和截图尺寸
    await page.setViewport({ width: bodyWidth, height: bodyHeight });  // 动态设置视口宽度和高度

    // 截图并保存
    await page.screenshot({ path: outputFilePath, fullPage: true });

    printColor("截图已成功保存!", 32);

    await browser.close();
  } catch (error) {
    console.error("截图过程中出现错误:", error);
  }
}

const url = 'https://idpaydesk2.brcashypro.com/views/pay.html?PAYIN8547138967510269952';
const outPath = 'short/screenshot/' + getMainDomain(url) + '.png';

captureScreenshot(url, outPath);

function getMainDomain(url) {
  const parsedUrl = new URL(url);
  return parsedUrl.hostname;
}

function printColor(text, color) {
  const colorCode = `\u001b[${color}m`;
  const textCode = `${text}\u001b[0m`;
  console.log(`${colorCode}${textCode}`);
}
