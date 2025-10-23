/**
 * Product Detail Page JavaScript
 * Furnmart Botswana - Enhanced interactivity for product pages
 */

// ============ Product State ============
const ProductState = {
    selectedColor: 'Beige',
    selectedQuantity: 1,
    currentImageIndex: 0,
    // FIXED: Using existing images
    images: [
        'images/products/chair-1.jpg',
        'images/products/chair-2.jpg',
        'images/products/chair-3.jpg',
        'images/products/chair-4.jpg'
    ]
};

// ============ DOM Elements ============
const productElements = {
    mainImage: document.getElementById('main-product-image'),
    thumbnails: document.querySelectorAll('.thumbnail'),
    colorSwatches: document.querySelectorAll('.color-swatch'),
    quantityInput: document.getElementById('quantity'),
    qtyIncrease: document.getElementById('qty-increase'),
    qtyDecrease: document.getElementById('qty-decrease'),
    addToCartBtn: document.getElementById('add-to-cart-detail'),
    viewArBtn: document.getElementById('view-ar-detail'),
    tabHeaders: document.querySelectorAll('.tab-header'),
    tabPanels: document.querySelectorAll('.tab-panel'),
    view360Btn: document.querySelector('.view-360-btn')
};

// ============ Image Gallery ============
function initImageGallery() {
    if (!productElements.thumbnails) return;

    productElements.thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            changeMainImage(index);
        });

        // Keyboard navigation
        thumbnail.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                changeMainImage(index);
            }
        });
    });

    // Add swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    if (productElements.mainImage) {
        productElements.mainImage.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });

        productElements.mainImage.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
    }

    function handleSwipe() {
        const swipeThreshold = 50;
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            const nextIndex = (ProductState.currentImageIndex + 1) % ProductState.images.length;
            changeMainImage(nextIndex);
        }
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            const prevIndex = (ProductState.currentImageIndex - 1 + ProductState.images.length) % ProductState.images.length;
            changeMainImage(prevIndex);
        }
    }
}

function changeMainImage(index) {
    ProductState.currentImageIndex = index;

    // Update main image with loading state
    if (productElements.mainImage) {
        productElements.mainImage.style.opacity = '0';

        // Use placeholder while loading
        const newImage = new Image();
        newImage.src = ProductState.images[index];

        newImage.onload = () => {
            productElements.mainImage.src = ProductState.images[index];
            productElements.mainImage.style.opacity = '1';
        };

        newImage.onerror = () => {
            // Fallback to placeholder
            productElements.mainImage.src = `https://placehold.co/600x600/0051A5/FFFFFF?text=Product+Image`;
            productElements.mainImage.style.opacity = '1';
        };
    }

    // Update active thumbnail
    productElements.thumbnails.forEach((thumb, i) => {
        thumb.classList.toggle('active', i === index);
        thumb.setAttribute('aria-current', i === index ? 'true' : 'false');
    });

    announceToScreenReader(`Viewing image ${index + 1} of ${ProductState.images.length}`);
}

// ============ Color Selection ============
function initColorSelection() {
    if (!productElements.colorSwatches) return;

    productElements.colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            selectColor(swatch);
        });

        swatch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectColor(swatch);
            }
        });
    });
}

function selectColor(swatch) {
    const colorName = swatch.getAttribute('aria-label');
    ProductState.selectedColor = colorName;

    // Update active state
    productElements.colorSwatches.forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked', 'false');
    });
    swatch.classList.add('active');
    swatch.setAttribute('aria-checked', 'true');

    announceToScreenReader(`${colorName} selected`);
}

// ============ Quantity Management ============
function initQuantitySelector() {
    if (!productElements.quantityInput) return;

    productElements.qtyIncrease.addEventListener('click', () => {
        increaseQuantity();
    });

    productElements.qtyDecrease.addEventListener('click', () => {
        decreaseQuantity();
    });

    productElements.quantityInput.addEventListener('change', (e) => {
        validateQuantity(e.target);
    });

    productElements.quantityInput.addEventListener('blur', (e) => {
        validateQuantity(e.target);
    });
}

