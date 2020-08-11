// 获取网页截图
const puppeteer = require('puppeteer');
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  console.log('获取网页中..........')
  await page.goto('https://web-kubor.gitee.io/resume', {
    timeout: 0 //传0则为无限等待，直到加载渲染完毕
  });
  /** 
   * screenshot
   * path 路径
   * fullPage 全部图片
   * omitBackground 不允许透明截图
    */
  console.log('图片捕获中..........')
  await page.screenshot({path: 'screenshot.png',fullPage: true, omitBackground:false});
  await browser.close();
});
