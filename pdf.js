const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.launch() 
  const page = await browser.newPage();
  await page.goto('http://localhost:8080', {waitUntil: 'networkidle2'});
  await page.evaluate(() => console.log(`url is ${location.href}`));
  await page.emulateMedia('screen');
  await page.pdf({path: '王恩博.pdf', format: 'A4'}); // create a PDF
  await browser.close();
})();