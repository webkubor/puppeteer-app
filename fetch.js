var fly = require("flyio")


fly.config.baseURL = `https://api.defipay.biz/api-service/`

const NONCE = Math.floor(Date.now() / 1000);
fly.interceptors.request.use((request) => {
    request.headers.Accept = "application/json";
    request.headers["BIZ-API-KEY"] = "zh_CN"; //公钥
    request.headers["BIZ-API-NONCE"] = NONCE; //时间戳
    request.headers["BIZ-API-SIGNATURE"] = "zh_CN"; //签名

    return request;
});

fetchDetail({ transNo: "OIX2WE4J" })
async function fetchDetail(params) {
    console.time('fetchDetail执行时间')
    try {
        const result = await fly.get('/v1/external/order/getDetail', params)
        console.log("结果输出", result.data);
    } catch (error) {
        console.log(error);
    }
    console.timeEnd('fetchDetail执行时间')
}

