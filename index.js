const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.launch({headless: false, devtools: true}) 
  const page = await browser.newPage();
  // 创建窗口尺寸
  await page.setViewport({
    isMobile:true,
    width: 375,
    height: 660,
    deviceScaleFactor: 1
  });
  await page.goto('https://www.priv-shield.com', {waitUntil: 'networkidle2'});
  await page.waitFor(5000);
  await browser.close();
})();