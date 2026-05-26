let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelectorAll('.cart-count');
    cartCount.forEach(el => {
        el.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    });
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function addToCart(quiltId) {
    const quilt = quilts.find(q => q.id === quiltId);
    const existingItem = cart.find(item => item.id === quiltId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...quilt,
            quantity: 1
        });
    }

    saveCart();
    showNotification('Added to cart!');
}

function removeFromCart(quiltId) {
    cart = cart.filter(item => item.id !== quiltId);
    saveCart();
}

function updateQuantity(quiltId, quantity) {
    const item = cart.find(item => item.id === quiltId);
    if (item) {
        item.quantity = Math.max(1, quantity);
        saveCart();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #27ae60;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 2000;
        animation: slideIn 0.3s ease;
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.remove(), 3000);
}

function renderFeaturedQuilts() {
    const featuredContainer = document.getElementById('featuredQuilts');
    if (!featuredContainer) return;

    const featured = quilts.slice(0, 3);
    featuredContainer.innerHTML = featured.map(quilt => `
        <div class="quilt-card">
            <div class="quilt-image">[Quilt Image]</div>
            <div class="quilt-info">
                <h3>${quilt.name}</h3>
                <p>${quilt.description}</p>
                <p class="rating">${'★'.repeat(Math.floor(quilt.rating))} ${quilt.rating}</p>
                <p class="price">$${quilt.price}</p>
                <button class="btn btn-primary add-to-cart-btn" onclick="addToCart(${quilt.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function setupCartModal() {
    const cartLink = document.querySelector('.cart-link');
    const cartModal = document.getElementById('cartModal');
    const closeBtn = cartModal?.querySelector('.close');
    const continueShopping = document.getElementById('continueShopping');

    cartLink?.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        cartModal.style.display = 'block';
    });

    closeBtn?.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    continueShopping?.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
}

function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) return;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty</p>';
        return;
    }

    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.size}</p>
            </div>
            <div class="cart-item-qty">
                <button onclick="updateQuantity(${item.id}, ${item.quantity - 1})">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
            <div>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
                <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
            </div>
        </div>
    `).join('');

    updateCartSummary();
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    const subtotalEl = document.getElementById('subtotal');
    const taxEl = document.getElementById('tax');
    const totalEl = document.getElementById('total');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;
}

function setupCheckoutFlow() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    const checkoutModal = document.getElementById('checkoutModal');
    const cartModal = document.getElementById('cartModal');
    const backToCart = document.getElementById('backToCart');
    const checkoutForm = document.getElementById('checkoutForm');
    const checkoutCloseBtn = checkoutModal?.querySelector('.close');

    checkoutBtn?.addEventListener('click', () => {
        cartModal.style.display = 'none';
        checkoutModal.style.display = 'block';
    });

    backToCart?.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
        cartModal.style.display = 'block';
    });

    checkoutCloseBtn?.addEventListener('click', () => {
        checkoutModal.style.display = 'none';
    });

    checkoutForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        processCheckout();
    });

    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) {
            checkoutModal.style.display = 'none';
        }
    });
}

function processCheckout() {
    const email = document.getElementById('email').value;
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmEmail = document.getElementById('confirmEmail');
    const orderNumber = document.getElementById('orderNumber').querySelector('strong');
    const checkoutModal = document.getElementById('checkoutModal');

    const orderId = 'QT' + Date.now();
    orderNumber.textContent = orderId;
    confirmEmail.textContent = email;

    checkoutModal.style.display = 'none';
    confirmationModal.style.display = 'block';

    cart = [];
    saveCart();
}

function setupConfirmation() {
    const continueShoppingBtn = document.getElementById('continueShoppingBtn');
    const confirmationModal = document.getElementById('confirmationModal');

    continueShoppingBtn?.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
        window.location.href = 'shop.html';
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    renderFeaturedQuilts();
    setupCartModal();
    setupCheckoutFlow();
    setupConfirmation();
});
