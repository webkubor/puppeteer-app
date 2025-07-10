// check-cache-health.mjs
import fly from 'flyio';
import chalk from 'chalk';
import * as cheerio from 'cheerio';

const TARGET_URL = 'https://bd.tpservice.vip/';

async function checkCacheHealth() {
  try {
    const res = await fly.get(TARGET_URL, {
      headers: {
        'Cache-Control': 'no-cache',
      },
    });

    const status = res.status;
    const headers = res.headers;

    console.log(chalk.blue.bold(`\n🕵️ 正在检测缓存配置 → ${TARGET_URL}`));
    console.log(`📡 HTTP 状态码: ${chalk.yellow(status)}（理想状态为 200，不应为 304）`);

    // 1. Cache-Control
    const cacheControl = headers['cache-control'];
    if (cacheControl) {
      if (/no-store/i.test(cacheControl)) {
        console.log(chalk.green('✅ Cache-Control: no-store —— 强缓存已禁用'));
      } else if (/no-cache/i.test(cacheControl)) {
        console.log(chalk.yellow('⚠️ Cache-Control: no-cache —— 浏览器每次仍会请求，但可能会触发协商缓存'));
      } else if (/max-age=\d+/.test(cacheControl)) {
        console.log(
          chalk.red(`❌ Cache-Control 包含 max-age —— 强缓存启用，浏览器可能不请求服务器（值：${cacheControl}）`)
        );
      } else {
        console.log(chalk.red(`❌ Cache-Control 存在但不安全（值：${cacheControl}）`));
      }
    } else {
      console.log(chalk.red('❌ 未设置 Cache-Control —— 浏览器可能自行缓存 HTML 页面'));
    }

    // 2. ETag
    if (!headers['etag']) {
      console.log(
        chalk.green('✅ 未设置 ETag —— 避免协商缓存（304 Not Modified）')
      );
    } else {
      console.log(
        chalk.red(`❌ 检测到 ETag: ${headers['etag']} —— 建议服务端移除以禁用协商缓存`)
      );
    }

    // 3. Last-Modified
    if (!headers['last-modified']) {
      console.log(
        chalk.green('✅ 未设置 Last-Modified —— 避免浏览器协商缓存')
      );
    } else {
      console.log(
        chalk.red(`❌ 检测到 Last-Modified: ${headers['last-modified']} —— 建议移除`)
      );
    }

    // 4. cf-cache-status
    const cfStatus = headers['cf-cache-status'];
    if (cfStatus == 'DYNAMIC') {
      console.log(
        chalk.green('✅ cf-cache-status = DYNAMIC —— Cloudflare 未缓存 HTML 页面，配置已生效')
      );
    } else {
      console.log(
        chalk.red(`❌ cf-cache-status = ${cfStatus} —— Cloudflare 正在缓存 HTML 页面，建议设置 Page Rule: Cache Level = Bypass`)
      );
    }

    // 5. 状态码检查
    if (status === 304) {
      console.log(
        chalk.red('❌ 状态码 304 Not Modified —— 浏览器使用了协商缓存，页面未重新加载')
      );
    } else {
      console.log(
        chalk.green('✅ 状态码正常（非 304）—— 浏览器从服务器获取了最新页面')
      );
    }

    // 6. JS 文件名是否带 hash（避免强缓存）
    const html = res.data;
    const $ = cheerio.load(html);
    const scripts = $('script[src]');
    let jsOk = true;

    scripts.each((_, el) => {
      const src = $(el).attr('src');
      if (src && src.includes('index') && !/index-[\w\d]{6,}\.js/.test(src)) {
        jsOk = false;
        console.log(
          chalk.red(`❌ JS 文件未带 hash：${src} —— 可能导致浏览器缓存旧 JS 文件`)
        );
      }
    });

    if (jsOk) {
      console.log(
        chalk.green('✅ 所有 JS 文件路径均带 hash —— 发布新版本时浏览器能自动识别并更新')
      );
    }

    console.log(chalk.blue.bold('\n🎯 缓存配置检测完成\n'));
  } catch (err) {
    console.error(chalk.red('❌ 检测失败：'), err.message);
  }
}

checkCacheHealth();