# QQ Music Link Parser

一个基于 Flask 的 QQ 音乐链接解析工具，支持多种音质选择的在线音乐解析服务。

## 功能特点

- 支持解析 QQ 音乐链接
- 多种音质选择（128kbps, 320kbps, FLAC, Master）
- 响应式设计，支持移动端访问
- 美观的玻璃态界面设计
- 动态星空背景效果

## 在线演示

访问 http://47.115.207.158:8888/ 体验在线版本。

## 主要特性

- 支持解析 QQ 音乐分享链接
- 支持多种音质选择（标准、高品质、无损、母带）
- 移动端优化，支持手机访问
- 美观的玻璃态设计界面
- 动态星空背景效果

## 技术栈

- 后端：Python 3.6.8 + Flask 2.0.3
- 前端：HTML5 + CSS3 + JavaScript
- 服务器：Nginx + Gunicorn
- 部署环境：CentOS

## 安装部署

1. 克隆仓库：
```bash
git clone [your-repository-url]
cd qq-music-parser
```

2. 安装依赖：
```bash
pip install -r requirements.txt
```

3. 运行开发服务器：
```bash
python server.py
```

4. 生产环境部署：
```bash
# 使用 gunicorn 启动
gunicorn server:app -b 127.0.0.1:8887 -w 4

# 配置 Nginx 反向代理
# 参考 nginx 配置文件
```

## 环境要求

- Python 3.6+
- Flask 2.0.3
- Requests 2.27.1
- Gunicorn 20.1.0（生产环境）
- Nginx（生产环境）

## 使用说明

1. 在输入框中粘贴 QQ 音乐歌曲链接
2. 选择需要的音质选项
3. 点击解析按钮
4. 等待解析完成后下载音乐文件

## 注意事项

- 仅供学习和研究使用
- 请勿用于商业用途
- 遵守相关法律法规

## 许可证

MIT License
