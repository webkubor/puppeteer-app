import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

// 配置项
const config = {
  targetUrl: 'https://juejin.cn/post/7431004279819288613',
  downloadDir: 'download',  // 保存的目录
  timeout: 60000,           // 等待超时时间
};

async function launchBrowser() {
  try {
    const browser = await puppeteer.launch({
      headless: true, // 无头模式，减少资源消耗
      args: ['--no-sandbox', '--disable-setuid-sandbox'], // 解决沙箱问题
      defaultViewport: { width: 1366, height: 768 }, // 设置默认视口尺寸
    });
    return browser;
  } catch (error) {
    console.error('启动浏览器失败：', error);
    throw error;
  }
}

async function fetchArticleContent(page, url) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: config.timeout });
    console.log('页面加载完毕，开始获取 HTML 内容...');
    await page.waitForSelector('#article-root', { timeout: config.timeout });

    const html = await page.content();
    const $ = cheerio.load(html);
    const paragraphTexts = $('p').map((index, element) => $(element).text()).get();
    return paragraphTexts.join('\n\n');
  } catch (error) {
    console.error('获取文章内容失败：', error);
    throw error;
  }
}

function saveArticleToFile(articleText) {
  const timestamp = Date.now();
  const filename = `${timestamp}.txt`;
  
  // 获取当前目录路径 (替代 __dirname) 
  const downloadDir = path.join(path.dirname(new URL(import.meta.url).pathname), config.downloadDir);

  // 确保目录存在
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const filePath = path.join(downloadDir, filename);
  try {
    fs.writeFileSync(filePath, articleText, 'utf-8');
    console.log(`文章已保存至 ${filePath}`);
  } catch (error) {
    console.error('保存文件失败：', error);
    throw error;
  }
}

(async () => {
  console.log('开始启动爬虫...');
  
  const browser = await launchBrowser();
  const page = await browser.newPage();
  
  try {
    const articleText = await fetchArticleContent(page, config.targetUrl);
    saveArticleToFile(articleText);
  } catch (error) {
    console.error('爬取过程中发生错误：', error);
  } finally {
    await browser.close();
  }
})();
