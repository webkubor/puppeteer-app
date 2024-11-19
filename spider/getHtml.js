import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const target = 'https://juejin.cn/post/7431004279819288613'

  try {
    // 导航到目标网页
    await page.goto(target);

    // 等待特定元素出现
    await page.waitForSelector('#article-root', { timeout: 60000 });

    // 获取完整渲染后的 HTML
    const html = await page.content();

    // 使用 Cheerio 解析 HTML
    const $ = cheerio.load(html);

    // 假设要获取所有 <p> 标签的文本内容
    const paragraphTexts = $('p').map((index, element) => $(element).text()).get();

    console.log(paragraphTexts);
  } catch (error) {
    console.error('发生错误：', error);
  } finally {
    // 关闭浏览器
    await browser.close();
  }


})();
