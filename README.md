# puppeteer-app
- puppeteer自动化测试用例：yarn test
- 获取移动端页面截图(可截长图片):yarn screenshot
- 生成PDF文件:yarn pdf


### 飞机

```js
var METHOD_NAME = {
    pull: "getUpdates"
}

var requestHead = `https://api.telegram.org/bot${botToken}/`



function getUpdates() {
    let url = requestHead + METHOD_NAME.pull
    console.log(`output->requestHead`, url)
    flyio.get(url).then(res => {
        console.log(`output->res`, outPrint(res.response.body))
    }).catch(error => console.log(`output->error`, error.response.data))
}

function getMe() {
    let url = requestHead + 'getMe'
    console.log(`output->requestHead`, url)
    flyio.get(url).then(res => {
        console.log(`output->res`, outPrint(res.response.body))
    }).catch(error => console.log(`output->error`, error))
}


function sendMessage() {
    let url = `${requestHead}/sendMessage?chat_id=6493294406&sendDocument=`+ message
    flyio.post(url).then(res => {
        console.log(`output->res`, outPrint(res.response.body))
    }).catch(error => console.log(`output->error`, error))
}

```