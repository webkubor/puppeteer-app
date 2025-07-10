import fly from 'flyio';
import chalk from 'chalk';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

// 支持多个域名
const TARGET_URLS = [
  'https://bd.tpservice.vip/',
  'https://pk.tpservice.vip/',
  'https://bkash.bdt-pay.com',
  'https://nagad.bdt-pay.com',
  'https://payment.larkpay.io/',
  'https://bd.larkpay.io',
  'https://pk.larkpay.io',
];

async function checkHeaderCacheConfig(target) {
  try {
    const res = await fly.get(target, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const status = res.status;
    const headers = res.headers;

    console.log(chalk.blue.bold(`\n🧪 [阶段一] 响应头检测 → ${target}`));
    console.log(`📡 状态码: ${chalk.yellow(status)}（理想为 200）\n`);

    // Cache-Control
    const cacheControl = headers['cache-control'];
    console.log(chalk.white.bold('📦 Cache-Control'));
    if (cacheControl?.includes('no-store')) {
      console.log(chalk.green('✅ no-store —— 禁止强缓存 ✅'));
    } else if (cacheControl?.includes('no-cache')) {
      console.log(chalk.yellow('⚠️ no-cache —— 会触发协商缓存 ⚠️'));
    } else {
      console.log(chalk.red(`❌ ${cacheControl || '无'} —— 存在缓存风险 ❌`));
    }
    console.log('');

    // ETag / Last-Modified
    console.log(chalk.white.bold('📦 协商缓存：ETag / Last-Modified'));
    if (!headers['etag'] && !headers['last-modified']) {
      console.log(chalk.green('✅ 未设置 —— 不会触发 304 ✅'));
    } else {
      console.log(chalk.red(`❌ 存在 —— ${headers['etag'] || ''} / ${headers['last-modified'] || ''}`));
    }

    // cf-cache-status
    const cfStatus = Array.isArray(headers['cf-cache-status'])
      ? headers['cf-cache-status'][0]
      : headers['cf-cache-status'];

    console.log(chalk.white.bold('\n📦 cf-cache-status'));
    if (cfStatus === 'DYNAMIC') {
      console.log(chalk.green('✅ DYNAMIC —— 未被 Cloudflare 缓存 ✅'));
    } else {
      console.log(chalk.red(`❌ ${cfStatus || '无'} —— 存在 CDN 缓存 ❌`));
    }

    // JS hash 检查
    console.log(chalk.white.bold('\n📦 JS 路径 Hash 检查'));
    const $ = cheerio.load(res.data);
    const scripts = $('script[src]');
    let jsOk = true;
    scripts.each((_, el) => {
      const src = $(el).attr('src');
      if (src?.includes('index') && !/index-[\w\d]{6,}\.js/.test(src)) {
        jsOk = false;
        console.log(chalk.red(`❌ 未带 hash：${src}`));
      }
    });
    if (jsOk) console.log(chalk.green('✅ 所有 JS 路径带 hash ✅'));

    // 状态码
    if (status === 304) {
      console.log(chalk.red('\n❌ 返回 304 —— 使用了协商缓存 ❌'));
    } else {
      console.log(chalk.green('\n✅ 返回 200 —— 正常加载 ✅'));
    }
  } catch (err) {
    console.error(chalk.red(`❌ 请求失败 ${target}: ${err.message}`));
  }
}

async function simulateOldUserCache(target) {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();

  console.log(chalk.blue.bold(`\n🧪 [阶段二] 模拟老用户连续访问 → ${target}`));

  await page.setCacheEnabled(true);
  await page.goto(target, { waitUntil: 'load', timeout: 20000 });

  const scriptPath = await page.$$eval('script[src]', scripts =>
    scripts.map(el => el.getAttribute('src')).find(src => src && (src.includes('index') || src.includes('app')))
  );
  console.log(chalk.gray(`📦 首次访问 JS：${scriptPath}`));

  await page.reload({ waitUntil: 'load', timeout: 20000 });

  const isWhite = await page.evaluate(() => !document.body || !document.body.innerText.trim());
  if (isWhite) {
    console.log(chalk.bgRed.white.bold('❌ 页面白屏 —— 疑似混存 ❌'));
  } else {
    const title = await page.title();
    console.log(chalk.green(`✅ 页面正常，标题：${title}`));
  }

  await browser.close();
}

(async () => {
  for (const url of TARGET_URLS) {
    await checkHeaderCacheConfig(url);
    await simulateOldUserCache(url);
  }
})();