function increaseQuantity() {
    const currentValue = parseInt(productElements.quantityInput.value);
    const maxValue = parseInt(productElements.quantityInput.max) || 99;

    if (currentValue < maxValue) {
        const newValue = currentValue + 1;
        productElements.quantityInput.value = newValue;
        ProductState.selectedQuantity = newValue;
        announceToScreenReader(`Quantity increased to ${newValue}`);
    }
}

function decreaseQuantity() {
    const currentValue = parseInt(productElements.quantityInput.value);
    const minValue = parseInt(productElements.quantityInput.min) || 1;

    if (currentValue > minValue) {
        const newValue = currentValue - 1;
        productElements.quantityInput.value = newValue;
        ProductState.selectedQuantity = newValue;
        announceToScreenReader(`Quantity decreased to ${newValue}`);
    }
}

function validateQuantity(input) {
    let value = parseInt(input.value);
    const min = parseInt(input.min) || 1;
    const max = parseInt(input.max) || 99;

    if (isNaN(value) || value < min) {
        value = min;
    } else if (value > max) {
        value = max;
    }

    input.value = value;
    ProductState.selectedQuantity = value;
}

// ============ Add to Cart ============
function initAddToCart() {
    if (!productElements.addToCartBtn) return;

    productElements.addToCartBtn.addEventListener('click', () => {
        addProductToCart();
    });
}

function addProductToCart() {
    const product = {
        name: document.querySelector('.product-title').textContent,
        price: document.querySelector('.price-main').textContent,
        color: ProductState.selectedColor,
        quantity: ProductState.selectedQuantity,
        image: ProductState.images[0]
    };

    // Use the global cart function from main.js if available
    if (typeof addToCart === 'function') {
        addToCart(product);
    } else {
        // Fallback notification
        showNotification(`${product.quantity}x ${product.name} (${product.color}) added to cart!`, 'success');
    }

    announceToScreenReader(`${product.quantity} ${product.name} in ${product.color} added to cart`);
}

// ============ Product Tabs ============
function initTabs() {
    if (!productElements.tabHeaders) return;

    productElements.tabHeaders.forEach(header => {
        header.addEventListener('click', () => {
            switchTab(header);
        });

        header.addEventListener('keydown', (e) => {
            handleTabKeyboard(e, header);
        });
    });
}

function switchTab(clickedHeader) {
    const targetPanelId = clickedHeader.getAttribute('aria-controls');

    // Update headers
    productElements.tabHeaders.forEach(header => {
        header.classList.remove('active');
        header.setAttribute('aria-selected', 'false');
    });
    clickedHeader.classList.add('active');
    clickedHeader.setAttribute('aria-selected', 'true');

    // Update panels
    productElements.tabPanels.forEach(panel => {
        panel.classList.remove('active');
        panel.setAttribute('hidden', '');
    });

    const targetPanel = document.getElementById(targetPanelId);
    if (targetPanel) {
        targetPanel.classList.add('active');
        targetPanel.removeAttribute('hidden');
    }

    announceToScreenReader(`${clickedHeader.textContent} section displayed`);
}

function handleTabKeyboard(e, currentHeader) {
    const headers = Array.from(productElements.tabHeaders);
    const currentIndex = headers.indexOf(currentHeader);

    switch (e.key) {
        case 'ArrowRight':
            e.preventDefault();
            const nextIndex = (currentIndex + 1) % headers.length;
            headers[nextIndex].focus();
            switchTab(headers[nextIndex]);
            break;
        case 'ArrowLeft':
            e.preventDefault();
            const prevIndex = (currentIndex - 1 + headers.length) % headers.length;
            headers[prevIndex].focus();
            switchTab(headers[prevIndex]);
            break;
        case 'Home':
            e.preventDefault();
            headers[0].focus();
            switchTab(headers[0]);
            break;
        case 'End':
            e.preventDefault();
            headers[headers.length - 1].focus();
            switchTab(headers[headers.length - 1]);
            break;
    }
}

// ============ 360 View ============
function init360View() {
    if (!productElements.view360Btn) return;

    productElements.view360Btn.addEventListener('click', () => {
        open360Viewer();
    });
}

function open360Viewer() {
    showNotification('360° View - Rotate product to see all angles', 'info');
    announceToScreenReader('360 degree view activated');
}

