import * as fs from 'fs';
import * as path from 'path';

function saveArticleToFile(articleText) {
    const timestamp = Date.now();
    const filename = `${timestamp}.txt`;
    
    // 获取当前目录路径 (替代 __dirname) 
    const downloadDir = path.join(path.dirname(new URL(import.meta.url).pathname), config.downloadDir);
  
    // 确保目录存在
    if (!fs.existsSync(downloadDir)) {
      fs.mkdirSync(downloadDir, { recursive: true });
    }
  
    const filePath = path.join(downloadDir, filename);
    try {
      fs.writeFileSync(filePath, articleText, 'utf-8');
      console.log(`文章已保存至 ${filePath}`);
    } catch (error) {
      console.error('保存文件失败：', error);
      throw error;
    }
  }


  const fsUtils = {
    saveArticleToFile
}
export default fsUtils;
