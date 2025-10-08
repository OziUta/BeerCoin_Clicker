class ClickerGame {
    constructor() {
        this.tg = new TelegramIntegration();
        this.coins = 200; // Теперь только одни монеты
        this.limit = 5600;
        this.currentLimit = 262;
        this.recoveryRate = 50;
        this.recoveryInterval = null;
        
        this.initializeElements();
        this.bindEvents();
        this.initGame();
    }

    initializeElements() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.clickImage = document.getElementById('clickImage');
        this.coinsCount = document.getElementById('coinsCount');
        this.currentLimitDisplay = document.getElementById('currentLimit');
        this.totalLimitDisplay = document.getElementById('totalLimit');
        this.effectsContainer = document.getElementById('effectsContainer');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.limitDisplayMain = document.querySelector('.limit-display-main');
        this.imageContainer = document.querySelector('.image-container');
    }

    bindEvents() {
        this.clickImage.addEventListener('click', (e) => this.handleClick(e));
        this.clickImage.addEventListener('touchstart', (e) => this.handleClick(e));
        
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Проверяем загрузку картинки
        this.checkImageLoad();
        
        this.setupSwipeNavigation();
    }

    checkImageLoad() {
        this.clickImage.onerror = () => {
            console.log('Image failed to load, using fallback');
            this.imageContainer.classList.add('fallback');
        };
        
        this.clickImage.onload = () => {
            console.log('Image loaded successfully');
            this.imageContainer.classList.remove('fallback');
        };
    }

    setupSwipeNavigation() {
        let startX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            if (Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.switchToPage('shop');
                } else {
                    this.switchToPage('profile');
                }
            }
        });
    }

    switchToPage(page) {
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === page) {
                btn.classList.add('active');
            }
        });
        console.log('Switched to page:', page);
    }

    initGame() {
        this.loadGameData();
        
        setTimeout(() => {
            this.hideLoadingScreen();
            this.updateDisplay();
        }, 1500);
    }

    loadGameData() {
        const savedData = localStorage.getItem('miney_friends_save');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.coins = data.coins || 200;
            this.currentLimit = data.currentLimit || 262;
        }
    }

    saveGameData() {
        const data = {
            coins: this.coins,
            currentLimit: this.currentLimit,
            timestamp: Date.now()
        };
        localStorage.setItem('miney_friends_save', JSON.stringify(data));
        
        this.tg.sendDataToBot({
            type: 'game_save',
            data: data
        });
    }

    handleClick(event) {
        if (this.currentLimit <= 0) {
            this.showLimitExceeded();
            return;
        }

        this.coins += 1;
        this.currentLimit -= 1;
        
        this.updateDisplay();
        this.createClickEffect(event);
        this.saveGameData();
        
        if (this.currentLimit <= 0 && !this.recoveryInterval) {
            this.startLimitRecovery();
        }
        
        // Предотвращаем выделение текста на мобильных
        event.preventDefault();
    }

    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'coin-effect';
        effect.textContent = '+1';
        
        const rect = this.clickImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        const randomX = (Math.random() - 0.5) * 50;
        effect.style.transform = `translate(${randomX}px, 0)`;
        
        this.effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    updateDisplay() {
        this.coinsCount.textContent = this.coins;
        this.currentLimitDisplay.textContent = this.currentLimit;
        this.totalLimitDisplay.textContent = this.limit;
    }

    startLimitRecovery() {
        this.limitDisplayMain.classList.add('recovering');
        
        this.recoveryInterval = setInterval(() => {
            if (this.currentLimit < this.limit) {
                this.currentLimit += this.recoveryRate;
                
                if (this.currentLimit >= this.limit) {
                    this.currentLimit = this.limit;
                    clearInterval(this.recoveryInterval);
                    this.recoveryInterval = null;
                    this.limitDisplayMain.classList.remove('recovering');
                    this.showRecoveryComplete();
                }
                
                this.updateDisplay();
                this.saveGameData();
            }
        }, 1000);
    }

    showRecoveryComplete() {
        const effect = document.createElement('div');
        effect.className = 'coin-effect recovery-complete';
        effect.textContent = '✓ Лимит восстановлен';
        effect.style.left = '50%';
        effect.style.top = '50%';
        effect.style.transform = 'translateX(-50%)';
        
        this.effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 2000);
    }

    showLimitExceeded() {
        const effect = document.createElement('div');
        effect.className = 'coin-effect limit-exceeded';
        effect.textContent = 'Лимит исчерпан!';
        effect.style.left = '50%';
        effect.style.top = '50%';
        effect.style.transform = 'translateX(-50%)';
        
        this.effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    handleNavigation(event) {
        const targetPage = event.currentTarget.dataset.page;
        
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        console.log(`Переход на страницу: ${targetPage}`);
    }
}

// Инициализация когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ClickerGame();
});

// Сохраняем данные при закрытии страницы
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.saveGameData();
    }
});
