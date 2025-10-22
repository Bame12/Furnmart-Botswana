/**
 * Furnmart Botswana - Main JavaScript
 * Handles interactivity, AR features, and accessibility enhancements
 */

// ============ State Management ============
const AppState = {
    cart: [],
    wishlist: [],
    currentUser: null,
    isMenuOpen: false,
    isSearchOpen: false
};

// ============ DOM Elements ============
const elements = {
    mobileMenuToggle: document.querySelector('.mobile-menu-toggle'),
    navLinks: document.querySelector('.nav-links'),
    searchBtn: document.querySelectorAll('.icon-btn')[0], // First icon button is search
    searchOverlay: document.querySelector('.search-overlay'),
    searchClose: document.querySelector('.search-close'),
    searchInput: document.querySelector('.search-input'),
    cartBtn: document.querySelector('.cart-btn'),
    cartCount: document.querySelector('.cart-count'),
    arModal: document.getElementById('ar-modal'),
    arModalClose: document.querySelector('.modal-close'),
    tryArBtn: document.getElementById('try-ar-btn'),
    launchArBtn: document.getElementById('launch-ar-modal'),
    productsGrid: document.getElementById('products-grid'),
    addToCartBtns: document.querySelectorAll('.btn-add-cart'),
    wishlistBtns: document.querySelectorAll('.wishlist-btn'),
    arBadges: document.querySelectorAll('.ar-badge')
};

// ============ Mobile Menu Toggle ============
function initMobileMenu() {
    if (!elements.mobileMenuToggle || !elements.navLinks) return;

    elements.mobileMenuToggle.addEventListener('click', () => {
        AppState.isMenuOpen = !AppState.isMenuOpen;
        elements.navLinks.classList.toggle('active');
        elements.mobileMenuToggle.setAttribute('aria-expanded', AppState.isMenuOpen);

        // Accessibility: Trap focus within menu when open
        if (AppState.isMenuOpen) {
            elements.navLinks.querySelector('a').focus();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (AppState.isMenuOpen &&
            !elements.navLinks.contains(e.target) &&
            !elements.mobileMenuToggle.contains(e.target)) {
            AppState.isMenuOpen = false;
            elements.navLinks.classList.remove('active');
            elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isMenuOpen) {
            AppState.isMenuOpen = false;
            elements.navLinks.classList.remove('active');
            elements.mobileMenuToggle.setAttribute('aria-expanded', 'false');
            elements.mobileMenuToggle.focus();
        }
    });
}

// ============ Search Functionality ============
function initSearch() {
    if (!elements.searchBtn || !elements.searchOverlay) return;

    // Open search
    elements.searchBtn.addEventListener('click', () => {
        AppState.isSearchOpen = true;
        elements.searchOverlay.setAttribute('aria-hidden', 'false');
        elements.searchOverlay.style.transform = 'translateY(0)';
        setTimeout(() => elements.searchInput.focus(), 300);
    });

    // Close search
    elements.searchClose.addEventListener('click', closeSearch);

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && AppState.isSearchOpen) {
            closeSearch();
        }
    });

    // Search functionality (prototype - logs to console)
    elements.searchInput.addEventListener('input', debounce((e) => {
        const query = e.target.value.trim();
        if (query.length >= 3) {
            performSearch(query);
        }
    }, 300));
}

function closeSearch() {
    AppState.isSearchOpen = false;
    elements.searchOverlay.setAttribute('aria-hidden', 'true');
    elements.searchOverlay.style.transform = 'translateY(-100%)';
    elements.searchBtn.focus();
}

function performSearch(query) {
    // Prototype: Log search query
    console.log('Searching for:', query);
    // In production, this would make an API call
    announceToScreenReader(`Searching for ${query}`);
}

// ============ Cart Functionality ============
function initCart() {
    if (!elements.addToCartBtns) return;

    elements.addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;
            const productPrice = productCard.querySelector('.price-current').textContent;

            addToCart({
                name: productName,
                price: productPrice,
                quantity: 1
            });
        });
    });
}

function addToCart(product) {
    // Check if product already exists in cart
    const existingProduct = AppState.cart.find(item => item.name === product.name);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        AppState.cart.push(product);
    }

    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    announceToScreenReader(`${product.name} added to cart. Cart now has ${AppState.cart.length} items.`);

    // Animate cart button
    elements.cartBtn.classList.add('bounce');
    setTimeout(() => elements.cartBtn.classList.remove('bounce'), 500);
}

function updateCartCount() {
    const totalItems = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    elements.cartCount.textContent = totalItems;
    elements.cartBtn.setAttribute('aria-label', `Shopping cart (${totalItems} items)`);
}

// ============ Wishlist Functionality ============
function initWishlist() {
    if (!elements.wishlistBtns) return;

    elements.wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = e.target.closest('.product-card');
            const productName = productCard.querySelector('.product-name').textContent;

            toggleWishlist(productName, btn);
        });
    });
}

