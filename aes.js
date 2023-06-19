const CryptoJS = require('crypto-js');
// 密文
const ciphertext = '...';

// 密钥
const key = 'XHQY2021BESTWASD';

// // 其他解密参数（如偏移量）
const options = {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
};

var t = CryptoJS.enc.Utf8.parse("XHQY2021BESTWASD")



var e = "fmm/RfIEs8XpAQWu8F/vcXDVa2nCv0OCHkOgNwZ8kqvY7c5w9LwCPIGCn7VgXFZMBWC6sgM+t/VeIh37LIDo2lCrLX49Vqci1uP1Jmuew9oj4M9RlhJ8yn5xdx4uajJusQ4e04ZgChXypiEMETKiySh9u9b2tmXPjjlqCx8NU+vnRKb1yJD7J56hICCjyGkVHwxkPkUF4ls6ohm59H3bKg9gkn/5rzP2fk8XTHftFMCKa6Rc25UBIQRgTf0GscMUPkBYq5ZnS5myYQ/8ZvGU2DS2Y6b9/Tn1URud3+47FQmU0gN2EOIqLO6XLAA9QU3pD3WRnIRl66r7ZYWBOd64DTQCV+W1NGlGYPnGFZOsPNI1k3x+n2I1Ss7frzC9Z+Dr/9nU2/68RMz2LrtTf+NIDDiMbwUpUuC+Vf9UdOATJDu/pzCeoDY877wubWvWQy7vvAW20+6xS28YZdyU+fYmNmAjmFdJL8VYqVBvmi2u0qM="
// AES 解密
const r = CryptoJS.AES.decrypt(e, t, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
// 解密后的明文
const plaintext = CryptoJS.enc.Utf8.stringify(r).toString()

console.log(plaintext);