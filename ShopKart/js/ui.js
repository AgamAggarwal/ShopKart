/**
 * ShopKart - UI Module
 * Common UI components and interactions
 */

// UI class
class UI {
    constructor() {
        this.init();
    }

    // Initialize UI
    init() {
        this.setupNavbar();
        this.setupThemeToggle();
        this.setupBackToTop();
        this.setupMobileMenu();
        this.setupLazyLoading();
        this.setupSearch();
    }

    // Setup navbar
    setupNavbar() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        // Add scroll effect
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100));

        // Update cart and wishlist counts
        this.updateCartCount();
        this.updateWishlistCount();
        this.updateAuthLinks();
    }

    // Update cart count
    updateCartCount() {
        const cartCount = document.getElementById('cartCount');
        const mobileCartCount = document.getElementById('mobileCartCount');
        const count = cart.getItemCount();
        
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
            // Add bump animation
            cartCount.classList.add('bump');
            setTimeout(() => cartCount.classList.remove('bump'), 300);
        }
        
        if (mobileCartCount) {
            mobileCartCount.textContent = count;
            mobileCartCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Update wishlist count
    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlistCount');
        const mobileWishlistCount = document.getElementById('mobileWishlistCount');
        const count = wishlist.getItemCount();
        
        if (wishlistCount) {
            wishlistCount.textContent = count;
            wishlistCount.style.display = count > 0 ? 'flex' : 'none';
            // Add bump animation
            wishlistCount.classList.add('bump');
            setTimeout(() => wishlistCount.classList.remove('bump'), 300);
        }
        
        if (mobileWishlistCount) {
            mobileWishlistCount.textContent = count;
            mobileWishlistCount.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Update auth links
    updateAuthLinks() {
        const authLinks = document.getElementById('authLinks');
        const userMenu = document.getElementById('userMenu');
        const userName = document.getElementById('userName');
        
        const mobileAuthLinks = document.getElementById('mobileAuthLinks');
        const mobileUserMenu = document.getElementById('mobileUserMenu');
        const mobileUserName = document.getElementById('mobileUserName');
        const mobileUserEmail = document.getElementById('mobileUserEmail');
        const mobileUserAvatar = document.getElementById('mobileUserAvatar');

        if (auth.isAuthenticated()) {
            if (authLinks) authLinks.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                if (userName) userName.textContent = auth.getUserName();
            }
            
            // Mobile menu
            if (mobileAuthLinks) mobileAuthLinks.style.display = 'none';
            if (mobileUserMenu) {
                mobileUserMenu.style.display = 'block';
                if (mobileUserName) mobileUserName.textContent = auth.getUserName();
                if (mobileUserEmail) mobileUserEmail.textContent = auth.getUserEmail();
                if (mobileUserAvatar) {
                    const name = auth.getUserName();
                    mobileUserAvatar.textContent = name.charAt(0).toUpperCase();
                }
            }
        } else {
            if (authLinks) authLinks.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';
            
            // Mobile menu
            if (mobileAuthLinks) mobileAuthLinks.style.display = 'block';
            if (mobileUserMenu) mobileUserMenu.style.display = 'none';
        }
    }

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeSwitcher = document.getElementById('themeSwitcher');
        const themeSwitcherClose = document.getElementById('themeSwitcherClose');
        const themeOptions = document.querySelectorAll('.theme-option');
        
        if (!themeToggle) return;

        // Load saved theme
        const savedTheme = ThemeStorage.getTheme();
        this.applyTheme(savedTheme);
        this.updateThemeSwitcherUI(savedTheme);

        // Toggle theme switcher on click
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            themeSwitcher.classList.toggle('active');
        });

        // Close theme switcher
        if (themeSwitcherClose) {
            themeSwitcherClose.addEventListener('click', () => {
                themeSwitcher.classList.remove('active');
            });
        }

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!themeSwitcher.contains(e.target) && !themeToggle.contains(e.target)) {
                themeSwitcher.classList.remove('active');
            }
        });

        // Theme options
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.dataset.theme;
                this.setTheme(theme);
                themeSwitcher.classList.remove('active');
            });
        });
    }

    // Setup search functionality
    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchSuggestions = document.getElementById('searchSuggestions');
        const searchBtn = document.querySelector('.search-btn');
        
        if (!searchInput || !searchSuggestions) return;

        let searchTimeout;
        let products = [];

        // Load products for search
        const loadProducts = async () => {
            try {
                products = await api.getProducts();
            } catch (error) {
                console.error('Error loading products for search:', error);
            }
        };

        loadProducts();

        // Debounced search
        const debouncedSearch = (query) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.showSearchSuggestions(query, products, searchSuggestions);
            }, 300);
        };

        // Input event
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (query.length >= 2) {
                debouncedSearch(query);
            } else {
                searchSuggestions.classList.remove('active');
            }
        });

        // Search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                }
            });
        }

        // Enter key
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query) {
                    this.performSearch(query);
                    searchSuggestions.classList.remove('active');
                }
            }
        });

        // Close suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                searchSuggestions.classList.remove('active');
            }
        });

        // Close on escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchSuggestions.classList.remove('active');
            }
        });
    }

    // Show search suggestions
    showSearchSuggestions(query, products, container) {
        const filtered = products.filter(product => 
            product.title.toLowerCase().includes(query.toLowerCase()) ||
            product.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 5);

        if (filtered.length === 0) {
            container.innerHTML = '<div class="search-suggestions-empty">No products found</div>';
        } else {
            container.innerHTML = filtered.map(product => `
                <div class="search-suggestion-item" data-product-id="${product.id}">
                    <img src="${product.image}" alt="${product.title}" class="search-suggestion-image">
                    <div class="search-suggestion-info">
                        <div class="search-suggestion-name">${product.title}</div>
                        <div class="search-suggestion-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="search-suggestion-category">${product.category}</div>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.search-suggestion-item').forEach(item => {
                item.addEventListener('click', () => {
                    const productId = item.dataset.productId;
                    window.location.href = `product-details.html?id=${productId}`;
                });
            });
        }

        container.classList.add('active');
    }

    // Perform search
    performSearch(query) {
        // Store search query in localStorage for products page
        localStorage.setItem('searchQuery', query);
        window.location.href = 'products.html';
    }

    // Apply theme
    applyTheme(theme) {
        if (theme === 'auto') {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const actualTheme = prefersDark ? 'dark' : 'light';
            document.body.classList.toggle('dark-mode', actualTheme === 'dark');
        } else {
            document.body.classList.toggle('dark-mode', theme === 'dark');
        }
    }

    // Set theme
    setTheme(theme) {
        ThemeStorage.saveTheme(theme);
        this.applyTheme(theme);
        this.updateThemeSwitcherUI(theme);
        ui.showToast(`Theme changed to ${theme === 'auto' ? 'auto' : theme + ' mode'}`, 'success');
    }

    // Update theme switcher UI
    updateThemeSwitcherUI(currentTheme) {
        const themeOptions = document.querySelectorAll('.theme-option');
        
        themeOptions.forEach(option => {
            const optionTheme = option.dataset.theme;
            if (optionTheme === currentTheme) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Setup back to top button
    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        // Show/hide button on scroll
        window.addEventListener('scroll', throttle(() => {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, 100));

        // Scroll to top on click
        backToTop.addEventListener('click', () => {
            scrollToTop();
        });
    }

    // Setup mobile menu
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const navLinks = document.querySelector('.nav-links');
        const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
        const mobileMenuPanel = document.getElementById('mobileMenuPanel');
        const mobileMenuClose = document.getElementById('mobileMenuClose');
        
        if (!mobileMenuBtn || !mobileMenuPanel) return;

        const openMobileMenu = () => {
            mobileMenuBtn.classList.add('active');
            mobileMenuOverlay.classList.add('active');
            mobileMenuPanel.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const closeMobileMenu = () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            mobileMenuPanel.classList.remove('active');
            document.body.style.overflow = '';
        };

        mobileMenuBtn.addEventListener('click', openMobileMenu);
        mobileMenuClose.addEventListener('click', closeMobileMenu);
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);

        // Close menu when clicking a link
        mobileMenuPanel.querySelectorAll('.mobile-nav-link').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenuPanel.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        // Mobile logout
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', () => {
                auth.logout();
                closeMobileMenu();
                ui.showToast('Logged out successfully', 'success');
            });
        }
    }

    // Setup lazy loading
    setupLazyLoading() {
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

    // Show toast notification
    showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <div class="toast-content">
                <div class="toast-title">${type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div class="toast-message">${message}</div>
            </div>
            <button class="toast-close" aria-label="Close">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>
        `;

        container.appendChild(toast);

        // Close button
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hideToast(toast);
        });

        // Auto hide
        setTimeout(() => {
            this.hideToast(toast);
        }, duration);

        return toast;
    }

    // Hide toast
    hideToast(toast) {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    // Show loading spinner
    showLoading(container) {
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        spinner.innerHTML = '<div class="spinner"></div>';
        container.appendChild(spinner);
        return spinner;
    }

    // Hide loading spinner
    hideLoading(spinner) {
        if (spinner && spinner.parentNode) {
            spinner.parentNode.removeChild(spinner);
        }
    }

    // Show skeleton loader
    showSkeleton(container, count = 1) {
        const skeletons = [];
        for (let i = 0; i < count; i++) {
            const skeleton = document.createElement('div');
            skeleton.className = 'skeleton-loader';
            container.appendChild(skeleton);
            skeletons.push(skeleton);
        }
        return skeletons;
    }

    // Hide skeleton loaders
    hideSkeleton(skeletons) {
        skeletons.forEach(skeleton => {
            if (skeleton.parentNode) {
                skeleton.parentNode.removeChild(skeleton);
            }
        });
    }

    // Show empty state
    showEmptyState(container, message = 'No items found', actionText = null, actionUrl = null) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <h3>${message}</h3>
            ${actionText && actionUrl ? `<a href="${actionUrl}" class="btn btn-primary">${actionText}</a>` : ''}
        `;
        container.innerHTML = '';
        container.appendChild(emptyState);
    }

    // Show error state
    showErrorState(container, message = 'Something went wrong', actionText = null, actionUrl = null) {
        const errorState = document.createElement('div');
        errorState.className = 'error-state';
        errorState.innerHTML = `
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            <h3>${message}</h3>
            ${actionText && actionUrl ? `<a href="${actionUrl}" class="btn btn-primary">${actionText}</a>` : ''}
        `;
        container.innerHTML = '';
        container.appendChild(errorState);
    }

    // Confirm dialog
    confirm(message, callback) {
        if (confirm(message)) {
            callback();
        }
    }

    // Setup search functionality
    setupSearch(searchInput, searchCallback) {
        if (!searchInput) return;

        const debouncedSearch = debounce((value) => {
            searchCallback(value);
        }, 300);

        searchInput.addEventListener('input', (e) => {
            debouncedSearch(e.target.value);
        });
    }

    // Setup form validation
    setupFormValidation(form, rules, submitCallback) {
        if (!form) return;

        // Real-time validation
        const validator = setupRealTimeValidation(form, rules);

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const { isValid, errors, data } = validateForm(form, rules);

            if (!isValid) {
                displayFormErrors(form, errors);
                this.showToast('Please fix the errors before submitting', 'error');
                return;
            }

            // Clear errors
            clearFormErrors(form);

            // Call submit callback
            await submitCallback(data);
        });
    }

    // Modal functions
    openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Setup modal
    setupModal(modal, triggerSelector, closeSelector) {
        const triggers = document.querySelectorAll(triggerSelector);
        const closeButtons = modal?.querySelectorAll(closeSelector);

        triggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openModal(modal);
            });
        });

        closeButtons?.forEach(button => {
            button.addEventListener('click', () => {
                this.closeModal(modal);
            });
        });

        // Close on backdrop click
        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.closeModal(modal);
            }
        });
    }

    // Animate element
    animate(element, animation, duration = 300) {
        element.style.animation = `${animation} ${duration}ms ease forwards`;
    }

    // Debounced resize handler
    onResize(callback) {
        const debouncedCallback = debounce(callback, 100);
        window.addEventListener('resize', debouncedCallback);
    }
}

// Create UI instance
const ui = new UI();

// Make ui globally available for browser environment
if (typeof window !== 'undefined') {
    window.ui = ui;
}

// Export UI module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UI,
        ui
    };
}
