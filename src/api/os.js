import os from 'os';

/**
 * 获取本地 IPv4 地址
 * @returns {string | undefined} 本地 IPv4 地址，如果没有找到则返回 undefined
 */
function getLocalIPAddress() {
    const interfaces = os.networkInterfaces();
    for (const interfaceName in interfaces) {
        for (const iface of interfaces[interfaceName]) {
            // 查找非内部的 IPv4 地址
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
}

/**
 * 获取操作系统的主机名
 * @returns {string} 操作系统的主机名
 */
function getHostName() {
    return os.hostname();
}

/**
 * 获取操作系统平台
 * @returns {string} 操作系统平台，如 'linux', 'darwin', 'win32' 等
 */
function getPlatform() {
    return os.platform();
}

/**
 * 获取操作系统的架构
 * @returns {string} 操作系统的架构，如 'x64', 'arm64', 'ia32' 等
 */
function getArchitecture() {
    return os.arch();
}

/**
 * 获取操作系统的总内存（字节数）
 * @returns {number} 操作系统的总内存（字节数）
 */
function getTotalMemory() {
    return os.totalmem();
}

/**
 * 获取操作系统的空闲内存（字节数）
 * @returns {number} 操作系统的空闲内存（字节数）
 */
function getFreeMemory() {
    return os.freemem();
}

/**
 * 获取操作系统的系统时间
 * @returns {Date} 当前操作系统的时间
 */
function getSystemUptime() {
    return os.uptime();
}

/**
 * 获取当前操作系统的用户信息
 * @returns {Object[]} 当前系统用户信息的数组
 */
function getUserInfo() {
    return os.userInfo();
}

/**
 * 获取操作系统的临时目录路径
 * @returns {string} 操作系统临时目录的路径
 */
function getTempDir() {
    return os.tmpdir();
}

/**
 * 获取所有操作系统的基本信息
 * @returns {Object} 包含所有操作系统基本信息的对象
 */
function getAllInfo() {
    return {
        localIPAddress: getLocalIPAddress(),
        hostName: getHostName(),
        platform: getPlatform(),
        architecture: getArchitecture(),
        totalMemory: getTotalMemory(),
        freeMemory: getFreeMemory(),
        systemUptime: getSystemUptime(),
        userInfo: getUserInfo(),
        tempDir: getTempDir()
    };
}

const osUtils = {
    getLocalIPAddress,
    getHostName,
    getPlatform,
    getArchitecture,
    getTotalMemory,
    getFreeMemory,
    getSystemUptime,
    getUserInfo,
    getTempDir,
    getAllInfo
};

export default osUtils;
