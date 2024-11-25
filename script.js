// 星空背景效果
class Star {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random();
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;

        // 闪烁效果
        this.opacity = Math.sin(Date.now() * 0.001 * Math.random()) * 0.5 + 0.5;
    }

    draw(ctx) {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ShootingStar {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = 0;
        this.length = Math.random() * 80 + 20;
        this.speed = Math.random() * 10 + 10;
        this.opacity = 0;
        this.active = false;
    }

    update() {
        if (!this.active) {
            if (Math.random() < 0.005) {
                this.active = true;
                this.opacity = 1;
            }
            return;
        }

        this.x += this.speed;
        this.y += this.speed;
        this.opacity -= 0.01;

        if (this.opacity <= 0) {
            this.reset();
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.strokeStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x - this.length, this.y - this.length);
        ctx.stroke();
    }
}

// 初始化星空
function initStarryBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'starry-background';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.pointerEvents = 'none';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    
    // 根据设备性能调整星星数量
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const starCount = isMobile ? 100 : 200; // 移动端减少星星数量
    const stars = Array(starCount).fill().map(() => new Star());
    const shootingStars = Array(isMobile ? 1 : 3).fill().map(() => new ShootingStar());

    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
    }

    // 优化动画性能
    let lastTime = 0;
    const fps = isMobile ? 30 : 60; // 移动端降低帧率
    const interval = 1000 / fps;

    function animate(currentTime) {
        if (currentTime - lastTime >= interval) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            stars.forEach(star => {
                star.update();
                star.draw(ctx);
            });

            shootingStars.forEach(shootingStar => {
                shootingStar.update();
                shootingStar.draw(ctx);
            });

            lastTime = currentTime;
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animate(0);
}

// 原有的音乐解析代码
class MusicPlayer {
    constructor() {
        this.currentTrack = null;
        this.isPlaying = false;
        this.playlist = [];
        this.currentIndex = 0;
        this.progress = 0;

        // Initialize UI elements
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.musicList = document.querySelector('.music-list');
        this.trackName = document.getElementById('trackName');
        this.artistName = document.getElementById('artistName');
        this.albumArt = document.getElementById('albumArt');
        this.playBtn = document.getElementById('playBtn');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.qualitySelect = document.getElementById('qualitySelect');
        this.progressBar = document.querySelector('.progress');
        this.currentTimeEl = document.querySelector('.current-time');
        this.totalTimeEl = document.querySelector('.total-time');
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchMusic());
        this.playBtn.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.playPrevious());
        this.nextBtn.addEventListener('click', () => this.playNext());
        this.qualitySelect.addEventListener('change', () => this.changeQuality());

        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.searchMusic();
            }
        });

        // Progress bar click event
        document.querySelector('.progress-bar').addEventListener('click', (e) => {
            const progressBar = e.currentTarget;
            const clickPosition = e.offsetX / progressBar.offsetWidth;
            this.progress = clickPosition * 100;
            this.updateProgress();
        });
    }

    async searchMusic() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        try {
            const response = await this.mockSearchRequest(query);
            this.displaySearchResults(response);
        } catch (error) {
            console.error('搜索出错:', error);
            alert('搜索时出现错误，请稍后重试');
        }
    }

    mockSearchRequest(query) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        name: '示例歌曲 1',
                        artist: '演唱者 1',
                        albumArt: 'https://via.placeholder.com/300/1db954/ffffff?text=Track+1',
                        duration: 180
                    },
                    {
                        id: '2',
                        name: '示例歌曲 2',
                        artist: '演唱者 2',
                        albumArt: 'https://via.placeholder.com/300/1db954/ffffff?text=Track+2',
                        duration: 240
                    }
                ]);
            }, 500);
        });
    }

    displaySearchResults(results) {
        this.musicList.innerHTML = '';
        this.playlist = results;

        results.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'music-item';
            trackElement.innerHTML = `
                <div>
                    <h3>${track.name}</h3>
                    <p>${track.artist}</p>
                </div>
            `;
            trackElement.addEventListener('click', () => this.playTrack(index));
            this.musicList.appendChild(trackElement);
        });
    }

    playTrack(index) {
        this.currentIndex = index;
        const track = this.playlist[index];
        this.currentTrack = track;

        this.trackName.textContent = track.name;
        this.artistName.textContent = track.artist;
        this.albumArt.src = track.albumArt;
        
        // Reset progress
        this.progress = 0;
        this.updateProgress();
        this.updateTimes(0, track.duration);
        
        this.isPlaying = true;
        this.updatePlayButton();
        this.startProgressSimulation();
    }

    togglePlay() {
        if (!this.currentTrack) return;
        this.isPlaying = !this.isPlaying;
        this.updatePlayButton();

        if (this.isPlaying) {
            this.startProgressSimulation();
        }
    }

    updatePlayButton() {
        const icon = this.playBtn.querySelector('i');
        icon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
    }

    playPrevious() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.playlist.length) % this.playlist.length;
        this.playTrack(this.currentIndex);
    }

    playNext() {
        if (this.playlist.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.playlist.length;
        this.playTrack(this.currentIndex);
    }

    changeQuality() {
        const quality = this.qualitySelect.value;
        console.log('Changed quality to:', quality);
        // Implement quality change logic here
    }

    updateProgress() {
        this.progressBar.style.width = `${this.progress}%`;
    }

    updateTimes(current, total) {
        this.currentTimeEl.textContent = this.formatTime(current);
        this.totalTimeEl.textContent = this.formatTime(total);
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    startProgressSimulation() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
        }

        if (!this.isPlaying) return;

        const duration = this.currentTrack.duration;
        const startTime = Date.now() - (this.progress / 100) * duration * 1000;

        this.progressInterval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(this.progressInterval);
                return;
            }

            const elapsed = (Date.now() - startTime) / 1000;
            this.progress = (elapsed / duration) * 100;

            if (this.progress >= 100) {
                this.playNext();
                return;
            }

            this.updateProgress();
            this.updateTimes(elapsed, duration);
        }, 100);
    }
}

