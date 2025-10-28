class TelegramShop {
    constructor() {
        this.categories = [];
        this.products = [];
        this.cart = [];
        this.tg = window.Telegram.WebApp;
        
        this.init();
    }

    async init() {
        this.tg.expand();
        this.tg.enableClosingConfirmation();
        
        await this.loadProducts();
        this.showCategories();
        this.bindEvents();
        this.updateCartIcon();
    }

    async loadProducts() {
        try {
            // В реальном приложении загружаем с сервера
            const response = await fetch('products.json');
            const data = await response.json();
            
            this.categories = data.categories;
            this.products = data.products;
            
            document.getElementById('loading').classList.add('hidden');
        } catch (error) {
            console.error('Ошибка загрузки товаров:', error);
        }
    }

    showCategories() {
        const categoriesGrid = document.getElementById('categoriesGrid');
        categoriesGrid.innerHTML = '';

        this.categories.forEach(category => {
            const categoryCard = document.createElement('div');
            categoryCard.className = 'category-card';
            categoryCard.innerHTML = `
                <div class="category-icon">${category.icon}</div>
                <h3>${category.name}</h3>
            `;
            categoryCard.addEventListener('click', () => this.showProducts(category.id));
            categoriesGrid.appendChild(categoryCard);
        });

        document.getElementById('categories').classList.remove('hidden');
        document.getElementById('products').classList.add('hidden');
        document.getElementById('cart').classList.add('hidden');
    }

    showProducts(categoryId) {
        const categoryProducts = this.products.filter(product => product.categoryId === categoryId);
        const productsGrid = document.getElementById('productsGrid');
        const category = this.categories.find(cat => cat.id === categoryId);

        document.getElementById('categoryTitle').textContent = category.name;
        productsGrid.innerHTML = '';

        categoryProducts.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">${product.emoji}</div>
                <h4>${product.name}</h4>
                <p class="product-price">${product.price} ₽</p>
                <p class="product-description">${product.description}</p>
                <button class="add-to-cart" data-product-id="${product.id}">
                    Добавить в корзину
                </button>
            `;
            productsGrid.appendChild(productCard);
        });

        // Добавляем обработчики для кнопок добавления в корзину
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.getAttribute('data-product-id');
                this.addToCart(productId);
            });
        });

        document.getElementById('categories').classList.add('hidden');
        document.getElementById('products').classList.remove('hidden');
        document.getElementById('cart').classList.add('hidden');
    }

    showCart() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p>Корзина пуста</p>';
        } else {
            this.cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ₽ × ${item.quantity}</p>
                    </div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" data-product-id="${item.id}" data-action="decrease">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" data-product-id="${item.id}" data-action="increase">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });

            // Добавляем обработчики для кнопок изменения количества
            document.querySelectorAll('.quantity-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const productId = e.target.getAttribute('data-product-id');
                    const action = e.target.getAttribute('data-action');
                    this.updateQuantity(productId, action);
                });
            });
        }

        this.updateTotal();
        document.getElementById('categories').classList.add('hidden');
        document.getElementById('products').classList.add('hidden');
        document.getElementById('cart').classList.remove('hidden');
    }

    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        const existingItem = this.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartIcon();
        this.tg.HapticFeedback.impactOccurred('light');
    }

    updateQuantity(productId, action) {
        const item = this.cart.find(item => item.id === productId);
        
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity === 0) {
                this.cart = this.cart.filter(item => item.id !== productId);
            }
        }

        this.showCart();
        this.updateCartIcon();
    }

    updateTotal() {
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('totalAmount').textContent = total;
    }

    updateCartIcon() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    bindEvents() {
        document.getElementById('backToCategories').addEventListener('click', () => {
            this.showCategories();
        });

        document.getElementById('backToProducts').addEventListener('click', () => {
            const currentCategory = document.getElementById('categoryTitle').textContent;
            const category = this.categories.find(cat => cat.name === currentCategory);
            if (category) {
                this.showProducts(category.id);
            }
        });

        document.getElementById('cartIcon').addEventListener('click', () => {
            this.showCart();
        });

        document.getElementById('checkout').addEventListener('click', () => {
            this.checkout();
        });
    }

    checkout() {
        if (this.cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        const orderData = {
            cart: this.cart,
            total: this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            user: this.tg.initDataUnsafe.user
        };

        // Здесь обычно отправляем данные на сервер
        console.log('Order data:', orderData);
        
        this.tg.showPopup({
            title: 'Заказ оформлен!',
            message: `Спасибо за заказ! Сумма: ${orderData.total} ₽`,
            buttons: [{
                type: 'ok',
                text: 'OK'
            }]
        });

        this.cart = [];
        this.showCategories();
        this.updateCartIcon();
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    new TelegramShop();
});