// 获取网页截图
const puppeteer = require('puppeteer');
puppeteer.launch().then(async browser => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 }); // PC端
  console.log('开始前往网站....')
  await page.goto('http://web-kubor.gitee.io/kubor', {
    timeout: 0 //传0则为无限等待，直到加载渲染完毕
  });
  /** 
   * screenshot
   * path 路径
   * fullPage 全部图片
   * omitBackground 不允许透明截图
    */
   console.log('网站渲染完毕....')
  await page.screenshot({path: 'screenshot.png',fullPage: true, omitBackground:false});
  await browser.close();
});
