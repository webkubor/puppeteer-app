function judgeTypes(target) {
    return Object.prototype.toString.call(target)
      .replace(/^\[object\s(\w+)\]$/, '$1')
      .toLowerCase();
  }


type ColorType =
  | 'reset'
  | 'bright'
  | 'dim'
  | 'underscore'
  | 'blink'
  | 'reverse'
  | 'hidden'
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white'
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite'
  | 'orange'
  | 'pink'
  | 'lightGray'
  | 'purple'
  | 'creamWhite';

const colorMap: { [key in ColorType]: string } = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  orange: '\x1b[38;5;208m', // 橙色 ANSI 代码示例，可能需要根据实际情况调整
  pink: '\x1b[38;5;212m', // 粉色 ANSI 代码示例，可能需要根据实际情况调整
  lightGray: '\x1b[38;5;245m', // 梁灰色 ANSI 代码示例，可能需要根据实际情况调整
  purple: '\x1b[38;5;128m', // 紫色 ANSI 代码示例，可能需要根据实际情况调整
  creamWhite: '\x1b[38;5;255m', // 奶白色 ANSI 代码示例，可能需要根据实际情况调整
};

function colorLog(color: ColorType,...texts: (string | number| object| boolean)[]): void {
  if (!colorMap[color]) {
    throw new Error(`Invalid color: ${color}`);
  }
  let output = '';
  for (const text of texts) {
    if(judgeTypes(text) === 'number') {
      output += text.toString();
    } else if (judgeTypes(text) ==='object') {
      output += JSON.stringify(text, null, 2);
    } else if (judgeTypes(text) ==='boolean') {
      output += text.toString();
    } else {
      output += text;
    }
    output += ' ';
  }
  console.log(`${colorMap[color]}${output.trim()}${colorMap['reset']}`);
}

const EchoUtils = Object.fromEntries(
  Object.keys(colorMap).map((color) => [color, (...texts: (string | number| object| boolean)[]) => colorLog(color as ColorType,...texts)])
);

export default EchoUtils;