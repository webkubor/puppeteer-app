function transUrl(url) {
    if (!url) return url
    const querystring = require('querystring');
    return querystring.parse(url)
}

function mergeJsonUrl (json, orgin='') {
    if (!json) return json
    const querystring = require('querystring');
    if (orgin) return `${orgin}?` + querystring.stringify(json)
    return querystring.stringify(json)
}

let targetObj = {name:'cg',course:['jade','node'],from:'zh'}
let targetUrl = 'https://cn.bing.com/search?q=node&qs=n&form=QBRE&sp=-1&pq=node&sc=8-4&sk=&cvid=9101E592A0A74B12B013286EAEF5F1C4'
console.log(transUrl(targetUrl))
console.log(mergeJsonUrl(targetObj, 'www.baidu.com'))