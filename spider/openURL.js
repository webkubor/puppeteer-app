import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
const app = express();
const port = 3000;

// 使用 CORS 中间件
app.use(cors());

app.get('/start-puppeteer', async (req, res) => {
    try {
        // const browser = await puppeteer.launch({ headless: false });
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // 使用默认视口
            args: ['--start-maximized'] // 最大化窗口
        });
        const page = await browser.newPage();
        const url = 'https://shop.bkash.com/tarek-pharmacy01897588823/paymentlink/default-payment';
        
        await page.goto(url);
        await page.waitForSelector('#input-15');
        await page.type('#input-15', '300');
        await page.waitForTimeout(1000); // 等待1秒
        const isVisible = await page.evaluate(() => {
            const button = document.querySelector('button.v-btn.theme--light.elevation-6.v-size--default.primary');
            return button && button.offsetParent !== null; // 检查按钮是否可见
        });
        
        if (isVisible) {
            await page.click('button.v-btn.theme--light.elevation-6.v-size--default.primary');
            console.log('已点击');
        } else {
            console.log('按钮不可见，无法点击');
        }
        
        // 这里可以选择直接保存状态或数据
        await page.screenshot({ path: 'input-amount.png' });
        
        const currentUrl = await page.url(); // 获取当前页面 URL
        
        // 可选择不关闭浏览器，以便用户可以查看页面
        // await browser.close();
        console.log(`output->`,currentUrl)
        res.send({ url: currentUrl }); // 返回当前 URL
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
