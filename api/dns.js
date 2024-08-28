import dns from 'dns';

   dns.lookup('www.yuque.com', {
    all: true,
}, (err, address) => {
    console.log('www.yuque.com  一级域名地址:', address, );
});
