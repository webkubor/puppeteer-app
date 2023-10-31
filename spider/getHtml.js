const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();


  // 导航到目标网页
  await page.goto('https://c12.onepy.top/proof/?enc=b46GoOCK7A3i6XvotpZKKrblTOZ5gxIctavsXULG67uXnFZvYdx5Nrq5u46xfOH13LrPazJKRqTmp7EUU9qUUg==#/index');

  // 等待网页加载完成
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  // 获取完整渲染后的 HTML
  const html = await page.content();

  // 使用 Cheerio 解析 HTML
  const $ = cheerio.load(html);

  // 查找 .brazil 元素并获取所有文本内容
  const brazilText = $('.brazil').text();
  console.log(brazilText);

  await browser.close();
})();
