const flyio = require('flyio');


 // 构造要发送的消息体
 const textMessage = {
    msg_type: 'text',
    content: {
      text: '【语雀】新更新提醒'
    }
  };


  
const onLineMessage = {
    "msg_type": "post",
    "content": {
        "post": {
            "zh_cn": {
                "title": "【语雀】前端开发任务已分解",
                "content": [
                    [{
                        "tag": "text",
                        "text": "任务详情请查看 "
                    },
                    {
                        "tag": "a",
                        "text": "新更新提醒",
                        "href": "https://chaoduichen.yuque.com/staff-ab80td/web/wsmgl3"
                    },
                    {
                        "tag": "at",
                        "user_id": "7246249221332926496"
                    },
                    {
                        "tag": "at",
                        "user_id": "7246248401874976799"
                    },
                    {
                        "tag": "at",
                        "user_id": "7246254660581867552"
                    },
                    {
                        "tag": "at",
                        "user_id": "7246247782950895647"
                    }
                    ]
                ]
            }
        }
    }
}

let bigUrl = 'https://open.larksuite.com/open-apis/bot/v2/hook/c13593bf-a1a8-42d3-b9f3-547278324699'

let webURL = 'https://open.larksuite.com/open-apis/bot/v2/hook/6732ecf5-05c1-47e8-8295-9244490622df'
// 发送POST请求到Webhook URL
flyio.post(webURL, onLineMessage)
    .then(response => {
        // 请求成功
        console.log('Webhook发送成功', response.data);
    })
    .catch(error => {
        // 请求失败
        console.error('Webhook发送失败:', error);
    });