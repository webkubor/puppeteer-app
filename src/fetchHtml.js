import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
    const browser = await puppeteer.launch({
        headless: false, // 非无头模式，便于用户交互
        defaultViewport: null, // 禁用默认视口限制
        args: ["--window-size=1920,1080"], // 设置窗口大小
    });

    const page = await browser.newPage();
    await page.goto("https://www.cursor.com/");

    // 在页面中注入监听点击事件的脚本
    await page.evaluate(() => {
        document.addEventListener("click", (event) => {
            const element = event.target;

            // 获取按钮文案
            const buttonText = element.innerText || element.getAttribute("aria-label") || element.getAttribute("title") || "无文案";

            // 获取元素的计算样式
            const computedStyle = window.getComputedStyle(element);
            const allStyles = {};
            for (let i = 0; i < computedStyle.length; i++) {
                const property = computedStyle[i];
                allStyles[property] = computedStyle.getPropertyValue(property);
            }

            // 将样式和文案信息存储到全局变量中
            window.clickedElementStyles = {
                outerHTML: element.outerHTML,
                textContent: buttonText, // 文案内容
                styles: allStyles, // 生效的 CSS 样式
            };

            console.log("已捕获元素样式和文案内容，继续 Puppeteer 处理...");
        });
    });

    console.log("等待用户点击按钮...");

    // 等待用户点击并捕获样式和文案
    const clickedElementStyles = await page.evaluate(() => {
        return new Promise((resolve) => {
            const interval = setInterval(() => {
                if (window.clickedElementStyles) {
                    clearInterval(interval);
                    resolve(window.clickedElementStyles);
                }
            }, 500);
        });
    });

    // 保存样式和文案到文件
    const filePath = "clicked-button-styles.json";
    fs.writeFileSync(filePath, JSON.stringify(clickedElementStyles, null, 2));
    console.log(`样式和文案已保存为 ${filePath}`);

    // 关闭浏览器
    await browser.close();
    console.log("浏览器已关闭！");
})();