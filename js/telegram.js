// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Функция для расширения функционала под Telegram
function initializeTelegramFeatures() {
    if (tg) {
        tg.expand(); // Развернуть приложение на весь экран
        tg.enableClosingConfirmation(); // Подтверждение закрытия
        
        // Использование цветовой схемы Telegram
        document.documentElement.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color || '#ffffff');
        document.documentElement.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color || '#000000');
        document.documentElement.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color || '#2481cc');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', initializeTelegramFeatures);