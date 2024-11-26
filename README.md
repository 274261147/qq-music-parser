# QQ Music Link Parser

一个基于 Flask 的 QQ 音乐链接解析工具，支持多种音质选择的在线音乐解析服务。

## 致谢

本项目基于 [Suxiaoqinx](https://github.com/Suxiaoqinx) 的代码进行修改和优化。特此感谢原作者的贡献。如有任何侵权问题，请联系我们，我们会立即删除相关内容。

## 免责声明

本项目仅供学习和研究使用，请勿用于商业用途。使用本项目所产生的一切后果由使用者自行承担。如果本项目侵犯了您的权益，请联系我们，我们会立即处理。

## 功能特点

- 支持解析 QQ 音乐链接
- 多种音质选择（128kbps, 320kbps, FLAC, Master）
- 响应式设计，支持移动端访问
- 美观的玻璃态界面设计
- 动态星空背景效果

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

## Docker 部署

使用 Docker 是最简单的部署方式：

1. 克隆仓库：
```bash
git clone https://github.com/274261147/qq-music-parser.git
cd qq-music-parser
```

2. 使用 Docker Compose 启动：
```bash
docker-compose up -d
```

服务将在 http://localhost:8888 启动。

## 环境要求

- Python 3.6+
- Flask 2.0.3
- Requests 2.27.1
- Gunicorn 20.1.0（生产环境）
- Nginx（生产环境）

## 使用说明

### 获取 QQ 音乐 Cookie

在使用本工具之前，你需要：

1. 登录 QQ 音乐网页版 (https://y.qq.com/)
2. 打开浏览器开发者工具（F12 或右键 -> 检查）
3. 切换到 Network（网络）标签
4. 刷新页面
5. 在请求列表中找到任意一个请求
6. 在请求头中找到 "Cookie" 字段
7. 复制整个 Cookie 值

### 配置 Cookie

将复制的 Cookie 替换到 `yhx_tjh.py` 文件中的以下位置：

```python
def main():
    cookie_str = '在这里粘贴你的 Cookie'  # 替换这里的内容
    qqmusic = QQMusic()
    qqmusic.set_cookies(cookie_str)
```

注意：
- Cookie 包含你的个人信息，请勿分享给他人
- Cookie 可能会定期失效，需要重新获取
- 使用自己的 Cookie 可以避免访问限制

### 使用本工具

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
