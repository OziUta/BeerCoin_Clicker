console.log('=== APP STARTING ===');

// Простой класс игры
class MineyFriendsGame {
    constructor() {
        console.log('Game constructor called');
        this.coins = 200;
        this.limit = 5600;
        this.currentLimit = 262;
        this.recoveryRate = 50;
        this.recoveryInterval = null;
        
        this.init();
    }

    async init() {
        console.log('Game init started');
        
        try {
            // Сначала инициализируем элементы
            this.initElements();
            console.log('Elements initialized');
            
            // Показываем статус загрузки
            this.updateLoadingText('Загрузка Telegram...');
            
            // Инициализируем Telegram
            await this.initTelegram();
            console.log('Telegram initialized');
            
            // Загружаем сохраненные данные
            this.loadGameData();
            console.log('Game data loaded');
            
            // Запускаем игру
            this.startGame();
            console.log('Game started successfully');
            
        } catch (error) {
            console.error('Init error:', error);
            this.updateLoadingText('Ошибка: ' + error.message);
        }
    }

    initElements() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.loadingText = document.getElementById('loadingText');
        this.coinsCount = document.getElementById('coinsCount');
        this.currentLimitDisplay = document.getElementById('currentLimit');
        this.totalLimitDisplay = document.getElementById('totalLimit');
        this.effectsContainer = document.getElementById('effectsContainer');
        this.imageContainer = document.querySelector('.image-container');
        
        console.log('Elements found:', {
            loadingScreen: !!this.loadingScreen,
            gameScreen: !!this.gameScreen,
            loadingText: !!this.loadingText,
            coinsCount: !!this.coinsCount
        });
    }

    async initTelegram() {
        return new Promise((resolve) => {
            console.log('Checking for Telegram Web App...');
            
            if (window.Telegram && window.Telegram.WebApp) {
                console.log('Telegram Web App found');
                this.tg = window.Telegram.WebApp;
                
                // Ждем готовности Telegram
                if (this.tg.isReady) {
                    console.log('Telegram is ready');
                    this.setupTelegram();
                    resolve();
                } else {
                    console.log('Waiting for Telegram ready...');
                    this.tg.ready(() => {
                        console.log('Telegram ready callback fired');
                        this.setupTelegram();
                        resolve();
                    });
                    
                    // Таймаут на случай если ready не сработает
                    setTimeout(() => {
                        console.log('Telegram ready timeout, continuing anyway');
                        resolve();
                    }, 1000);
                }
            } else {
                console.log('Telegram Web App not found, running in browser');
                resolve();
            }
        });
    }

    setupTelegram() {
        if (!this.tg) return;
        
        try {
            console.log('Setting up Telegram...');
            this.tg.expand();
            this.tg.enableClosingConfirmation();
            console.log('Telegram setup complete');
        } catch (error) {
            console.error('Telegram setup error:', error);
        }
    }

    updateLoadingText(text) {
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
    }

    startGame() {
        console.log('Starting game...');
        this.updateLoadingText('Запуск игры...');
        
        // Инициализируем события
        this.bindEvents();
        console.log('Events bound');
        
        // Обновляем дисплей
        this.updateDisplay();
        console.log('Display updated');
        
        // Показываем игровой экран
        setTimeout(() => {
            this.showGameScreen();
            console.log('Game screen shown');
        }, 500);
    }

    bindEvents() {
        console.log('Binding events...');
        
        // Клик по картинке
        this.imageContainer.addEventListener('click', (e) => {
            console.log('Image clicked');
            this.handleClick(e);
        });
        
        // Тач по картинке
        this.imageContainer.addEventListener('touchstart', (e) => {
            console.log('Image touched');
            this.handleClick(e);
        });
        
        console.log('Events bound successfully');
    }

    handleClick(event) {
        console.log('Handle click called');
        
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
        
        event.preventDefault();
    }

    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'coin-effect';
        effect.textContent = '+1';
        effect.style.left = '50%';
        effect.style.top = '50%';
        
        this.effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    updateDisplay() {
        if (this.coinsCount) this.coinsCount.textContent = this.coins;
        if (this.currentLimitDisplay) this.currentLimitDisplay.textContent = this.currentLimit;
        if (this.totalLimitDisplay) this.totalLimitDisplay.textContent = this.limit;
    }

    startLimitRecovery() {
        this.recoveryInterval = setInterval(() => {
            if (this.currentLimit < this.limit) {
                this.currentLimit += this.recoveryRate;
                
                if (this.currentLimit >= this.limit) {
                    this.currentLimit = this.limit;
                    clearInterval(this.recoveryInterval);
                    this.recoveryInterval = null;
                }
                
                this.updateDisplay();
                this.saveGameData();
            }
        }, 1000);
    }

    showLimitExceeded() {
        const effect = document.createElement('div');
        effect.className = 'coin-effect limit-exceeded';
        effect.textContent = 'Лимит исчерпан!';
        effect.style.left = '50%';
        effect.style.top = '50%';
        effect.style.color = '#ff4444';
        
        this.effectsContainer.appendChild(effect);
        
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    showGameScreen() {
        if (!this.loadingScreen || !this.gameScreen) {
            console.error('Screens not found');
            return;
        }
        
        console.log('Showing game screen...');
        this.loadingScreen.style.display = 'none';
        this.gameScreen.style.display = 'flex';
        console.log('Game screen should be visible now');
    }

    loadGameData() {
        try {
            const savedData = localStorage.getItem('miney_friends_save');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.coins = data.coins || 200;
                this.currentLimit = data.currentLimit || 262;
            }
        } catch (error) {
            console.error('Load error:', error);
        }
    }

    saveGameData() {
        try {
            const data = {
                coins: this.coins,
                currentLimit: this.currentLimit,
                timestamp: Date.now()
            };
            localStorage.setItem('miney_friends_save', JSON.stringify(data));
        } catch (error) {
            console.error('Save error:', error);
        }
    }
}

// Запускаем игру когда страница загружена
console.log('Setting up DOMContentLoaded listener...');
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded fired, creating game instance...');
    window.game = new MineyFriendsGame();
});

console.log('=== APP INITIALIZED ===');
