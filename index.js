
var os = require("os")
console.log('---------------os模块----------------------')

// CPU 的字节序
console.log('endianness : ' + os.endianness());

// 操作系统名
console.log('type : ' + os.type());

// 操作系统名
console.log('platform : ' + os.platform());

// 系统内存总量
console.log('total memory : ' + os.totalmem() + " bytes.");

// 操作系统空闲内存量
console.log('free memory : ' + os.freemem() + " bytes.");

console.log(os.tmpdir(), '返回操作系统的默认临时文件夹')
console.log(os.hostname(), '返回操作系统的主机名')
// console.log(os.networkInterfaces(), '获得网络接口列表')
console.log('---------------os模块-----end-----------------')


console.log('---------------path模块----------------------')
var path = require('path');
console.log(path.extname('index.html'))
console.log(path.extname('index.'))
// 返回: '.'
console.log('---------------path模块----end------------------')


