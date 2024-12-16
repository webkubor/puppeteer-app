document.addEventListener('click', function (event) {
    event.preventDefault();
    const targetElement = event.target; // 获取点击的目标元素

    // 获取 DOM 的 HTML
    const domContent = targetElement.outerHTML;

    // 提取所有样式
    const styles = Array.from(document.styleSheets).map(sheet => {
        try {
            return Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n');
        } catch (err) {
            console.warn('Cannot access stylesheet: ', sheet.href, err);
            return '';
        }
    }).join('\n');

    // 创建完整 HTML 文件内容
    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exported DOM</title>
    <style>
        ${styles}
    </style>
</head>
<body>
    ${domContent}
</body>
</html>
    `;

    // 创建 Blob 并生成下载链接
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'index.html';
    downloadLink.click();
});