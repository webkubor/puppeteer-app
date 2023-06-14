const axios = require('axios');

const url = 'https://c12.onepy.top/proof/?enc=b46GoOCK7A3i6XvotpZKKrblTOZ5gxIctavsXULG67uXnFZvYdx5Nrq5u46xfOH13LrPazJKRqTmp7EUU9qUUg==#/index';

axios.get(url)
  .then(response => {
    console.log(response.data); // 打印页面内容
  })
  .catch(error => {
    console.error('请求发生错误:', error);
  });