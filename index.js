import chalk from 'chalk';
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'



function outPrint(obj) {
    const formattedObj = JSON.stringify(JSON.parse(obj), null, 2);
    return chalk.yellow(formattedObj);
}



const __dirname = fileURLToPath(new URL('.', import.meta.url))

const server = await createServer({
  // 任何合法的用户配置选项，加上 `mode` 和 `configFile`
  configFile: false,
  root: __dirname,
  server: {
    port: 1337,
  },
})
await server.listen()

server.printUrls()
server.bindCLIShortcuts({ print: true })


console.log(`output->outPrint`, outPrint('初始化'))