class MusicParser {
    constructor() {
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.musicList = document.querySelector('.music-list');
        this.statusText = document.getElementById('statusText');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.apiStatus = document.getElementById('apiStatus');
        
        this.initializeEventListeners();
        this.checkAPIStatus();
    }

    initializeEventListeners() {
        this.searchBtn.addEventListener('click', () => this.handleSearch());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    async handleSearch() {
        const url = this.searchInput.value.trim();
        if (!url) {
            this.showError('请输入音乐链接');
            return;
        }

        const quality = document.querySelector('input[name="quality"]:checked').value;
        this.updateStatus('解析链接中...', 'searching');
        this.clearResults();

        try {
            const results = await this.parseMusic(url, quality);
            this.displayResults(results);
            this.updateStatus('解析完成', 'success');
        } catch (error) {
            this.showError('解析失败: ' + error.message);
        }
    }

    async parseMusic(url, quality) {
        try {
            const response = await fetch('/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    query: url,
                    quality: quality
                })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || '解析请求失败');
            }

            const data = await response.json();
            return data.results;
        } catch (error) {
            throw error;
        }
    }

    displayResults(results) {
        this.clearResults();

        if (!results || results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = '未找到相关音乐';
            this.musicList.appendChild(noResults);
            return;
        }

        results.forEach(result => {
            const musicItem = this.createMusicItem(result);
            this.musicList.appendChild(musicItem);
        });
    }

    createMusicItem(result) {
        const item = document.createElement('div');
        item.className = 'music-item';

        const info = document.createElement('div');
        info.className = 'music-info';

        const title = document.createElement('h4');
        title.textContent = result.title;

        const artist = document.createElement('p');
        artist.textContent = `${result.artist} | ${result.quality}kbps | ${result.size}`;

        info.appendChild(title);
        info.appendChild(artist);

        const downloadBtn = document.createElement('button');
        downloadBtn.className = 'download-btn';
        downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
        downloadBtn.addEventListener('click', () => this.downloadFile(result.url, `${result.title} - ${result.artist}.mp3`));

        item.appendChild(info);
        item.appendChild(downloadBtn);

        return item;
    }

    downloadFile(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    clearResults() {
        while (this.musicList.firstChild) {
            this.musicList.removeChild(this.musicList.firstChild);
        }
    }

    updateStatus(message, type = 'normal') {
        this.statusText.textContent = message;
        this.statusIndicator.className = 'status-indicator';
        
        switch (type) {
            case 'success':
                this.statusIndicator.style.background = 'var(--success-color)';
                break;
            case 'error':
                this.statusIndicator.style.background = 'var(--error-color)';
                break;
            case 'searching':
            case 'processing':
                this.statusIndicator.style.background = 'var(--primary-color)';
                break;
            default:
                this.statusIndicator.style.background = 'var(--text-secondary)';
        }
    }

    showError(message) {
        this.updateStatus(message, 'error');
    }

    async checkAPIStatus() {
        try {
            const response = await fetch('/status');
            if (response.ok) {
                this.apiStatus.textContent = '正常';
                this.apiStatus.className = 'status-good';
            } else {
                throw new Error();
            }
        } catch {
            this.apiStatus.textContent = '异常';
            this.apiStatus.className = 'status-error';
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    initStarryBackground();
    new MusicParser();

    // 防止双击缩放
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // 防止页面弹性滚动
    document.body.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // 优化移动端点击延迟
    if ('ontouchstart' in window) {
        document.documentElement.style.touchAction = 'manipulation';
    }
});
