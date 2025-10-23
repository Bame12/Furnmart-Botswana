/**
 * Catalog Page JavaScript
 * Furnmart Botswana - Product filtering, sorting, and view management
 * Production Version - v1.0.0
 */

// ============ Catalog State ============
const CatalogState = {
    filters: {
        category: [],
        price: [],
        room: [],
        features: []
    },
    sortBy: 'featured',
    viewMode: 'grid',
    currentPage: 1,
    itemsPerPage: 12
};

// ============ DOM Elements ============
const catalogElements = {
    filterCheckboxes: document.querySelectorAll('.filter-options input[type="checkbox"]'),
    clearFiltersBtn: document.getElementById('clear-filters'),
    sortSelect: document.getElementById('sort-select'),
    viewBtns: document.querySelectorAll('.view-btn'),
    productsGrid: document.getElementById('products-grid'),
    resultsCount: document.getElementById('results-count'),
    paginationBtns: document.querySelectorAll('.pagination-btn'),
    filtersSidebar: document.querySelector('.filters-sidebar')
};

// ============ Initialize Catalog ============
function initCatalog() {
    try {
        initFilters();
        initSorting();
        initViewToggle();
        initPagination();

        // Load from URL parameters if present
        loadFromURLParams();
    } catch (error) {
        console.error('Error initializing catalog:', error);
    }
}

// ============ Filter Management ============
function initFilters() {
    if (!catalogElements.filterCheckboxes) return;

    catalogElements.filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', (e) => {
            handleFilterChange(e.target);
        });
    });

    // Clear filters button
    if (catalogElements.clearFiltersBtn) {
        catalogElements.clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
}

function handleFilterChange(checkbox) {
    const filterType = checkbox.name;
    const filterValue = checkbox.value;

    if (checkbox.checked) {
        // Add to filters
        if (!CatalogState.filters[filterType].includes(filterValue)) {
            CatalogState.filters[filterType].push(filterValue);
        }
    } else {
        // Remove from filters
        const index = CatalogState.filters[filterType].indexOf(filterValue);
        if (index > -1) {
            CatalogState.filters[filterType].splice(index, 1);
        }
    }

    applyFilters();
    updateURLParams();
    announceToScreenReader(`Filter ${checkbox.checked ? 'applied' : 'removed'}: ${filterValue}`);
}

function clearAllFilters() {
    // Reset all checkboxes
    catalogElements.filterCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // Reset state
    CatalogState.filters = {
        category: [],
        price: [],
        room: [],
        features: []
    };

    applyFilters();
    updateURLParams();
    announceToScreenReader('All filters cleared');
}

function applyFilters() {
    const filteredCount = calculateFilteredCount();
    updateResultsCount(filteredCount);

    // Reset to page 1 when filters change
    CatalogState.currentPage = 1;

    // Simulate filter application (in production, would fetch from API)
    if (catalogElements.productsGrid) {
        catalogElements.productsGrid.style.opacity = '0.6';
        setTimeout(() => {
            catalogElements.productsGrid.style.opacity = '1';
        }, 300);
    }
}

function calculateFilteredCount() {
    // Prototype: Simulate filtered results
    const baseCount = 165;
    const activeFilters = Object.values(CatalogState.filters).flat().length;
    return Math.max(10, baseCount - (activeFilters * 15));
}

function updateResultsCount(count) {
    if (catalogElements.resultsCount) {
        catalogElements.resultsCount.textContent = `Showing ${count} products`;
    }
}

// ============ Sorting ============
function initSorting() {
    if (!catalogElements.sortSelect) return;

    catalogElements.sortSelect.addEventListener('change', (e) => {
        CatalogState.sortBy = e.target.value;
        applySorting();
        updateURLParams();
    });
}

function applySorting() {
    announceToScreenReader(`Products sorted by ${CatalogState.sortBy}`);

    // Simulate sorting animation
    if (catalogElements.productsGrid) {
        catalogElements.productsGrid.style.opacity = '0.6';
        setTimeout(() => {
            catalogElements.productsGrid.style.opacity = '1';
        }, 300);
    }
}

// ============ View Toggle (Grid/List) ============
function initViewToggle() {
    if (!catalogElements.viewBtns) return;

    catalogElements.viewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const viewMode = btn.dataset.view;
            setViewMode(viewMode);
        });
    });
}

function setViewMode(mode) {
    CatalogState.viewMode = mode;

    // Update button states
    catalogElements.viewBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.view === mode);
    });

    // Update products grid class
    if (catalogElements.productsGrid) {
        if (mode === 'list') {
            catalogElements.productsGrid.classList.add('list-view');
        } else {
            catalogElements.productsGrid.classList.remove('list-view');
        }
    }

    announceToScreenReader(`View changed to ${mode} view`);
}

// ============ Pagination ============
function initPagination() {
    if (!catalogElements.paginationBtns) return;

    catalogElements.paginationBtns.forEach(btn => {
        const pageText = btn.textContent.trim();
        if (pageText && !isNaN(pageText)) {
            btn.addEventListener('click', () => {
                const page = parseInt(pageText);
                goToPage(page);
            });
        }
    });

    // Handle prev/next buttons
    const prevBtn = document.querySelector('.pagination-btn[aria-label="Previous page"]');
    const nextBtn = document.querySelector('.pagination-btn[aria-label="Next page"]');

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (CatalogState.currentPage > 1) {
                goToPage(CatalogState.currentPage - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const maxPages = 12;
            if (CatalogState.currentPage < maxPages) {
                goToPage(CatalogState.currentPage + 1);
            }
        });
    }
}

