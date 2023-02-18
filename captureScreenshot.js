const puppeteer = require('puppeteer');

async function captureScreenshot(url, outputFilePath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle0' }); // 等待页面加载完成

  // 获取页面的整个高度和宽度
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);

  // 设置视口大小和截图尺寸
  await page.setViewport({ width: bodyWidth, height: bodyHeight });
  await page.screenshot({ path: outputFilePath, fullPage: true });

  await browser.close();
}

captureScreenshot('https://www.example.com', 'example.png')
  .then(() => console.log('Screenshot captured'))
  .catch(error => console.error(error));
