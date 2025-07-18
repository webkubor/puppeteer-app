import fly from 'flyio';
import chalk from 'chalk';
import * as cheerio from 'cheerio';
import puppeteer from 'puppeteer';

const TARGET_URLS = [
   'https://pk-test.tpservice.vip',
   'https://bd-test.tpservice.vip',
  'https://bd.tpservice.vip/',
  // 'https://pk.tpservice.vip/',
  // 'https://bkash.bdt-pay.com',
  // 'https://nagad.bdt-pay.com',
  // 'https://payment.larkpay.io/',
  // 'https://bd.larkpay.io',
  // 'https://pk.larkpay.io',
];

const results = [];

async function checkHeaderCacheConfig(target) {
  const result = {
    url: target,
    cacheControl: '',
    etagOrLastMod: '',
    cfStatus: '',
    jsHash: '',
    whiteScreen: '',
  };

  try {
    const res = await fly.get(target, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const status = res.status;
    const headers = res.headers;

    console.log(chalk.blue.bold(`\n🧪 [阶段一] 响应头检测 → ${target}`));

    // Cache-Control
    const cacheControl = headers['cache-control'];
    if (cacheControl?.includes('no-store')) {
      result.cacheControl = 'no-store';
    } else if (cacheControl?.includes('no-cache')) {
      result.cacheControl = 'no-cache';
    } else {
      result.cacheControl = 'MISSING';
    }

    // 协商缓存
    if (!headers['etag'] && !headers['last-modified']) {
      result.etagOrLastMod = 'NONE';
    } else {
      result.etagOrLastMod = 'EXISTS';
    }

    // CDN 缓存
    const cfStatus = Array.isArray(headers['cf-cache-status'])
      ? headers['cf-cache-status'][0]
      : headers['cf-cache-status'];
    result.cfStatus = cfStatus || '无';

    // JS hash 检查
    const $ = cheerio.load(res.data);
    const scripts = $('script[src]');
    let jsOk = true;
    scripts.each((_, el) => {
      const src = $(el).attr('src');
      if (src?.includes('index') && !/index-[\w\d]{6,}\.js/.test(src)) {
        jsOk = false;
      }
    });
    result.jsHash = jsOk ? 'OK' : '缺失';

  } catch (err) {
    console.error(chalk.red(`❌ 请求失败 ${target}: ${err.message}`));
    result.cacheControl = 'ERROR';
    result.etagOrLastMod = 'ERROR';
    result.cfStatus = 'ERROR';
    result.jsHash = 'ERROR';
    result.whiteScreen = 'ERROR';
  }

  return result;
}

async function simulateOldUserCache(target) {
  try {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    console.log(chalk.blue.bold(`\n🧪 [阶段二] 模拟老用户访问测试 → ${target}`));

    await page.setCacheEnabled(true);
    await page.goto(target, { waitUntil: 'load', timeout: 20000 });
    await page.reload({ waitUntil: 'load', timeout: 20000 });

    const isWhite = await page.evaluate(() => {
      return !document.body || !document.body.innerText.trim();
    });

    await browser.close();
    return isWhite ? '白屏' : '正常';
  } catch (err) {
    console.error(chalk.red(`❌ 模拟访问失败 ${target}: ${err.message}`));
    return 'ERROR';
  }
}

(async () => {
  for (const url of TARGET_URLS) {
    const res = await checkHeaderCacheConfig(url);
    res.whiteScreen = await simulateOldUserCache(url);
    results.push(res);
  }

  console.log(chalk.cyan.bold('\n====== ✅ 检测汇总报告 ======\n'));

  const plainResults = results.map(item => ({
    '站点 URL': item.url,
    '缓存策略 (Cache-Control)': item.cacheControl === 'no-store'
      ? '✅ 强缓存禁用（no-store）'
      : item.cacheControl === 'no-cache'
        ? '⚠️ 允许协商缓存（no-cache）'
        : '❌ 缺失或配置错误',
  
    '协商缓存 (ETag / Last-Modified)': item.etagOrLastMod === 'NONE'
      ? '✅ 已禁用'
      : '❌ 存在（可能触发 304）',
  
    'CDN 缓存状态 (cf-cache-status)': item.cfStatus === 'DYNAMIC'
      ? '✅ 未缓存（DYNAMIC）'
      : item.cfStatus === '无'
        ? 'ℹ️ 未使用 Cloudflare'
        : `❌ ${item.cfStatus} —— 已被缓存`,
  
    'JS 是否带 Hash（防止混存）': item.jsHash === 'OK'
      ? '✅ 带 Hash'
      : '❌ 缺失 Hash（更新可能混存）',
  
    '页面渲染结果（模拟老用户访问）': item.whiteScreen === '正常'
      ? '✅ 正常渲染'
      : item.whiteScreen === '白屏'
        ? '❌ 白屏（混存风险）'
        : '⚠️ 异常或未知错误',
  }));
  console.table(plainResults);

// 字段解释说明
console.log('\n📘 字段说明与建议配置位置：\n');

console.log(chalk.bold('📦 缓存策略 (Cache-Control):'));
console.log('用于控制 HTML 是否被强缓存。缺失或配置错误会导致用户读取旧版页面，发生混存白屏问题。');
console.log(chalk.gray('🛠 建议在 Nginx 中配置 HTML 路由：'));
console.log(`  location ~* \\.html$ {
    add_header Cache-Control "no-store, no-cache, must-revalidate, max-age=0" always;
    add_header Pragma "no-cache" always;
    add_header Expires 0 always;
    etag off;
    if_modified_since off;
  }`);
console.log('');

console.log(chalk.bold('📦 协商缓存 (ETag / Last-Modified):'));
console.log('浏览器会基于这些字段发送 If-None-Match / If-Modified-Since，请求是否可用缓存。若开启，会返回 304，页面可能不更新。');
console.log(chalk.gray('🛠 建议在服务器层关闭，示例（Nginx）：'));
console.log(`  etag off;
  if_modified_since off;`);
console.log('');

console.log(chalk.bold('📦 CDN 缓存 (cf-cache-status):'));
console.log('Cloudflare 等 CDN 可能会缓存 HTML 导致返回旧页面，进而触发白屏。');
console.log(chalk.gray('🛠 建议在 Cloudflare 页面规则或缓存规则中设置：'));
console.log(`  页面规则：不缓存 HTML，例如 "Cache Level: Bypass"\n  或使用 Worker 过滤 HTML 缓存`);
console.log('');

console.log(chalk.bold('📦 JS 是否带 hash:'));
console.log('构建出的 JS 文件名应带 hash（如 index-xxxxx.js），以确保 JS 内容变动时能触发浏览器重新加载。');
console.log(chalk.gray('🛠 该配置应在前端构建工具中完成：如 Vite/Webpack 默认即可带 hash。'));
console.log('');

console.log(chalk.bold('📦 页面渲染结果:'));
console.log('检测老用户连续访问是否发生白屏，通常与 HTML 被缓存导致加载旧 JS 不兼容有关。');
console.log(chalk.gray('🛠 需确保 HTML 不缓存，配合正确 hash JS 与 CDN 配置避免混存问题。'));

console.log('\n🎯 总结建议：\n');
console.log('1️⃣ **HTML 不可缓存**：Nginx 设置 Cache-Control: no-store，关闭 etag / last-modified\n2️⃣ **CDN 不可缓存 HTML**：Cloudflare 设置 Bypass\n3️⃣ **JS 必须带 hash**：避免引用旧脚本\n4️⃣ **定期回测页面白屏风险**：监控老用户体验');

})();