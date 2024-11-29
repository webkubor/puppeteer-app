import express from 'express';
import puppeteer from 'puppeteer-extra';
import puppeteerExtraPluginStealth from 'puppeteer-extra-plugin-stealth';
import cors from 'cors';
import {getLocalIPAddress} from '../api/os.js';

const app = express();
const port = 3000;


// 使用 CORS 中间件
app.use(cors());

// 安装 Stealth 插件
puppeteer.use(puppeteerExtraPluginStealth());

app.get('/', (req, res) => {
    res.send('本地环境-测试!');
});

app.get('/start-puppeteer', async (req, res) => {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null, // 使用默认视口
            args: ['--disable-setuid-sandbox'] // 最大化窗口
        });

        const page = await browser.newPage();
        const url = 'https://shop.bkash.com/tarek-pharmacy01897588823/paymentlink/default-payment';
        
        await page.goto(url);
        await page.waitForSelector('#input-15', { visible: true, timeout: 5000 }); // 增加超时和可见性检查
        console.log('找到金额输入窗口');
        await page.type('#input-15', '300');
        await page.waitForSelector('#input-18', { visible: true, timeout: 5000 }); // 增加超时和可见性检查
        console.log('找到备注消息输入窗口');
        await page.type('#input-18', '111111111111');
        await page.waitForSelector('button.v-btn.theme--light.elevation-6.v-size--default.primary', { visible: true });
        await page.click('button.v-btn.theme--light.elevation-6.v-size--default.primary');
        console.log('点击了按钮,开始触发Google 人机验证');
        
        // 这里可以选择直接保存状态或数据
        await page.screenshot({ path: 'input-amount.png' });
        
        const currentUrl = await page.url(); // 获取当前页面 URL
        console.log(currentUrl,"test");

        // 可选择不关闭浏览器，以便用户可以查看页面
        // await browser.close();
        if (currentUrl)  res.send({ url: currentUrl }); // 返回当前 URL
       
    } catch (error) {
        res.status(500).send('Error: ' + error.message);
    }
});

app.listen(port, () => {
    const localIp = getLocalIPAddress();
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Server running at http://${localIp}:${port}/start-puppeteer`);
});