function goToPage(pageNumber) {
    CatalogState.currentPage = pageNumber;

    // Update pagination buttons
    catalogElements.paginationBtns.forEach(btn => {
        btn.classList.remove('active');
        btn.removeAttribute('aria-current');

        if (btn.textContent.trim() === pageNumber.toString()) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        }
    });

    // Scroll to top of products
    if (catalogElements.productsGrid) {
        catalogElements.productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    updateURLParams();
    announceToScreenReader(`Page ${pageNumber} loaded`);
}

// ============ Mobile Filter Toggle with Close Button ============
function initMobileFilters() {
    // Create mobile filter toggle button
    const filterToggleBtn = document.createElement('button');
    filterToggleBtn.className = 'btn btn-secondary mobile-filter-toggle';
    filterToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
        </svg>
        Filters
    `;
    filterToggleBtn.setAttribute('aria-label', 'Toggle filters');
    filterToggleBtn.setAttribute('aria-expanded', 'false');

    // Insert before catalog controls
    const catalogControls = document.querySelector('.catalog-controls');
    if (catalogControls && window.innerWidth <= 768) {
        catalogControls.parentNode.insertBefore(filterToggleBtn, catalogControls);

        // Add close button to sidebar
        if (catalogElements.filtersSidebar) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'sidebar-close';
            closeBtn.innerHTML = '×';
            closeBtn.setAttribute('aria-label', 'Close filters');
            closeBtn.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background: none;
                border: none;
                font-size: 2rem;
                cursor: pointer;
                color: var(--medium-gray);
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10;
            `;

            catalogElements.filtersSidebar.insertBefore(
                closeBtn,
                catalogElements.filtersSidebar.firstChild
            );

            // Close button handler
            closeBtn.addEventListener('click', () => {
                closeMobileFilters();
            });
        }

        // Toggle handler
        filterToggleBtn.addEventListener('click', () => {
            const sidebar = catalogElements.filtersSidebar;
            if (sidebar) {
                const isOpen = sidebar.classList.contains('active');

                if (isOpen) {
                    closeMobileFilters();
                } else {
                    openMobileFilters();
                }
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = catalogElements.filtersSidebar;
            if (sidebar && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !filterToggleBtn.contains(e.target)) {
                    closeMobileFilters();
                }
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const sidebar = catalogElements.filtersSidebar;
                if (sidebar && sidebar.classList.contains('active')) {
                    closeMobileFilters();
                }
            }
        });
    }
}

function openMobileFilters() {
    if (catalogElements.filtersSidebar) {
        catalogElements.filtersSidebar.classList.add('active');
        document.body.style.overflow = 'hidden';

        const toggleBtn = document.querySelector('.mobile-filter-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'true');
        }

        announceToScreenReader('Filters panel opened');
    }
}

function closeMobileFilters() {
    if (catalogElements.filtersSidebar) {
        catalogElements.filtersSidebar.classList.remove('active');
        document.body.style.overflow = '';

        const toggleBtn = document.querySelector('.mobile-filter-toggle');
        if (toggleBtn) {
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }

        announceToScreenReader('Filters panel closed');
    }
}

// ============ URL Parameter Management ============
function updateURLParams() {
    const params = new URLSearchParams();

    // Add filters
    Object.entries(CatalogState.filters).forEach(([key, values]) => {
        if (values.length > 0) {
            params.set(key, values.join(','));
        }
    });

    // Add sort
    if (CatalogState.sortBy !== 'featured') {
        params.set('sort', CatalogState.sortBy);
    }

    // Add page
    if (CatalogState.currentPage > 1) {
        params.set('page', CatalogState.currentPage);
    }

    // Update URL without reloading
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
}

function loadFromURLParams() {
    const params = new URLSearchParams(window.location.search);

    // Load filters
    Object.keys(CatalogState.filters).forEach(filterType => {
        const paramValue = params.get(filterType);
        if (paramValue) {
            CatalogState.filters[filterType] = paramValue.split(',');

            // Check corresponding checkboxes
            catalogElements.filterCheckboxes.forEach(checkbox => {
                if (checkbox.name === filterType && CatalogState.filters[filterType].includes(checkbox.value)) {
                    checkbox.checked = true;
                }
            });
        }
    });

    // Load sort
    const sortParam = params.get('sort');
    if (sortParam && catalogElements.sortSelect) {
        catalogElements.sortSelect.value = sortParam;
        CatalogState.sortBy = sortParam;
    }

    // Load page
    const pageParam = params.get('page');
    if (pageParam) {
        CatalogState.currentPage = parseInt(pageParam);
    }

    // Apply loaded state
    if (Object.values(CatalogState.filters).some(arr => arr.length > 0)) {
        applyFilters();
    }
}

// ============ Utility Functions ============
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
    document.addEventListener('DOMContentLoaded', () => {
        initCatalog();
        if (window.innerWidth <= 768) {
            initMobileFilters();
        }
    });
} else {
    initCatalog();
    if (window.innerWidth <= 768) {
        initMobileFilters();
    }
}

// Handle window resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 768 && !document.querySelector('.mobile-filter-toggle')) {
            initMobileFilters();
        }
    }, 250);
});

// ============ Export for testing ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CatalogState,
        applyFilters,
        clearAllFilters,
        setViewMode,
        goToPage
    };
}