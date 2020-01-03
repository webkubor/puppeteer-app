// 获取网页截图
const puppeteer = require('puppeteer');
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.goto('http://localhost:4000/post/hello/');
  /** 
   * screenshot
   * path 路径
   * fullPage 全部图片
   * omitBackground 不允许透明截图
    */
  await page.screenshot({path: 'screenshot.png',fullPage: true, omitBackground:false});
  await browser.close();
});
