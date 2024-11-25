from flask import Flask, request, jsonify, send_from_directory
import os
import socket
from threading import Thread
import webbrowser
import time
from yhx_tjh import QQMusic

app = Flask(__name__)
qq_music = QQMusic()  # 创建QQMusic实例

# 静态文件路由
@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_file(path):
    return send_from_directory('.', path)

# API路由
@app.route('/status')
def check_status():
    return jsonify({'status': 'ok'})

@app.route('/search', methods=['POST'])
def search():
    try:
        data = request.get_json()
        url = data.get('query', '')
        quality = data.get('quality', '128')
        
        if not url:
            return jsonify({'error': '请输入音乐链接'}), 400
            
        # 从URL中获取歌曲ID
        song_id = qq_music.ids(url)
        if not song_id:
            return jsonify({'error': '无效的音乐链接'}), 400
            
        # 获取音乐下载链接
        result = qq_music.get_music_url(song_id, quality)
        if not result:
            return jsonify({'error': '无法获取该音质的下载链接'}), 400
            
        return jsonify({
            'results': [{
                'id': song_id,
                'title': '音乐',  # 这里可以添加获取歌曲信息的功能
                'artist': 'QQ音乐',
                'url': result['url'],
                'quality': result['bitrate'],
                'size': '未知大小'
            }]
        })
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def find_free_port():
    """找到一个可用的端口"""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('', 0))
        s.listen(1)
        port = s.getsockname()[1]
    return port

def open_browser(port):
    """在新线程中打开浏览器"""
    webbrowser.open(f'http://localhost:{port}')

if __name__ == '__main__':
    port = find_free_port()
    print(f'Starting server on port {port}...')
    
    # 在新线程中打开浏览器，但要等待一下确保服务器已启动
    def delayed_open():
        time.sleep(1.5)  # 等待1.5秒确保服务器已经启动
        webbrowser.open(f'http://localhost:{port}')
    
    Thread(target=delayed_open).start()
    
    # 启动Flask服务器，关闭调试模式
    app.run(port=port, debug=False)
