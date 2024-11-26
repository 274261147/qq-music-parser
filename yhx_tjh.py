import requests
import time
import random
import json
import base64


class QQMusic:
    def __init__(self):
        self.base_url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
        self.guid = '10000'
        self.uin = '0'
        self.cookies = {}
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        self.file_config = {
            '128': {'s': 'M500', 'e': '.mp3', 'bitrate': '128kbps'},
            '320': {'s': 'M800', 'e': '.mp3', 'bitrate': '320kbps'},
            'flac': {'s': 'F000', 'e': '.flac', 'bitrate': 'FLAC'},
            'master': {'s': 'AI00', 'e': '.flac', 'bitrate': 'Master'},
            'atmos_2': {'s': 'Q000', 'e': '.flac', 'bitrate': 'Atmos 2'},
            'atmos_51': {'s': 'Q001', 'e': '.flac', 'bitrate': 'Atmos 5.1'},
            'ogg_640': {'s': 'O801', 'e': '.ogg', 'bitrate': '640kbps'},
            'ogg_320': {'s': 'O800', 'e': '.ogg', 'bitrate': '320kbps'},
            'ogg_192': {'s': 'O600', 'e': '.ogg', 'bitrate': '192kbps'},
            'ogg_96': {'s': 'O400', 'e': '.ogg', 'bitrate': '96kbps'},
            'aac_192': {'s': 'C600', 'e': '.m4a', 'bitrate': '192kbps'},
            'aac_96': {'s': 'C400', 'e': '.m4a', 'bitrate': '96kbps'},
            'aac_48': {'s': 'C200', 'e': '.m4a', 'bitrate': '48kbps'}
        }
        self.song_url = 'https://c.y.qq.com/v8/fcg-bin/fcg_play_single_song.fcg'
        self.lyric_url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'

    def set_cookies(self, cookie_str):
        cookies = {}
        for cookie in cookie_str.split('; '):
            key, value = cookie.split('=', 1)
            cookies[key] = value
        self.cookies = cookies

    def ids(self, url):
        if 'c6.y.qq.com' in url:
            response = requests.get(url, allow_redirects=False)
            url = response.headers.get('Location')

        if 'y.qq.com' in url:
            if '/songDetail/' in url:
                index = url.find('/songDetail/') + len('/songDetail/')
                song_id = url[index:].split('/')[0]
                return song_id

            if 'id=' in url:
                index = url.find('id=') + 3
                song_id = url[index:].split('&')[0]
                return song_id

        return None

    def get_music_url(self, songmid, file_type='flac'):
        if file_type not in self.file_config:
            raise ValueError("Invalid file_type. Choose from 'm4a', '128', '320', 'flac', 'ape', 'dts")

        file_info = self.file_config[file_type]
        file = f"{file_info['s']}{songmid}{songmid}{file_info['e']}"

        req_data = {
            'req_1': {
                'module': 'vkey.GetVkeyServer',
                'method': 'CgiGetVkey',
                'param': {
                    'filename': [file],
                    'guid': self.guid,
                    'songmid': [songmid],
                    'songtype': [0],
                    'uin': self.uin,
                    'loginflag': 1,
                    'platform': '20',
                },
            },
            'loginUin': self.uin,
            'comm': {
                'uin': self.uin,
                'format': 'json',
                'ct': 24,
                'cv': 0,
            },
        }

        response = requests.post(self.base_url, json=req_data, cookies=self.cookies, headers=self.headers)
        data = response.json()
        purl = data['req_1']['data']['midurlinfo'][0]['purl']
        if purl == '':
            return None

        url = data['req_1']['data']['sip'][1] + purl
        prefix = purl[:4]
        bitrate = next((info['bitrate'] for key, info in self.file_config.items() if info['s'] == prefix), '')

        return {'url': url.replace("http://", "https://"), 'bitrate': bitrate}

    def get_music_song(self, mid, sid):
        if sid != 0:
            req_data = {
                'songid': sid,
                'platform': 'yqq',
                'format': 'json',
            }
        else:
            req_data = {
                'songmid': mid,
                'platform': 'yqq',
                'format': 'json',
            }

        response = requests.post(self.song_url, data=req_data, cookies=self.cookies, headers=self.headers)
        data = response.json()
        if 'data' in data and len(data['data']) > 0:
            song_info = data['data'][0]
            album_info = song_info.get('album', {})
            singers = song_info.get('singer', [])
            singer_names = ', '.join([singer.get('name', 'Unknown') for singer in singers])

            album_mid = album_info.get('mid')
            img_url = f'https://y.qq.com/music/photo_new/T002R800x800M000{album_mid}.jpg?max_age=2592000' if album_mid else 'https://axidiqolol53.objectstorage.ap-seoul-1.oci.customer-oci.com/n/axidiqolol53/b/lusic/o/resources/cover.jpg'

            return {
                'name': song_info.get('name', 'Unknown'),
                'album': album_info.get('name', 'Unknown'),
                'singer': singer_names,
                'pic': img_url,
                'mid': song_info.get('mid', mid),
                'id': song_info.get('id', sid)
            }
        else:
            return {'msg': '信息获取错误/歌曲不存在'}

    def get_music_lyric_new(self, songid):
        payload = {
            "music.musichallSong.PlayLyricInfo.GetPlayLyricInfo": {
                "module": "music.musichallSong.PlayLyricInfo",
                "method": "GetPlayLyricInfo",
                "param": {
                    "trans_t": 0,
                    "roma_t": 0,
                    "crypt": 0,
                    "lrc_t": 0,
                    "interval": 208,
                    "trans": 1,
                    "ct": 6,
                    "singerName": "",
                    "type": 0,
                    "qrc_t": 0,
                    "cv": 80600,
                    "roma": 1,
                    "songID": songid,
                    "qrc": 0,
                },
            },
            "comm": {
                "wid": "",
                "tmeAppID": "qqmusic",
                "cv": "80600",
                "gzip": "0",
            },
        }

        try:
            res = requests.post(self.base_url, json=payload, cookies=self.cookies, headers=self.headers)
            res.raise_for_status()
            d = res.json()
            lyric_data = d["music.musichallSong.PlayLyricInfo.GetPlayLyricInfo"]["data"]
            if 'lyric' in lyric_data and lyric_data['lyric']:
                lyric = base64.b64decode(lyric_data['lyric']).decode('utf-8')
                tylyric = base64.b64decode(lyric_data['trans']).decode('utf-8')
            else:
                lyric = ''
                tylyric = ''
            return {'lyric': lyric, 'tylyric': tylyric}

        except Exception as e:
            print(f"Error fetching lyrics: {e}")
            return {'error': '无法获取歌词'}


def main():
    cookie_str = '{{ cookie_string }}'  # Replace with your actual cookie string
    qqmusic = QQMusic()
    qqmusic.set_cookies(cookie_str)

    song_url = input("Enter the QQ Music song URL: ")
    songmid = qqmusic.ids(song_url)

    try:
        sid = int(songmid)
        mid = 0
    except ValueError:
        sid = 0
        mid = songmid

    info = qqmusic.get_music_song(mid, sid)
    file_types = ['aac_96', 'flac', '128', '320']

    print(f"Song Information: {info}")

    print("Fetching URLs for different bitrates:")
    for file_type in file_types:
        song_url_info = qqmusic.get_music_url(mid, file_type)
        if song_url_info:
            print(f"{file_type} URL: {song_url_info['url']} (Bitrate: {song_url_info['bitrate']})")

    print("Fetching lyrics:")
    lyrics = qqmusic.get_music_lyric_new(info.get('id'))
    print(f"Lyrics: {lyrics['lyric']}")
    print(f"Translated Lyrics: {lyrics['tylyric']}")


if __name__ == '__main__':
    main()
