class MineyFriendsGame {
    constructor() {
        this.isTelegram = false;
        this.tg = null;
        this.coins = 200;
        this.limit = 5600;
        this.currentLimit = 262;
        this.recoveryRate = 50;
        this.recoveryInterval = null;
        
        this.init();
    }

    async init() {
        try {
            // Сначала инициализируем Telegram
            await this.initTelegram();
            
            // Затем инициализируем элементы и события
            this.initializeElements();
            this.bindEvents();
            
            // Запускаем игру
            this.startGame();
            
        } catch (error) {
            console.error('Error initializing game:', error);
            this.handleInitError();
        }
    }

    async initTelegram() {
        return new Promise((resolve) => {
            // Проверяем, находимся ли мы в Telegram
            if (window.Telegram && window.Telegram.WebApp) {
                this.tg = window.Telegram.WebApp;
                this.isTelegram = true;
                console.log('Running in Telegram Web App');
                
                // Ждем готовности Telegram Web App
                if (this.tg.isReady) {
                    this.setupTelegram();
                    resolve();
                } else {
                    this.tg.ready(() => {
                        this.setupTelegram();
                        resolve();
                    });
                }
            } else {
                console.log('Running in standalone mode');
                this.isTelegram = false;
                resolve();
            }
        });
    }

    setupTelegram() {
        if (!this.isTelegram) return;

        try {
            // Расширяем на весь экран
            this.tg.expand();
            
            // Включаем подтверждение закрытия
            this.tg.enableClosingConfirmation();
            
            // Устанавливаем цвета
            this.tg.setHeaderColor('#1a1a2e');
            this.tg.setBackgroundColor('#1a1a2e');
            
            // Применяем тему Telegram
            this.applyTelegramTheme();
            
            // Слушаем изменения темы
            this.tg.onEvent('themeChanged', () => {
                this.applyTelegramTheme();
            });
            
            console.log('Telegram Web App initialized successfully');
            
        } catch (error) {
            console.error('Error setting up Telegram:', error);
        }
    }

    applyTelegramTheme() {
        if (!this.isTelegram || !this.tg.themeParams) return;

        const theme = this.tg.themeParams;
        
        // Применяем цвета темы Telegram
        document.documentElement.style.setProperty('--tg-bg-color', theme.bg_color || '#1a1a2e');
        document.documentElement.style.setProperty('--tg-text-color', theme.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-button-color', theme.button_color || '#4cc9f0');
        
        // Обновляем фон
        document.body.style.background = theme.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
    }

    initializeElements() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.gameScreen = document.getElementById('gameScreen');
        this.loadingText = document.getElementById('loadingText');
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
        // Клики по картинке
        this.clickImage.addEventListener('click', (e) => this.handleClick(e));
        this.clickImage.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.handleClick(e);
        }, { passive: false });

        // Навигация
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Проверяем загрузку картинки
        this.setupImageHandling();
        
        // Свайп-навигация
        this.setupSwipeNavigation();
    }

    setupImageHandling() {
        this.clickImage.onerror = () => {
            console.log('Image failed to load, using fallback');
            this.imageContainer.classList.add('fallback');
        };
        
        this.clickImage.onload = () => {
            console.log('Image loaded successfully');
            this.imageContainer.classList.remove('fallback');
        };
        
        // Принудительно запускаем проверку
        if (this.clickImage.complete) {
            this.clickImage.onload();
        }
    }

    setupSwipeNavigation() {
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;

            // Проверяем, что это горизонтальный свайп (не вертикальный)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.switchToPage('shop');
                } else {
                    this.switchToPage('profile');
                }
            }
        });
    }

    startGame() {
        this.updateLoadingText('Загрузка данных...');
        
        // Загружаем сохраненные данные
        this.loadGameData();
        
        // Обновляем текст загрузки
        this.updateLoadingText('Запуск игры...');
        
        // Имитируем загрузку (можно убрать в продакшене)
        setTimeout(() => {
            this.hideLoadingScreen();
            this.updateDisplay();
            
            // Сохраняем данные каждые 30 секунд
            setInterval(() => this.saveGameData(), 30000);
            
        }, 1000);
    }

    updateLoadingText(text) {
        if (this.loadingText) {
            this.loadingText.textContent = text;
        }
    }

    hideLoadingScreen() {
        if (!this.loadingScreen) return;
        
        this.loadingScreen.style.opacity = '0';
        
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.gameScreen.style.display = 'flex';
            
            // Небольшая задержка для плавного появления
            setTimeout(() => {
                this.gameScreen.style.opacity = '1';
            }, 50);
        }, 500);
    }

    handleInitError() {
        this.updateLoadingText('Ошибка загрузки. Обновите страницу.');
        
        // Показываем кнопку перезагрузки через 3 секунды
        setTimeout(() => {
            const reloadBtn = document.createElement('button');
            reloadBtn.textContent = 'Перезагрузить';
            reloadBtn.style.marginTop = '20px';
            reloadBtn.style.padding = '10px 20px';
            reloadBtn.style.background = '#4cc9f0';
            reloadBtn.style.color = 'white';
            reloadBtn.style.border = 'none';
            reloadBtn.style.borderRadius = '10px';
            reloadBtn.style.cursor = 'pointer';
            reloadBtn.onclick = () => window.location.reload();
            
            this.loadingContent.appendChild(reloadBtn);
        }, 3000);
    }

    // ... остальные методы (handleClick, createClickEffect, updateDisplay, etc.) остаются без изменений
    // Копируем их из предыдущей версии:

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
        
        event.preventDefault();
    }

    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'coin-effect';
        effect.textContent = '+1';
        
        const rect = this.clickImage.getBoundingClientRect();
        const x = event.clientX || (event.touches && event.touches[0].clientX) || rect.width / 2;
        const y = event.clientY || (event.touches && event.touches[0].clientY) || rect.height / 2;
        
        effect.style.left = (x - rect.left) + 'px';
        effect.style.top = (y - rect.top) + 'px';
        
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

    switchToPage(page) {
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.page === page) {
                btn.classList.add('active');
            }
        });
        console.log('Switched to page:', page);
    }

    handleNavigation(event) {
        const targetPage = event.currentTarget.dataset.page;
        this.switchToPage(targetPage);
    }

    loadGameData() {
        try {
            const savedData = localStorage.getItem('miney_friends_save');
            if (savedData) {
                const data = JSON.parse(savedData);
                this.coins = data.coins || 200;
                this.currentLimit = data.currentLimit || 262;
                console.log('Game data loaded');
            }
        } catch (error) {
            console.error('Error loading game data:', error);
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
            console.log('Game data saved');
        } catch (error) {
            console.error('Error saving game data:', error);
        }
    }
}

// Запускаем игру когда страница полностью загружена
window.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting game...');
    window.game = new MineyFriendsGame();
});

// Сохраняем при закрытии
window.addEventListener('beforeunload', () => {
    if (window.game) {
        window.game.saveGameData();
    }
});
