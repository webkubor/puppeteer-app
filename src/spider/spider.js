const axios = require('axios');
const cheerio = require('cheerio');

const url = 'https://tools.hopetrip.com.hk/web/swiftcode/country-42-zh-CN-3.html';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);
    const bankNames = [];
    $('table tbody tr').each(function() {
      const name = $(this).find('td').eq(1).text().trim();
      bankNames.push(name);
    });
    console.log(bankNames);
    
  })
  .catch(error => {
    console.log(error);
  });



