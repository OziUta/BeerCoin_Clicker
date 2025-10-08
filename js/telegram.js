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

        this.tg.expand();
        this.tg.enableClosingConfirmation();
        this.applyTelegramTheme();
        this.bindTelegramEvents();
        this.initUserData();
    }

    applyTelegramTheme() {
        if (!this.tg) return;

        const themeParams = this.tg.themeParams;
        
        document.documentElement.style.setProperty('--tg-bg-color', themeParams.bg_color || '#1a1a2e');
        document.documentElement.style.setProperty('--tg-text-color', themeParams.text_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-button-color', themeParams.button_color || '#4cc9f0');
        
        document.body.style.background = themeParams.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)';
        
        this.tg.setHeaderColor('#1a1a2e');
        this.tg.setBackgroundColor('#1a1a2e');
    }

    bindTelegramEvents() {
        if (!this.tg) return;

        this.tg.onEvent('themeChanged', () => {
            this.applyTelegramTheme();
        });

        this.tg.onEvent('viewportChanged', () => {
            this.handleViewportChange();
        });
    }

    handleViewportChange() {
        const isExpanded = this.tg.isExpanded;
        console.log('Viewport changed, expanded:', isExpanded);
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
        localStorage.setItem('tg_user', JSON.stringify({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            username: user.username
        }));
    }

    sendDataToBot(data) {
        if (!this.tg) return;
        this.tg.sendData(JSON.stringify(data));
    }

    getLaunchParams() {
        return this.tg?.initData || '';
    }

    closeApp() {
        if (this.tg) {
            this.tg.close();
        }
    }
}
