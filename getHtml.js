const puppeteer = require('puppeteer');

(async () => {
  // 启动无头浏览器
    const browser = await puppeteer.launch({
    headless: "new"
  })
    
  const url = 'https://c12.onepy.top/proof/?enc=b46GoOCK7A3i6XvotpZKKrblTOZ5gxIctavsXULG67uXnFZvYdx5Nrq5u46xfOH13LrPazJKRqTmp7EUU9qUUg==#/index';

  const page = await browser.newPage();

  // 等待页面加载和渲染完毕
  await page.goto(url, {waitUntil: 'networkidle2'});

  await page.emulateMedia('screen');
  await page.pdf({path: '111111111.pdf', format: 'A4',scale: 0.7,margin:{top: '20px',left: '20px',bottom: '20px',right: '20px'}}); // create a PDF

//   // 等待3秒
//   await page.waitForTimeout(6000);

//   // 截图并保存到本地
//   await page.screenshot({ path: 'screenshot.png' });

  // 关闭浏览器
  await browser.close();
})();