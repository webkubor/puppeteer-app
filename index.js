import chalk from 'chalk';


function outPrint(obj) {
    const formattedObj = JSON.stringify(JSON.parse(obj), null, 2);
    return chalk.yellow(formattedObj);
}


function _judgeTypes(target) {
    return Object.prototype.toString.call(target).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase()
    //return Reflect.apply(Object.prototype.toString, target, []).replace(/^\[object\s(\w+)\]$/, '$1').toLowerCase()
}


console.log(`output->outPrint`, outPrint('初始化'))