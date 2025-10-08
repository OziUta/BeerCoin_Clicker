class TelegramIntegration {
    constructor() {
        this.tg = window.Telegram?.WebApp;
        this.init();
    }

    init() {
        if (!this.tg) {
            console.log('Telegram Web App not found, running in standalone mode');
            return;
        }

        // Инициализация Telegram Web App
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        // Устанавливаем тему Telegram
        this.applyTelegramTheme();
        
        // Обработчики событий Telegram
        this.bindTelegramEvents();
        
        // Инициализация данных пользователя
        this.initUserData();
    }

    applyTelegramTheme() {
        if (!this.tg) return;

        const themeParams = this.tg.themeParams;
        
        // Применяем цвета Telegram
        document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#1a1a2e');
        document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#4cc9f0');
        document.documentElement.style.setProperty('--tg-button-text-color', themeParams.button_text_color || '#ffffff');
        
        // Обновляем фон согласно теме Telegram
        document.body.style.background = themeParams.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        
        // Устанавливаем цвет статус бара
        this.tg.setHeaderColor('#1a1a2e');
        this.tg.setBackgroundColor('#1a1a2e');
    }

    bindTelegramEvents() {
        if (!this.tg) return;

        // Изменение темы
        this.tg.onEvent('themeChanged', () => {
            this.applyTelegramTheme();
        });

        // Изменение размера viewport
        this.tg.onEvent('viewportChanged', () => {
            this.handleViewportChange();
        });

        // Основная кнопка
        this.setupMainButton();
    }

    handleViewportChange() {
        // Адаптация под изменение размера окна
        const isExpanded = this.tg.isExpanded;
        console.log('Viewport changed, expanded:', isExpanded);
    }

    setupMainButton() {
        if (!this.tg) return;

        // Можно добавить основную кнопку если нужно
        // this.tg.MainButton.setText('Купить монеты');
        // this.tg.MainButton.show();
    }

    initUserData() {
        if (!this.tg) return;

        const user = this.tg.initDataUnsafe?.user;
        if (user) {
            console.log('Telegram User:', user);
            this.saveUserData(user);
        }
    }

    saveUserData(user) {
        // Сохраняем данные пользователя в localStorage
        localStorage.setItem('tg_user', JSON.stringify({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username,
            language: user.language_code
        }));
    }

    // Метод для открытия кошелька Telegram
    openWallet() {
        if (!this.tg) {
            alert('Функция кошелька доступна только в Telegram');
            return;
        }

        // Открываем окно оплаты Telegram
        this.tg.showPopup({
            title: 'Пополнение счета',
            message: 'Выберите способ оплаты',
            buttons: [
                {id: 'crypto', type: 'default', text: 'Криптовалюты'},
                {id: 'card', type: 'default', text: 'Банковская карта'},
                {type: 'cancel'}
            ]
        }, (buttonId) => {
            if (buttonId === 'crypto') {
                this.openCryptoWallet();
            } else if (buttonId === 'card') {
                this.openCardPayment();
            }
        });
    }

    openCryptoWallet() {
        // Интеграция с Telegram Crypto Wallet
        if (this.tg?.openInvoice) {
            // Здесь будет вызов оплаты через Telegram
            console.log('Opening crypto wallet...');
        }
    }

    openCardPayment() {
        // Интеграция с платежной системой
        console.log('Opening card payment...');
    }

    // Метод для отправки данных в бота
    sendDataToBot(data) {
        if (!this.tg) return;

        this.tg.sendData(JSON.stringify(data));
    }

    // Получение данных запуска
    getLaunchParams() {
        return this.tg?.initData || '';
    }

    // Закрытие приложения
    closeApp() {
        if (this.tg) {
            this.tg.close();
        }
    }
}
