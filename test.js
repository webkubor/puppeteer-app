const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const clickMenu = '.van-nav-bar__right'
const goBack = '.van-nav-bar__left'

puppeteer.launch({headless: false}).then(async browser => {
  const page = await browser.newPage();
  await page.goto('https://www.priv-shield.com', {
    waitUntil: 'networkidle0',
  }); 
  await page.emulate(iPhone);
  // 开始自动化测试
  console.log('test start.....')
  await page.screenshot({ path: 'home.png',fullPage: true, omitBackground:false });
  await page.waitFor(1000)

  console.log("The menu function is normal");
  await page.click(clickMenu);
  await page.screenshot({path: 'menu.png',fullPage: true, omitBackground:false});
  await page.waitFor(1000)

 // await page.waitForSelector('.form .item:nth-child(2) button') //测试节点
  console.log("The account page is normal");
  await page.click('.menu  .item:nth-child(6)');
  await page.waitFor(1000)
  await page.screenshot({path: 'login.png',fullPage: true, omitBackground:false});
  const phone = await page.$('.form .item:nth-child(1) input')
  await page.screenshot({path: 'phone.png',fullPage: true, omitBackground:false});
  await phone.type('18142232325')
  await page.waitFor(1000)
  console.log("The code function is normal");
  const code = await page.$('.form .item:nth-child(2) input')
  await code.type('90876')
  const codeBtn = await page.$('.form .item:nth-child(2) button')
  await codeBtn.click()
  await page.screenshot({path: 'code.png',fullPage: true, omitBackground:false});
  await page.waitFor(1000)

  await page.click(clickMenu);
  await page.waitFor(500)
  await page.click('.menu .item:nth-child(2)'); //隐私政策
  console.log("The secret page is normal");
  await page.screenshot({path: 'secret.png',fullPage: true, omitBackground:false});


  await page.click(goBack);
  await page.waitFor(500)
  await page.click(clickMenu);
  await page.waitFor(500)
  await page.click('.menu .item:nth-child(3)'); //常见问题
  await page.waitFor(500)
  console.log("The question page is normal");

  await page.click(clickMenu);
  await page.waitFor(800)
  await page.click('.menu .item:nth-child(4)'); //联系我们
  await page.waitFor(800)
  console.log("The about page is normal");


  await page.click(clickMenu);
  await page.waitFor(800)
  await page.click('.menu .item:nth-child(5)'); //常见问题
  await page.waitFor(800)

  console.log("The reminder page is normal");
  
  await page.click(clickMenu);
  await page.waitFor(800)
  await page.click('.menu .item:nth-child(7)'); //常见问题
  await page.waitFor(800)


  await page.click(clickMenu);
  await page.waitFor(800)
  await page.click('.menu .item:nth-child(8)'); //常见问题
  await page.waitFor(800)

  // await browser.close();
});