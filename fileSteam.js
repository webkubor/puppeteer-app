// Node.js 对文件、文件夹读写操作主要靠内置的 fs 模块

/*
callback 风格
const fs = require('fs');
fs.stat('./readme.txt', (err, stats) => {
    if(err) {
        // 处理错误。
        console.log(err)
    } else {
        // 使用 stats
        console.log(stats)
    }
});*/


/*
promise API 方式1
const fs = require('fs').promises;
const fs = require('fs/promises');
fs.stat('./readme.txt').then(stats => {
    console.log(stats)
    // 使用 stats
}).catch(error => {
    // 处理错误
    console.error(error)
});*/

/*
Node.js 使用回调风格一方面是因为性能原因，
一方面是因为 Node.js 诞生的时候 Promise 规范还没有制定，
在 Promise 规范制定后 Node.js 通过内置模块 util 提供的 promisify 方法
可以把所有标准 callback 风格方法转成 promise 风格方法
const util = require('util');
const fs = require('fs');

const stat = util.promisify(fs.stat);
stat('./readme.txt').then(stats => {
    // 使用 stats
}).catch(error => {
    // 处理错误
});
*/

// 同步读取方法
const fs = require('fs');
let xlsx = require('xlsx');
try {
    // const stats = fs.statSync('demo.xlsx'); 文件状态
    // fs.readFile('./readme.txt', { encoding: 'utf8', flag: 'r' }, (err, data)=> {
    //     if (err) throw err;
    //     console.log(data,'--------------readme.txt')
    // });
    let workbook = xlsx.readFile('demo.xlsx'); //workbook就是xls文档对象

    let sheetNames = workbook.SheetNames; //获取表名

    let sheet = workbook.Sheets[sheetNames[0]]; //通过表明得到表对象

    let data =xlsx.utils.sheet_to_json(sheet); //通过工具将表对象的数据读出来并转成json
    console.log(`表格-${sheetNames[0]}`, data)
} catch(error) {
    // 处理错误
    console.error(error)
}

// 判断文件路径
fs.exists('./newWrite.xls', (isExists) => {
    console.log(isExists ? '存在' : '不存在');
    //删除文件
    fs.unlink('./newWrite.xls', (err) => {
        if (err) throw err;
        console.log('文件已删除');
      });
});


//写入
let json = [
    { Name: 'name_01', Age: 21, Address: 'address_01' },
    { Name: 'name_02', Age: 22, Address: 'address_02' },
    { Name: 'name_03', Age: 23, Address: 'address_03' },
    { Name: 'name_04', Age: 24, Address: 'address_04' },
    { Name: 'name_05', Age: 25, Address: 'address_05' }, ];

let ss = xlsx.utils.json_to_sheet(json); //通过工具将json转表对象
let keys = Object.keys(ss).sort(); //排序 [需要注意，必须从A1开始]

let ref = keys[1]+':'+keys[keys.length - 1]; //这个是定义一个字符串 也就是表的范围[A1:C5]

let workbook = { //定义操作文档
    SheetNames:['nodejs-sheetname'], //定义表明
    Sheets:{
        'nodejs-sheetname':Object.assign({},ss,{'!ref':ref}) //表对象[注意表明]
    },
}

xlsx.writeFile(workbook,"./newWrite.xls", {type:"array"}); //将数据写入文件,不传array默认99条，现在可支持999条