const puppeteer = require('puppeteer');

async function captureScreenshot(url, outputFilePath) {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' }); // 等待页面加载完成

  // 获取页面的整个高度和宽度
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  // const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

  // 设置视口大小和截图尺寸
  await page.setViewport({ width: 1366, height: bodyHeight });
  await page.screenshot({ path: outputFilePath, fullPage: true });

  await browser.close();
}
const url = 'https://www.yuque.com/webkubor';

captureScreenshot(url, 'screenshot/yuque.png')
  .then(() => console.log('Screenshot captured'))
  .catch(error => console.error(error));
