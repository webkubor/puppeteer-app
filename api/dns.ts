var dns = require('dns');

const options = {
    all:true,
};

function _judgeTypes (target) {
    return Object.prototype.toString.call(target).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase()
   //return Reflect.apply(Object.prototype.toString, target, []).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase()
   }


dns.lookup('www.yuque.com', options, (err, address)=>  {
    console.log('www.yuque.com  一级域名地址:', address, _judgeTypes(address));
});
