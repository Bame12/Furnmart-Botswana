/**
 * Shopping Cart Page JavaScript
 * Furnmart Botswana - Cart management, calculations, and checkout
 */

// ============ Cart State ============
const CartState = {
    items: [
        { id: 1, name: 'Modern Dining Chair', price: 899, quantity: 2, image: 'images/products/chair-1.jpg', color: 'Beige' },
        { id: 2, name: 'Coffee Table', price: 2299, quantity: 1, image: 'images/products/table-1.jpg', color: 'Oak Wood' }
    ],
    promoCode: null,
    discount: 0
};

// ============ Initialize Cart ============
function initCart() {
    initQuantityControls();
    initRemoveButtons();
    initPromoCode();
    initCheckout();
    updateCartTotals();

    console.log('Cart initialized with', CartState.items.length, 'items');
}

// ============ Quantity Controls ============
function initQuantityControls() {
    const qtyInputs = document.querySelectorAll('.qty-input');
    const qtyBtns = document.querySelectorAll('.item-quantity .qty-btn');

    qtyInputs.forEach(input => {
        input.addEventListener('change', () => {
            updateItemQuantity(input);
        });

        input.addEventListener('blur', () => {
            validateQuantity(input);
        });
    });

    qtyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('.qty-input');
            const currentValue = parseInt(input.value);

            if (btn.textContent === '+') {
                input.value = Math.min(currentValue + 1, 99);
            } else {
                input.value = Math.max(currentValue - 1, 1);
            }

            updateItemQuantity(input);
        });
    });
}

function updateItemQuantity(input) {
    const quantity = parseInt(input.value);
    const itemId = input.id.replace('qty-', '');

    // Update state
    const item = CartState.items.find(i => i.id === parseInt(itemId));
    if (item) {
        item.quantity = quantity;
    }

    updateCartTotals();
    saveCart();

    announceToScreenReader(`Quantity updated to ${quantity}`);
}

function validateQuantity(input) {
    let value = parseInt(input.value);
    if (isNaN(value) || value < 1) {
        value = 1;
    } else if (value > 99) {
        value = 99;
    }
    input.value = value;
}

// ============ Remove Items ============
function initRemoveButtons() {
    const removeBtns = document.querySelectorAll('.item-remove');

    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            const itemName = cartItem.querySelector('.item-name').textContent;

            if (confirm(`Remove ${itemName} from cart?`)) {
                removeCartItem(cartItem);
            }
        });
    });
}

function removeCartItem(cartItem) {
    const itemName = cartItem.querySelector('.item-name').textContent;

    // Animate removal
    cartItem.style.opacity = '0';
    cartItem.style.transform = 'translateX(-20px)';

    setTimeout(() => {
        cartItem.remove();

        // Update state (in production, remove from actual cart)
        CartState.items = CartState.items.filter(item => item.name !== itemName);

        // Check if cart is empty
        const remainingItems = document.querySelectorAll('.cart-item');
        if (remainingItems.length === 0) {
            showEmptyCart();
        } else {
            updateCartTotals();
        }

        announceToScreenReader(`${itemName} removed from cart`);
        showNotification(`${itemName} removed from cart`, 'info');
    }, 300);

    saveCart();
}

function showEmptyCart() {
    const cartItems = document.getElementById('cart-items');
    const emptyCart = document.querySelector('.empty-cart');

    if (emptyCart) {
        emptyCart.removeAttribute('hidden');
    }

    // Hide order summary
    const orderSummary = document.querySelector('.order-summary');
    if (orderSummary) {
        orderSummary.style.opacity = '0.5';
        orderSummary.style.pointerEvents = 'none';
    }
}

// ============ Cart Calculations ============
function updateCartTotals() {
    const subtotal = CartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = CartState.discount;
    const total = subtotal - discount;
    const itemCount = CartState.items.reduce((sum, item) => sum + item.quantity, 0);

    // Update display
    const subtotalEl = document.getElementById('subtotal');
    const discountEl = document.getElementById('discount');
    const totalEl = document.getElementById('total');
    const resultsCount = document.getElementById('results-count');

    if (subtotalEl) subtotalEl.textContent = `P ${subtotal.toLocaleString()}`;
    if (discountEl) discountEl.textContent = discount > 0 ? `- P ${discount.toLocaleString()}` : 'P 0';
    if (totalEl) totalEl.textContent = `P ${total.toLocaleString()}`;

    // Update item count in summary
    const summaryRow = document.querySelector('.summary-row span');
    if (summaryRow) {
        summaryRow.textContent = `Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`;
    }

    // Update cart count in header
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = itemCount;
    }

    console.log('Cart totals updated:', { subtotal, discount, total, itemCount });
}

// ============ Promo Code ============
function initPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const applyBtn = document.querySelector('.btn-apply-promo');

    if (applyBtn) {
        applyBtn.addEventListener('click', () => {
            const code = promoInput.value.trim().toUpperCase();
            applyPromoCode(code);
        });
    }

    if (promoInput) {
        promoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const code = promoInput.value.trim().toUpperCase();
                applyPromoCode(code);
            }
        });
    }
}

function applyPromoCode(code) {
    // Prototype promo codes
    const promoCodes = {
        'SAVE10': { type: 'percentage', value: 10 },
        'SAVE100': { type: 'fixed', value: 100 },
        'WELCOME': { type: 'percentage', value: 15 },
        'FURNMART2025': { type: 'fixed', value: 200 }
    };

    if (promoCodes[code]) {
        const promo = promoCodes[code];
        const subtotal = CartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        if (promo.type === 'percentage') {
            CartState.discount = Math.round(subtotal * (promo.value / 100));
        } else {
            CartState.discount = promo.value;
        }

        CartState.promoCode = code;
        updateCartTotals();
        saveCart();

        showNotification(`Promo code ${code} applied! Saved P ${CartState.discount}`, 'success');
        announceToScreenReader(`Promo code applied. You saved P ${CartState.discount}`);

        // Disable input after successful application
        const promoInput = document.getElementById('promo-input');
        if (promoInput) {
            promoInput.value = code;
            promoInput.disabled = true;
        }
    } else {
        showNotification('Invalid promo code', 'error');
        announceToScreenReader('Invalid promo code');
    }
}

// ============ Checkout ============
function initCheckout() {
    const checkoutBtn = document.querySelector('.btn-checkout');

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            proceedToCheckout();
        });
    }
}

function proceedToCheckout() {
    // In production, this would redirect to checkout page
    const total = CartState.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) - CartState.discount;

    console.log('Proceeding to checkout:', {
        items: CartState.items,
        total: total,
        promoCode: CartState.promoCode
    });

    showNotification('Proceeding to checkout... (Prototype)', 'info');
    announceToScreenReader('Proceeding to checkout');

    // Simulate checkout process
    setTimeout(() => {
        alert(`Checkout Summary:\nTotal: P ${total.toLocaleString()}\n\nThis is a prototype. In production, this would proceed to payment.`);
    }, 500);
}

// ============ Cart Persistence ============
function saveCart() {
    // In production, save to backend or localStorage
    console.log('Cart saved:', CartState);
}

function loadCart() {
    // In production, load from backend or localStorage
    console.log('Cart loaded from storage');
}

// ============ Utility Functions ============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '16px 24px',
        backgroundColor: type === 'success' ? '#2D7738' : type === 'error' ? '#D32F2F' : '#0051A5',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function announceToScreenReader(message) {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ============ Initialize on Load ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CartState,
        updateCartTotals,
        applyPromoCode,
        removeCartItem
    };
}