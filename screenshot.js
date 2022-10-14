const puppeteer = require("puppeteer");
puppeteer.launch().then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 }); // PC端
  console.log("开始前往网站....");
  await page.goto("https://shorter.finance", {
    timeout: 0, //传0则为无限等待，直到加载渲染完毕
  });
 
  console.log("网站渲染完毕....");
  await page.screenshot({
    path: "screenshot.png",
    fullPage: true, // 会对整个完整页面进行截图
    // type: "png", // 'png' | 'jpeg' | 'webp';
    // quality: 100, // 图像的质量，在0-100之间。不适用于png图像。
    omitBackground: true, // 隐藏默认的白色背景，并允许以透明方式捕捉屏幕截图
  });
  await browser.close();
});