// ============ AR View with Model Check ============
function initARView() {
    if (!productElements.viewArBtn) return;

    productElements.viewArBtn.addEventListener('click', () => {
        // Check if AR model exists
        checkARModelAvailability();
    });
}

function checkARModelAvailability() {
    const modelPath = 'models/chair.glb';

    fetch(modelPath, { method: 'HEAD' })
        .then(response => {
            if (response.ok && response.headers.get('content-length') > 0) {
                // Model exists, open AR modal
                if (typeof openARModal === 'function') {
                    openARModal('Modern Dining Chair');
                }
            } else {
                // Model not available
                showNotification('AR feature coming soon! 3D model loading...', 'info');
            }
        })
        .catch(() => {
            // Prototype mode
            showNotification('AR Prototype - 3D model will be available in production', 'info');
        });
}

// ============ Zoom on Hover ============
function initImageZoom() {
    if (!productElements.mainImage) return;

    const imageContainer = productElements.mainImage.parentElement;

    imageContainer.addEventListener('mouseenter', () => {
        imageContainer.style.cursor = 'zoom-in';
    });

    imageContainer.addEventListener('mousemove', (e) => {
        const rect = imageContainer.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        productElements.mainImage.style.transformOrigin = `${x}% ${y}%`;
        productElements.mainImage.style.transform = 'scale(1.5)';
        productElements.mainImage.style.transition = 'transform 0.1s ease';
    });

    imageContainer.addEventListener('mouseleave', () => {
        productElements.mainImage.style.transform = 'scale(1)';
        productElements.mainImage.style.transformOrigin = 'center';
        imageContainer.style.cursor = 'default';
    });
}

// ============ Review Helpful Buttons ============
function initReviewHelpful() {
    const helpfulBtns = document.querySelectorAll('.helpful-btn');

    helpfulBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentCount = parseInt(btn.textContent.match(/\d+/)[0]);
            const newCount = currentCount + 1;
            btn.textContent = `Helpful (${newCount})`;
            btn.disabled = true;
            btn.style.opacity = '0.6';
            showNotification('Thank you for your feedback!', 'success');
            announceToScreenReader('Review marked as helpful');
        });
    });
}

// ============ Scroll to Reviews from Rating ============
function initScrollToReviews() {
    const ratingLink = document.querySelector('.rating-link');

    if (ratingLink) {
        ratingLink.addEventListener('click', (e) => {
            e.preventDefault();

            // Switch to reviews tab
            const reviewsTab = document.getElementById('reviews-tab');
            if (reviewsTab) {
                switchTab(reviewsTab);
            }

            // Scroll to tabs section
            const tabsSection = document.querySelector('.product-tabs');
            if (tabsSection) {
                tabsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    }
}

// ============ Price Calculation Display ============
function updatePriceDisplay() {
    const priceElement = document.querySelector('.price-main');
    if (!priceElement) return;

    const basePrice = 899;
    const quantity = ProductState.selectedQuantity;
    const total = basePrice * quantity;

    // Could update a total display element here in production
}

// ============ Utility: Notification ============
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

// ============ Utility: Screen Reader Announcements ============
function announceToScreenReader(message) {
    const liveRegion = document.querySelector('[aria-live="polite"]');
    if (liveRegion) {
        liveRegion.textContent = message;
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 1000);
    }
}

// ============ Initialize Product Page ============
function initProductPage() {
    try {
        initImageGallery();
        initColorSelection();
        initQuantitySelector();
        initAddToCart();
        initTabs();
        init360View();
        initARView();
        initImageZoom();
        initReviewHelpful();
        initScrollToReviews();

        // Add smooth transitions to main image
        if (productElements.mainImage) {
            productElements.mainImage.style.transition = 'opacity 0.3s ease';
        }
    } catch (error) {
        console.error('Error initializing product page:', error);
    }
}

// ============ Run on DOM Ready ============
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductPage);
} else {
    initProductPage();
}

// ============ Export for testing ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProductState,
        changeMainImage,
        selectColor,
        increaseQuantity,
        decreaseQuantity,
        addProductToCart,
        switchTab
    };
}