import fly from 'flyio';
import chalk from 'chalk';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const TARGET_URL = 'https://bd.tpservice.vip/';

/**
 * 第一部分：响应头配置检测
 */
async function checkHeaderCacheConfig() {
  try {
    const res = await fly.get(TARGET_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const status = res.status;
    const headers = res.headers;

    console.log(chalk.blue.bold(`\n🧪 [阶段一] 检查响应头缓存配置 → ${TARGET_URL}`));
    console.log(`📡 HTTP 状态码: ${chalk.yellow(status)}（理想为 200，不能是 304）\n`);

    // Cache-Control
    const cacheControl = headers['cache-control'];
    console.log(chalk.white.bold('📦 Cache-Control'));
    console.log(chalk.gray('⚙️ 强缓存（浏览器直接使用缓存，不访问服务器）'));

    if (cacheControl) {
      if (/no-store/i.test(cacheControl)) {
        console.log(chalk.green('✅ 存在，值为 no-store —— 禁止强缓存 ✅'));
      } else if (/no-cache/i.test(cacheControl)) {
        console.log(chalk.yellow('⚠️ 存在，值为 no-cache —— 仍会触发协商缓存 ⚠️'));
      } else if (/max-age=\d+/.test(cacheControl)) {
        console.log(chalk.red(`❌ 存在，值为 ${cacheControl} —— 启用了强缓存 ❌`));
      } else {
        console.log(chalk.red(`❌ 存在，值为 ${cacheControl} —— 配置不明确 ❌`));
      }
    } else {
      console.log(chalk.red('❌ 不存在 —— 浏览器可能默认缓存 ❌'));
    }
    console.log('');

    // ETag
    console.log(chalk.white.bold('📦 ETag'));
    console.log(chalk.gray('⚙️ 协商缓存：浏览器询问是否修改'));

    if (!headers['etag']) {
      console.log(chalk.green('✅ 未设置 —— 不触发协商缓存 ✅'));
    } else {
      console.log(chalk.red(`❌ 存在，值为 ${headers['etag']} —— 启用协商缓存 ❌`));
    }
    console.log('');

    // Last-Modified
    console.log(chalk.white.bold('📦 Last-Modified'));
    console.log(chalk.gray('⚙️ 协商缓存：根据时间判断是否变更'));

    if (!headers['last-modified']) {
      console.log(chalk.green('✅ 未设置 —— 不会触发 304 ✅'));
    } else {
      console.log(chalk.red(`❌ 存在，值为 ${headers['last-modified']} —— 可能触发 304 ❌`));
    }
    console.log('');

    // cf-cache-status
    const rawCfStatus = headers['cf-cache-status'];
    const cfStatus = Array.isArray(rawCfStatus) ? rawCfStatus[0] : rawCfStatus;

    console.log(chalk.white.bold('📦 cf-cache-status'));
    console.log(chalk.gray('⚙️ CDN 缓存状态（Cloudflare 专用）'));
    console.log(chalk.gray(`值为：${cfStatus}\n`));

    if (!cfStatus) {
      console.log(chalk.red('❌ 缺少 cf-cache-status —— 请求未走 CDN ❌'));
    } else if (cfStatus === 'DYNAMIC') {
      console.log(chalk.green('✅ DYNAMIC —— Cloudflare 未缓存 HTML ✅'));
    } else {
      console.log(chalk.red(`❌ ${cfStatus} —— Cloudflare 正在缓存 HTML ❌`));
    }

    // 状态码检查
    if (status === 304) {
      console.log(chalk.red('❌ 返回 304 —— 使用了协商缓存 ❌'));
    } else {
      console.log(chalk.green('✅ 返回 200 —— 正常加载 ✅'));
    }

    // JS hash 检查
    console.log('');
    console.log(chalk.white.bold('📦 JS 文件路径 Hash 检查'));
    const html = res.data;
    const $ = cheerio.load(html);
    const scripts = $('script[src]');
    let jsOk = true;

    scripts.each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('index') && !/index-[\w\d]{6,}\.js/.test(src)) {
        jsOk = false;
        console.log(chalk.red(`❌ 未带 hash：${src}`));
      }
    });

    if (jsOk) {
      console.log(chalk.green('✅ 所有 JS 路径带 hash ✅'));
    } else {
      console.log(chalk.red('🛠 建议：构建时确保 JS 带 hash 文件名'));
    }

  } catch (err) {
    console.error(chalk.red('❌ 检测失败：'), err.message);
  }
}

async function simulateOldUserCache() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  console.log(chalk.blue.bold('\n🧪 [阶段二] 模拟老用户连续访问测试混存（含白屏）\n'));

  // 模拟用户第一次访问（缓存 HTML 和资源）
  await page.setCacheEnabled(true); // 默认即为 true，可省略
  await page.goto(TARGET_URL, { waitUntil: 'load', timeout: 20000 });

  const cachedScript = await page.$$eval('script[src]', scripts =>
    scripts.map(el => el.getAttribute('src')).find(src => src && (src.includes('index') || src.includes('app')))
  );

  console.log(chalk.gray(`📦 首次访问主 JS 路径：${cachedScript}`));

  // 第二次访问，同一个 tab（继承缓存）
  await page.reload({ waitUntil: 'load', timeout: 20000 });

  const isWhiteScreen = await page.evaluate(() => {
    return !document.body || !document.body.innerText.trim();
  });

  if (isWhiteScreen) {
    console.log(chalk.bgRed.white.bold('\n❌ 页面白屏 —— 疑似混存问题 ❌'));
    console.log(chalk.red('🛠 建议：确保 HTML 设置 Cache-Control: no-store，并禁止协商缓存'));
  } else {
    const title = await page.title();
    console.log(chalk.green(`\n✅ 页面渲染正常 —— 暂未检测到混存（标题：${title}） ✅`));
  }

  await browser.close();
}
/**
 * 主函数
 */
(async () => {
  await checkHeaderCacheConfig();
  await simulateOldUserCache();
})();