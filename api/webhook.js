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
				"title": "【语雀】tarspay今日上线通知(v1.6.9)",
				"content": [
					[{
							"tag": "text",
							"text": "TP项目有更新: "
						},
						{
							"tag": "a",
							"text": "前端改动请查看",
							"href": "https://chaoduichen.yuque.com/staff-ab80td/web/nagw2nkq9wfage8b"
						}
					]
				]
			}
		}
	}
}  
  
  // 发送POST请求到Webhook URL
  flyio.post('https://open.larksuite.com/open-apis/bot/v2/hook/c13593bf-a1a8-42d3-b9f3-547278324699', onLineMessage)
    .then(response => {
      // 请求成功
      console.log('Webhook发送成功',response.data);
    })
    .catch(error => {
      // 请求失败
      console.error('Webhook发送失败:', error);
    });