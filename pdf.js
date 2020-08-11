const puppeteer = require('puppeteer');

(async () => {
  const browser = await  puppeteer.launch() 
  const page = await browser.newPage();
  await page.goto('https://web-kubor.gitee.io/resume', {waitUntil: 'networkidle2'});

  await page.emulateMedia('screen');
  await page.pdf({path: 'webkubor.pdf', format: 'A4',scale: 0.7,margin:{top: '20px',left: '20px',bottom: '20px',right: '20px'}}); // create a PDF
  await browser.close();
})();