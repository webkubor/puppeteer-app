const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.launch({headless: false}) 
  const page = await browser.newPage();
  // 创建窗口尺寸
  await page.setViewport({
    width: 640,
    height: 480,
    deviceScaleFactor: 1,
  });
  await page.goto('https://www.priv-shield.com', {waitUntil: 'networkidle2'});
  // 监听url
  await page.evaluate(() => console.log(`url is ${location.href}`));
 
 
  await page.screenshot({path: 'priv-fed.png', fullPage: true, omitBackground:false}); // 截图
  // Generates a PDF with 'screen' media type.
  // await page.emulateMedia('screen');
  // await page.pdf({path: '王恩博.pdf', format: 'A4'}); // create a PDF
  await browser.close();
})();