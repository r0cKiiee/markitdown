const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.FUNCTIONCAT_RUNTIME_PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 提供静态文件（前端 Vue.js）
app.use(express.static(path.join(__dirname, 'public')));

// API: 处理 Markdown 转换请求
app.post('/api/convert', async (req, res) => {
    const { markdown } = req.body;
    if (!markdown) {
        return res.status(400).json({ error: 'Markdown 内容不能为空' });
    }

    try {
        // 使用 markdown-it 库转换 Markdown -> HTML
        const MarkdownIt = require('markdown-it');
        const md = new MarkdownIt();
        const htmlContent = md.render(markdown);
        
        res.json({ html: htmlContent });
    } catch (error) {
        console.error('Markdown 转换失败:', error);
        res.status(500).json({ error: 'Markdown 解析失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
});
