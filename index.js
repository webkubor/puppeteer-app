import chalk from 'chalk' ;

function outPrint(obj) {
    const formattedObj = JSON.stringify(JSON.parse(obj), null, 2);
    return chalk.yellow(formattedObj);
}


console.log(`output->outPrint`,outPrint(222))