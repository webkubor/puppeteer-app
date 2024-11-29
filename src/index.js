import osUtils from './api/os.js';  // 使用 @ 作为 src 路径别名
import { ColoredLog } from './api/log.js';  // 使用 @ 作为 src 路径别名
let outMessage = osUtils.getAllInfo();

ColoredLog.success('os模块-----', JSON.stringify(outMessage, null, 2));

