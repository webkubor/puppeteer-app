const chalk = require('chalk');

export function outPrint(obj) {
    const formattedObj = JSON.stringify(JSON.parse(obj), null, 2);
    return chalk.yellow(formattedObj);
    
}
