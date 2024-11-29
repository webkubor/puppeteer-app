import puppeteer from 'puppeteer';

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    let targetRequestPromise;

    page.on('request', request => {
        if (targetRequestPromise === undefined && request.url().includes('ajax_endpoint')) {
            targetRequestPromise = request.response();
        }
    });

    await page.goto('https://shop.bkash.com/tarek-pharmacy01897588823/pay/bdt200/QP2suN');

    // 等待并点击按钮
    await page.waitForSelector('.v-btn');
    await page.click('.v-btn');

    if (targetRequestPromise) {
        const response = await targetRequestPromise;
        const status = response.status();
        const body = await response.text();
        const jsonBody = JSON.parse(body);

        console.log(`Ajax response status: ${status}`);
        console.log(`Ajax response body: ${JSON.stringify(jsonBody)}`);
    } else {
        console.log('Target request not found.');
    }

    await browser.close();
})();