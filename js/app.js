class ClickerGame {
    constructor() {
        this.silver = 200;
        this.gold = 60;
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
        this.silverCount = document.getElementById('silverCount');
        this.goldCount = document.getElementById('goldCount');
        this.currentLimitDisplay = document.getElementById('currentLimit');
        this.totalLimitDisplay = document.getElementById('totalLimit');
        this.effectsContainer = document.getElementById('effectsContainer');
        this.navButtons = document.querySelectorAll('.nav-btn');
        this.limitDisplayMain = document.querySelector('.limit-display-main');
    }

    bindEvents() {
        this.clickImage.addEventListener('click', (e) => this.handleClick(e));
        
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleNavigation(e));
        });
    }

    initGame() {
        // Имитация загрузки ресурсов
        setTimeout(() => {
            this.hideLoadingScreen();
            this.updateDisplay();
        }, 2000);
    }

    hideLoadingScreen() {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
            this.loadingScreen.style.display = 'none';
            this.gameScreen.style.display = 'flex';
            
            setTimeout(() => {
                this.gameScreen.style.opacity = '1';
            }, 50);
        }, 500);
    }

    handleClick(event) {
        if (this.currentLimit <= 0) {
            this.showLimitExceeded();
            return;
        }

        // Увеличиваем серебро и уменьшаем лимит
        this.silver += 1;
        this.currentLimit -= 1;
        
        this.updateDisplay();
        this.createClickEffect(event);
        
        // Запускаем восстановление, если лимит исчерпан
        if (this.currentLimit <= 0 && !this.recoveryInterval) {
            this.startLimitRecovery();
        }
    }

    createClickEffect(event) {
        const effect = document.createElement('div');
        effect.className = 'coin-effect';
        effect.textContent = '+1';
        
        // Позиционируем эффект рядом с местом клика
        const rect = this.clickImage.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        effect.style.left = x + 'px';
        effect.style.top = y + 'px';
        
        // Случайное смещение для разнообразия
        const randomX = (Math.random() - 0.5) * 50;
        effect.style.transform = `translate(${randomX}px, 0)`;
        
        this.effectsContainer.appendChild(effect);
        
        // Удаление эффекта после анимации
        setTimeout(() => {
            if (effect.parentNode) {
                effect.remove();
            }
        }, 1500);
    }

    updateDisplay() {
        this.silverCount.textContent = this.silver.toString().padStart(3, '0');
        this.goldCount.textContent = this.gold.toString().padStart(3, '0');
        this.currentLimitDisplay.textContent = this.currentLimit;
        this.totalLimitDisplay.textContent = this.limit;
    }

    startLimitRecovery() {
        // Добавляем класс для визуального эффекта
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
        
        // Обновляем активную кнопку
        this.navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
        
        console.log(`Переход на страницу: ${targetPage}`);
        // Здесь можно добавить логику переключения страниц
    }
}

// Инициализация игры когда DOM загружен
document.addEventListener('DOMContentLoaded', () => {
    window.game = new ClickerGame();
});