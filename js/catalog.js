/**
 * Catalog Page JavaScript
 * Furnmart Botswana - Product filtering, sorting, and view management
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
    paginationBtns: document.querySelectorAll('.pagination-btn')
};

// ============ Initialize Catalog ============
function initCatalog() {
    initFilters();
    initSorting();
    initViewToggle();
    initPagination();

    console.log('Catalog initialized');
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
    announceToScreenReader('All filters cleared');
}

function applyFilters() {
    // In production, this would filter products based on CatalogState.filters
    console.log('Applying filters:', CatalogState.filters);

    // Update results count
    const filteredCount = calculateFilteredCount();
    updateResultsCount(filteredCount);

    // Reset to page 1 when filters change
    CatalogState.currentPage = 1;
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
    });
}

function applySorting() {
    console.log('Sorting by:', CatalogState.sortBy);

    // In production, this would re-order products
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
    console.log('View mode:', mode);
}

// ============ Pagination ============
function initPagination() {
    if (!catalogElements.paginationBtns) return;

    catalogElements.paginationBtns.forEach(btn => {
        if (btn.textContent.trim() && !isNaN(btn.textContent)) {
            btn.addEventListener('click', () => {
                const page = parseInt(btn.textContent);
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
            const maxPages = 12; // In production, calculate from total items
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
    catalogElements.productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });

    announceToScreenReader(`Page ${pageNumber} loaded`);
    console.log('Current page:', pageNumber);

    // In production, load products for this page
}

// ============ Mobile Filter Toggle ============
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

    // Insert before catalog controls
    const catalogControls = document.querySelector('.catalog-controls');
    if (catalogControls && window.innerWidth <= 768) {
        catalogControls.parentNode.insertBefore(filterToggleBtn, catalogControls);

        filterToggleBtn.addEventListener('click', () => {
            const sidebar = document.querySelector('.filters-sidebar');
            if (sidebar) {
                sidebar.classList.toggle('active');
                const isOpen = sidebar.classList.contains('active');
                filterToggleBtn.setAttribute('aria-expanded', isOpen);

                if (isOpen) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            }
        });

        // Close sidebar when clicking outside
        document.addEventListener('click', (e) => {
            const sidebar = document.querySelector('.filters-sidebar');
            if (sidebar && sidebar.classList.contains('active')) {
                if (!sidebar.contains(e.target) && !filterToggleBtn.contains(e.target)) {
                    sidebar.classList.remove('active');
                    document.body.style.overflow = '';
                }
            }
        });
    }
}

// ============ URL Parameter Management ============
function updateURLParams() {
    // Update URL with current filters and sorting (for bookmarking/sharing)
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
    // Load filters from URL parameters (for bookmarking/sharing)
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
        loadFromURLParams();
        if (window.innerWidth <= 768) {
            initMobileFilters();
        }
    });
} else {
    initCatalog();
    loadFromURLParams();
    if (window.innerWidth <= 768) {
        initMobileFilters();
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768 && !document.querySelector('.mobile-filter-toggle')) {
        initMobileFilters();
    }
});

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CatalogState,
        applyFilters,
        clearAllFilters,
        setViewMode,
        goToPage
    };
}