function toggleWishlist(productName, btn) {
    const index = AppState.wishlist.indexOf(productName);

    if (index === -1) {
        // Add to wishlist
        AppState.wishlist.push(productName);
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
        btn.setAttribute('aria-label', 'Remove from wishlist');
        showNotification(`${productName} added to wishlist!`, 'success');
        announceToScreenReader(`${productName} added to wishlist`);
    } else {
        // Remove from wishlist
        AppState.wishlist.splice(index, 1);
        btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
        `;
        btn.setAttribute('aria-label', 'Add to wishlist');
        showNotification(`${productName} removed from wishlist`, 'info');
        announceToScreenReader(`${productName} removed from wishlist`);
    }
}

// ============ AR Modal Functionality ============
function initARModal() {
    if (!elements.arModal) return;

    // Open modal buttons
    [elements.tryArBtn, elements.launchArBtn].forEach(btn => {
        if (btn) {
            btn.addEventListener('click', openARModal);
        }
    });

    // Close modal
    if (elements.arModalClose) {
        elements.arModalClose.addEventListener('click', closeARModal);
    }

    // Close on backdrop click
    elements.arModal.addEventListener('click', (e) => {
        if (e.target === elements.arModal) {
            closeARModal();
        }
    });

    // Close on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !elements.arModal.hasAttribute('hidden')) {
            closeARModal();
        }
    });

    // Initialize AR badge clicks
    if (elements.arBadges) {
        elements.arBadges.forEach(badge => {
            badge.addEventListener('click', (e) => {
                e.preventDefault();
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('.product-name').textContent;
                openARModal(productName);
            });
        });
    }
}

function openARModal(productName = 'Furniture') {
    elements.arModal.removeAttribute('hidden');
    document.body.style.overflow = 'hidden';

    // Focus trap
    const focusableElements = elements.arModal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
        focusableElements[0].focus();
    }

    announceToScreenReader(`AR viewer opened for ${productName}`);
    console.log('AR Modal opened for:', productName);
}

function closeARModal() {
    elements.arModal.setAttribute('hidden', '');
    document.body.style.overflow = '';

    // Return focus to trigger button
    if (elements.tryArBtn) {
        elements.tryArBtn.focus();
    }

    announceToScreenReader('AR viewer closed');
}

// ============ Product Loading (Prototype) ============
function loadProducts() {
    // In a real application, this would fetch from an API
    // For prototype, we'll just add interaction to existing products
    console.log('Products loaded from static HTML');
}

// ============ Notifications ============
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');

    // Style the notification
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
        animation: 'slideIn 0.3s ease',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============ Accessibility Helpers ============
function announceToScreenReader(message) {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
        liveRegion.textContent = message;
        // Clear after announcement
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ============ Utility Functions ============
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ============ Smooth Scroll ============
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Set focus for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });
}

// ============ Lazy Loading Images ============
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ============ Form Validation ============
function initFormValidation() {
    const newsletterForm = document.querySelector('.newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;

            if (validateEmail(email)) {
                showNotification('Thank you for subscribing!', 'success');
                newsletterForm.reset();
                announceToScreenReader('Successfully subscribed to newsletter');
            } else {
                showNotification('Please enter a valid email address', 'error');
                announceToScreenReader('Invalid email address. Please try again.');
            }
        });
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============ Keyboard Navigation Enhancement ============
function initKeyboardNavigation() {
    // Enhance keyboard navigation for product cards
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.setAttribute('tabindex', '0');

        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) {
                    link.click();
                }
            }
        });
    });
}

// ============ Dark Mode Toggle (Bonus Feature) ============
function initDarkMode() {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('dark-mode');
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            document.body.classList.toggle('dark-mode', e.matches);
        }
    });
}

// ============ Performance Monitoring ============
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`Page load time: ${pageLoadTime}ms`);

            // Log to analytics (prototype)
            console.log('Performance metrics logged');
        });
    }
}

// ============ Error Handling ============
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
    // In production, send to error tracking service
});

// ============ Initialization ============
function init() {
    console.log('Furnmart Botswana initialized');

    // Initialize all features
    initMobileMenu();
    initSearch();
    initCart();
    initWishlist();
    initARModal();
    initSmoothScroll();
    initLazyLoading();
    initFormValidation();
    initKeyboardNavigation();
    initDarkMode();
    initPerformanceMonitoring();
    loadProducts();

    // Add CSS animations
    addAnimations();

    console.log('All features initialized');
    announceToScreenReader('Page loaded. Welcome to Furnmart Botswana.');
}

// ============ CSS Animations ============
function addAnimations() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
        
        @keyframes bounce {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.1); }
        }
        
        .bounce {
            animation: bounce 0.5s ease;
        }
        
        @media (prefers-reduced-motion: reduce) {
            @keyframes slideIn,
            @keyframes slideOut,
            @keyframes bounce {
                animation-duration: 0.01ms !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ============ Run on DOM Content Loaded ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// ============ Export for modules (if needed) ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        AppState,
        addToCart,
        toggleWishlist,
        openARModal,
        closeARModal
    };
}