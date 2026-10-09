/**
 * ShopKart - Main Application
 * Application initialization and page-specific logic
 */

// Application class
class App {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    // Get current page
    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        
        if (filename === '' || filename === 'index.html') return 'home';
        if (filename === 'products.html') return 'products';
        if (filename === 'product-details.html') return 'product-details';
        if (filename === 'cart.html') return 'cart';
        if (filename === 'wishlist.html') return 'wishlist';
        if (filename === 'checkout.html') return 'checkout';
        if (filename === 'login.html') return 'login';
        if (filename === 'signup.html') return 'signup';
        
        return 'home';
    }

    // Initialize application
    async init() {
        console.log('ShopKart initializing...');
        
        // Initialize UI components
        ui.init();

        // Update cart and wishlist counts
        ui.updateCartCount();
        ui.updateWishlistCount();
        ui.updateAuthLinks();

        // Setup global event listeners
        this.setupGlobalEventListeners();

        // Initialize page-specific logic
        await this.initPage();
    }

    // Setup global event listeners
    setupGlobalEventListeners() {
        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                auth.logout();
                ui.updateAuthLinks();
                ui.showToast('Logged out successfully', 'success');
                window.location.href = 'index.html';
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput && searchBtn) {
            const handleSearch = () => {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `products.html?search=${encodeURIComponent(query)}`;
                }
            };

            searchBtn.addEventListener('click', handleSearch);
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
        }

        // Product card actions (event delegation)
        document.addEventListener('click', (e) => {
            // Add to cart
            const addToCartBtn = e.target.closest('[data-action="add-to-cart"]');
            if (addToCartBtn) {
                const productId = parseInt(addToCartBtn.dataset.productId);
                this.handleAddToCart(productId);
            }

            // Wishlist toggle
            const wishlistBtn = e.target.closest('[data-action="wishlist"]');
            if (wishlistBtn) {
                const productId = parseInt(wishlistBtn.dataset.productId);
                this.handleWishlistToggle(productId, wishlistBtn);
            }

            // Quick view
            const quickViewBtn = e.target.closest('[data-action="quick-view"]');
            if (quickViewBtn) {
                const productId = parseInt(quickViewBtn.dataset.productId);
                this.handleQuickView(productId);
            }
        });
    }

    // Handle add to cart
    async handleAddToCart(productId) {
        try {
            const product = await products.getProduct(productId);
            const result = cart.addItem(product, 1);

            if (result.success) {
                ui.updateCartCount();
                ui.showToast('Added to cart', 'success');
            } else {
                ui.showToast(result.error, 'error');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            ui.showToast('Failed to add to cart', 'error');
        }
    }

    // Handle wishlist toggle
    async handleWishlistToggle(productId, button) {
        try {
            const product = await products.getProduct(productId);
            const result = wishlist.toggleItem(product);

            if (result.success) {
                ui.updateWishlistCount();
                button.classList.toggle('active');
                const icon = button.querySelector('svg');
                icon.setAttribute('fill', button.classList.contains('active') ? 'currentColor' : 'none');
                ui.showToast(button.classList.contains('active') ? 'Added to wishlist' : 'Removed from wishlist', 'success');
            } else {
                ui.showToast(result.error, 'error');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            ui.showToast('Failed to update wishlist', 'error');
        }
    }

    // Handle quick view
    async handleQuickView(productId) {
        try {
            const product = await products.getProduct(productId);
            const modalHTML = products.renderQuickViewModal(product);
            
            // Create modal container
            let modalContainer = document.getElementById('quickViewModalContainer');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'quickViewModalContainer';
                document.body.appendChild(modalContainer);
            }
            
            modalContainer.innerHTML = modalHTML;
            
            // Show modal
            const modal = document.getElementById('quickViewModal');
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Setup modal event listeners
            this.setupQuickViewModal(product);
            
        } catch (error) {
            console.error('Error loading quick view:', error);
            ui.showToast('Failed to load product details', 'error');
        }
    }

    // Setup quick view modal
    setupQuickViewModal(product) {
        const modal = document.getElementById('quickViewModal');
        const closeBtn = document.getElementById('closeModal');
        const addToCartBtn = document.getElementById('modalAddToCart');
        const wishlistBtn = document.getElementById('modalWishlist');
        const quantityInput = document.getElementById('modalQuantity');
        const decreaseBtn = modal.querySelector('[data-action="decrease"]');
        const increaseBtn = modal.querySelector('[data-action="increase"]');
        
        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
            setTimeout(() => {
                const container = document.getElementById('quickViewModalContainer');
                if (container) {
                    container.remove();
                }
            }, 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
        
        // Quantity selector
        decreaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
            }
        });
        
        increaseBtn.addEventListener('click', () => {
            const currentValue = parseInt(quantityInput.value);
            if (currentValue < 99) {
                quantityInput.value = currentValue + 1;
            }
        });
        
        // Add to cart
        addToCartBtn.addEventListener('click', () => {
            const quantity = parseInt(quantityInput.value);
            const result = cart.addItem(product, quantity);
            
            if (result.success) {
                ui.updateCartCount();
                ui.showToast('Added to cart', 'success');
                closeModal();
            } else {
                ui.showToast(result.error, 'error');
            }
        });
        
        // Wishlist
        wishlistBtn.addEventListener('click', () => {
            const result = wishlist.toggleItem(product);
            ui.updateWishlistCount();
            wishlistBtn.textContent = wishlist.hasItem(product.id) ? '♥ In Wishlist' : '♡ Add to Wishlist';
            ui.showToast(wishlist.hasItem(product.id) ? 'Added to wishlist' : 'Removed from wishlist', 'success');
        });
    }

    // Initialize page-specific logic
    async initPage() {
        switch (this.currentPage) {
            case 'home':
                await this.initHomePage();
                break;
            case 'products':
                await this.initProductsPage();
                break;
            case 'product-details':
                await this.initProductDetailsPage();
                break;
            case 'cart':
                await this.initCartPage();
                break;
            case 'wishlist':
                await this.initWishlistPage();
                break;
            case 'checkout':
                await this.initCheckoutPage();
                break;
            case 'login':
                await this.initLoginPage();
                break;
            case 'signup':
                await this.initSignupPage();
                break;
        }
    }

    // Initialize home page
    async initHomePage() {
        try {
            // Load categories
            await this.loadCategories();

            // Load featured products
            await this.loadFeaturedProducts();

            // Load trending products
            await this.loadTrendingProducts();

            // Load latest products
            await this.loadLatestProducts();

            // Newsletter form
            const newsletterForm = document.getElementById('newsletterForm');
            if (newsletterForm) {
                newsletterForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const email = newsletterForm.querySelector('input').value;
                    if (isValidEmail(email)) {
                        ui.showToast('Thank you for subscribing!', 'success');
                        newsletterForm.reset();
                    } else {
                        ui.showToast('Please enter a valid email', 'error');
                    }
                });
            }
        } catch (error) {
            console.error('Error initializing home page:', error);
        }
    }

    // Load categories
    async loadCategories() {
        const container = document.getElementById('categoriesGrid');
        if (!container) return;

        try {
            const categories = await products.loadCategories();
            container.innerHTML = categories.map(category => 
                products.renderCategoryCard(category)
            ).join('');

            // Add click handlers
            container.querySelectorAll('.category-card').forEach(card => {
                card.addEventListener('click', () => {
                    const category = card.dataset.category;
                    window.location.href = `products.html?category=${encodeURIComponent(category)}`;
                });
            });
        } catch (error) {
            console.error('Error loading categories:', error);
            ui.showErrorState(container, 'Failed to load categories');
        }
    }

    // Load featured products
    async loadFeaturedProducts() {
        const container = document.getElementById('featuredProducts');
        if (!container) return;

        try {
            // Show enhanced skeleton loaders
            container.innerHTML = Array(4).fill(`
                <div class="skeleton-product-card">
                    <div class="skeleton-product-image"></div>
                    <div class="skeleton-product-info">
                        <div class="skeleton-product-category"></div>
                        <div class="skeleton-product-title"></div>
                        <div class="skeleton-product-rating"></div>
                        <div class="skeleton-product-price"></div>
                        <div class="skeleton-product-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                </div>
            `).join('');

            const featuredProducts = await products.getFeaturedProducts(4);
            container.innerHTML = featuredProducts.map(product => 
                products.renderProductCard(product)
            ).join('');
        } catch (error) {
            console.error('Error loading featured products:', error);
            ui.showErrorState(container, 'Failed to load products');
        }
    }

    // Load trending products
    async loadTrendingProducts() {
        const container = document.getElementById('trendingProducts');
        if (!container) return;

        try {
            // Show enhanced skeleton loaders
            container.innerHTML = Array(4).fill(`
                <div class="skeleton-product-card">
                    <div class="skeleton-product-image"></div>
                    <div class="skeleton-product-info">
                        <div class="skeleton-product-category"></div>
                        <div class="skeleton-product-title"></div>
                        <div class="skeleton-product-rating"></div>
                        <div class="skeleton-product-price"></div>
                        <div class="skeleton-product-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                </div>
            `).join('');

            const trendingProducts = await products.getTrendingProducts(4);
            container.innerHTML = trendingProducts.map(product => 
                products.renderProductCard(product)
            ).join('');
        } catch (error) {
            console.error('Error loading trending products:', error);
            ui.showErrorState(container, 'Failed to load products');
        }
    }

    // Load latest products
    async loadLatestProducts() {
        const container = document.getElementById('latestProducts');
        if (!container) return;

        try {
            // Show enhanced skeleton loaders
            container.innerHTML = Array(4).fill(`
                <div class="skeleton-product-card">
                    <div class="skeleton-product-image"></div>
                    <div class="skeleton-product-info">
                        <div class="skeleton-product-category"></div>
                        <div class="skeleton-product-title"></div>
                        <div class="skeleton-product-rating"></div>
                        <div class="skeleton-product-price"></div>
                        <div class="skeleton-product-actions">
                            <div class="skeleton-btn"></div>
                            <div class="skeleton-btn"></div>
                        </div>
                    </div>
                </div>
            `).join('');

            const latestProducts = await products.getLatestProducts(4);
            container.innerHTML = latestProducts.map(product => 
                products.renderProductCard(product)
            ).join('');
        } catch (error) {
            console.error('Error loading latest products:', error);
            ui.showErrorState(container, 'Failed to load products');
        }
    }

    // Initialize products page
    async initProductsPage() {
        try {
            // Get URL parameters
            const searchParams = new URLSearchParams(window.location.search);
            const category = searchParams.get('category') || '';
            const search = searchParams.get('search') || '';
            const priceRange = searchParams.get('price') || '';
            const sortBy = searchParams.get('sort') || '';

            // Set filters
            products.setFilters({ category, search, priceRange, sortBy });

            // Update filter UI
            this.updateFilterUI();

            // Load products
            await this.loadProductsPageProducts();

            // Setup filter listeners
            this.setupFilterListeners();

            // Setup pagination
            this.setupPagination();
        } catch (error) {
            console.error('Error initializing products page:', error);
        }
    }

    // Update filter UI
    updateFilterUI() {
        const filters = products.getFilters();

        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) categoryFilter.value = filters.category;
        if (priceFilter) priceFilter.value = filters.priceRange;
        if (sortFilter) sortFilter.value = filters.sortBy;
    }

    // Setup filter listeners
    setupFilterListeners() {
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortFilter = document.getElementById('sortFilter');
        const resetFilters = document.getElementById('resetFilters');
        const clearFiltersBtn = document.getElementById('clearFiltersBtn');

        const applyFilters = () => {
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;
            const sortBy = sortFilter.value;

            products.setFilters({ category, priceRange, sortBy });
            this.loadProductsPageProducts();
        };

        if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
        if (priceFilter) priceFilter.addEventListener('change', applyFilters);
        if (sortFilter) sortFilter.addEventListener('change', applyFilters);

        if (resetFilters) {
            resetFilters.addEventListener('click', () => {
                products.resetFilters();
                this.updateFilterUI();
                this.loadProductsPageProducts();
            });
        }

        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                products.resetFilters();
                this.updateFilterUI();
                this.loadProductsPageProducts();
            });
        }
    }

    // Load products page products
    async loadProductsPageProducts() {
        const container = document.getElementById('productsGrid');
        const countElement = document.getElementById('productsCount');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        try {
            const { products: filteredProducts, pagination } = await products.getFilteredProducts();

            if (filteredProducts.length === 0) {
                container.innerHTML = '';
                emptyState.style.display = 'block';
                if (countElement) countElement.textContent = '0 products';
                return;
            }

            emptyState.style.display = 'none';
            container.innerHTML = filteredProducts.map(product => 
                products.renderProductCard(product)
            ).join('');

            if (countElement) {
                countElement.textContent = `${pagination.total} products`;
            }

            this.updatePaginationUI(pagination);
        } catch (error) {
            console.error('Error loading products:', error);
            ui.showErrorState(container, 'Failed to load products');
        }
    }

    // Setup pagination
    setupPagination() {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const currentPage = products.getPage();
                if (currentPage > 1) {
                    products.setPage(currentPage - 1);
                    this.loadProductsPageProducts();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const currentPage = products.getPage();
                products.setPage(currentPage + 1);
                this.loadProductsPageProducts();
            });
        }
    }

    // Update pagination UI
    updatePaginationUI(pagination) {
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationNumbers = document.getElementById('paginationNumbers');

        if (prevBtn) prevBtn.disabled = !pagination.hasPrev;
        if (nextBtn) nextBtn.disabled = !pagination.hasNext;

        if (paginationNumbers) {
            paginationNumbers.innerHTML = '';
            for (let i = 1; i <= pagination.totalPages; i++) {
                const pageBtn = document.createElement('button');
                pageBtn.className = `pagination-number ${i === pagination.page ? 'active' : ''}`;
                pageBtn.textContent = i;
                pageBtn.addEventListener('click', () => {
                    products.setPage(i);
                    this.loadProductsPageProducts();
                });
                paginationNumbers.appendChild(pageBtn);
            }
        }
    }

    // Initialize product details page
    async initProductDetailsPage() {
        try {
            const productId = parseInt(new URLSearchParams(window.location.search).get('id'));
            
            if (!productId) {
                this.showProductError();
                return;
            }

            await this.loadProductDetails(productId);
            await this.loadRelatedProducts(productId);
        } catch (error) {
            console.error('Error initializing product details page:', error);
            this.showProductError();
        }
    }

    // Load product details
    async loadProductDetails(productId) {
        const container = document.getElementById('productDetails');
        const errorContainer = document.getElementById('productError');
        const breadcrumbProduct = document.getElementById('breadcrumbProduct');

        if (!container) return;

        try {
            const product = await products.getProduct(productId);
            
            // Add to recently viewed
            products.addToRecentlyViewed(product);

            // Update breadcrumb
            if (breadcrumbProduct) {
                breadcrumbProduct.textContent = product.title;
            }

            // Render product details
            container.innerHTML = `
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="${product.image}" alt="${product.title}" 
                             onerror="this.src='https://via.placeholder.com/500x500?text=Image+Not+Available'">
                    </div>
                </div>
                <div class="product-detail-info">
                    <span class="detail-category">${product.category}</span>
                    <h1 class="detail-title">${product.title}</h1>
                    <div class="detail-rating">
                        <span class="rating-stars">${products.renderStars(product.rating.rate)}</span>
                        <span class="rating-count">(${product.rating.count} reviews)</span>
                    </div>
                    <div class="detail-price">${formatCurrency(product.price)}</div>
                    <p class="detail-description">${product.description}</p>
                    
                    <div class="quantity-selector">
                        <button class="quantity-btn" data-action="decrease">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="99" id="quantityInput">
                        <button class="quantity-btn" data-action="increase">+</button>
                    </div>
                    
                    <div class="detail-actions">
                        <button class="btn btn-primary" id="addToCartBtn">Add to Cart</button>
                        <button class="btn btn-secondary" id="wishlistBtn">
                            ${wishlist.hasItem(product.id) ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                        </button>
                    </div>
                </div>
            `;

            // Setup quantity selector
            this.setupQuantitySelector();

            // Setup add to cart
            document.getElementById('addToCartBtn').addEventListener('click', () => {
                const quantity = parseInt(document.getElementById('quantityInput').value);
                cart.addItem(product, quantity);
                ui.updateCartCount();
                ui.showToast('Added to cart', 'success');
            });

            // Setup wishlist
            document.getElementById('wishlistBtn').addEventListener('click', () => {
                const result = wishlist.toggleItem(product);
                ui.updateWishlistCount();
                const btn = document.getElementById('wishlistBtn');
                btn.textContent = wishlist.hasItem(product.id) ? '♥ In Wishlist' : '♡ Add to Wishlist';
                ui.showToast(wishlist.hasItem(product.id) ? 'Added to wishlist' : 'Removed from wishlist', 'success');
            });

        } catch (error) {
            console.error('Error loading product details:', error);
            container.innerHTML = '';
            errorContainer.style.display = 'block';
        }
    }

    // Setup quantity selector
    setupQuantitySelector() {
        const decreaseBtn = document.querySelector('[data-action="decrease"]');
        const increaseBtn = document.querySelector('[data-action="increase"]');
        const quantityInput = document.getElementById('quantityInput');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue > 1) {
                    quantityInput.value = currentValue - 1;
                }
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                const currentValue = parseInt(quantityInput.value);
                if (currentValue < 99) {
                    quantityInput.value = currentValue + 1;
                }
            });
        }
    }

    // Load related products
    async loadRelatedProducts(productId) {
        const container = document.getElementById('relatedProducts');
        if (!container) return;

        try {
            const product = await products.getProduct(productId);
            const relatedProducts = await products.getRelatedProducts(productId, product.category, 4);
            
            container.innerHTML = relatedProducts.map(product => 
                products.renderProductCard(product)
            ).join('');
        } catch (error) {
            console.error('Error loading related products:', error);
        }
    }

    // Show product error
    showProductError() {
        const container = document.getElementById('productDetails');
        const errorContainer = document.getElementById('productError');
        
        if (container) container.innerHTML = '';
        if (errorContainer) errorContainer.style.display = 'block';
    }

    // Initialize cart page
    async initCartPage() {
        try {
            await this.loadCartItems();
            this.setupCartListeners();
        } catch (error) {
            console.error('Error initializing cart page:', error);
        }
    }

    // Load cart items
    async loadCartItems() {
        const container = document.getElementById('cartItemsList');
        const emptyCart = document.getElementById('emptyCart');
        const checkoutBtn = document.getElementById('checkoutBtn');

        if (!container) return;

        const cartItems = cart.getItems();

        if (cartItems.length === 0) {
            container.innerHTML = '';
            emptyCart.style.display = 'block';
            if (checkoutBtn) checkoutBtn.style.display = 'none';
            this.updateCartSummary();
            return;
        }

        emptyCart.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'inline-flex';

        container.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="cart-item-image">
                    <img src="${item.product.image}" alt="${item.product.title}"
                         onerror="this.src='https://via.placeholder.com/100x100?text=Image'">
                </div>
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.product.title}</h3>
                    <p class="cart-item-category">${item.product.category}</p>
                    <p class="cart-item-price">${formatCurrency(item.product.price)}</p>
                </div>
                <div class="cart-item-actions">
                    <div class="cart-quantity">
                        <button class="cart-quantity-btn" data-action="decrease">-</button>
                        <input type="number" class="cart-quantity-input" value="${item.quantity}" min="1" max="99">
                        <button class="cart-quantity-btn" data-action="increase">+</button>
                    </div>
                    <button class="cart-item-remove" data-action="remove">Remove</button>
                </div>
            </div>
        `).join('');

        this.updateCartSummary();
    }

    // Update cart summary
    updateCartSummary() {
        const totals = cart.getTotals();

        const subtotalEl = document.getElementById('subtotal');
        const deliveryEl = document.getElementById('deliveryCharge');
        const discountEl = document.getElementById('discount');
        const discountRow = document.getElementById('discountRow');
        const totalEl = document.getElementById('total');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
        if (deliveryEl) deliveryEl.textContent = formatCurrency(totals.deliveryCharge);
        if (discountEl) {
            discountEl.textContent = `-${formatCurrency(totals.discount)}`;
            discountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
        }
        if (totalEl) totalEl.textContent = formatCurrency(totals.total);
    }

    // Setup cart listeners
    setupCartListeners() {
        const container = document.getElementById('cartItemsList');
        const clearCartBtn = document.getElementById('clearCartBtn');
        const applyCouponBtn = document.getElementById('applyCouponBtn');
        const couponInput = document.getElementById('couponInput');

        // Cart item actions
        container.addEventListener('click', (e) => {
            const cartItem = e.target.closest('.cart-item');
            if (!cartItem) return;

            const productId = parseInt(cartItem.dataset.productId);
            const action = e.target.dataset.action;

            if (action === 'increase') {
                const input = cartItem.querySelector('.cart-quantity-input');
                const newQuantity = parseInt(input.value) + 1;
                cart.updateItemQuantity(productId, newQuantity);
                input.value = newQuantity;
                this.updateCartSummary();
            } else if (action === 'decrease') {
                const input = cartItem.querySelector('.cart-quantity-input');
                const newQuantity = parseInt(input.value) - 1;
                if (newQuantity > 0) {
                    cart.updateItemQuantity(productId, newQuantity);
                    input.value = newQuantity;
                    this.updateCartSummary();
                }
            } else if (action === 'remove') {
                const cartItem = e.target.closest('.cart-item');
                cartItem.classList.add('removing');
                
                setTimeout(() => {
                    cart.removeItem(productId);
                    this.loadCartItems();
                    ui.updateCartCount();
                }, 300);
            }
        });

        // Quantity input change
        container.addEventListener('change', (e) => {
            if (e.target.classList.contains('cart-quantity-input')) {
                const cartItem = e.target.closest('.cart-item');
                const productId = parseInt(cartItem.dataset.productId);
                const quantity = parseInt(e.target.value);
                
                if (validateQuantity(quantity)) {
                    cart.updateItemQuantity(productId, quantity);
                    this.updateCartSummary();
                } else {
                    e.target.value = cart.getItem(productId).quantity;
                }
            }
        });

        // Clear cart
        if (clearCartBtn) {
            clearCartBtn.addEventListener('click', () => {
                ui.confirm('Are you sure you want to clear your cart?', () => {
                    cart.clearCart();
                    this.loadCartItems();
                    ui.updateCartCount();
                    ui.showToast('Cart cleared', 'success');
                });
            });
        }

        // Apply coupon
        if (applyCouponBtn && couponInput) {
            applyCouponBtn.addEventListener('click', () => {
                const couponCode = couponInput.value.trim();
                if (couponCode) {
                    const result = cart.applyCoupon(couponCode);
                    if (result.success) {
                        this.updateCartSummary();
                        ui.showToast('Coupon applied successfully', 'success');
                    } else {
                        ui.showToast(result.error, 'error');
                    }
                }
            });
        }
    }

    // Initialize wishlist page
    async initWishlistPage() {
        try {
            await this.loadWishlistItems();
        } catch (error) {
            console.error('Error initializing wishlist page:', error);
        }
    }

    // Load wishlist items
    async loadWishlistItems() {
        const container = document.getElementById('wishlistItems');
        const emptyWishlist = document.getElementById('emptyWishlist');

        if (!container) return;

        const wishlistItems = wishlist.getItems();

        if (wishlistItems.length === 0) {
            container.innerHTML = '';
            emptyWishlist.style.display = 'block';
            return;
        }

        emptyWishlist.style.display = 'none';

        container.innerHTML = wishlistItems.map(item => `
            <div class="wishlist-item" data-product-id="${item.id}">
                <div class="product-image">
                    <img src="${item.product.image}" alt="${item.product.title}"
                         onerror="this.src='https://via.placeholder.com/300x300?text=Image'">
                </div>
                <div class="product-info">
                    <div class="product-category">${item.product.category}</div>
                    <h3 class="product-title">${item.product.title}</h3>
                    <div class="product-price">${formatCurrency(item.product.price)}</div>
                </div>
                <div class="wishlist-item-actions">
                    <button class="btn btn-primary" data-action="move-to-cart">Move to Cart</button>
                    <button class="btn btn-danger" data-action="remove">Remove</button>
                </div>
            </div>
        `).join('');

        // Setup wishlist item actions
        container.addEventListener('click', (e) => {
            const wishlistItem = e.target.closest('.wishlist-item');
            if (!wishlistItem) return;

            const productId = parseInt(wishlistItem.dataset.productId);
            const action = e.target.dataset.action;

            if (action === 'move-to-cart') {
                const result = wishlist.moveToCart(productId);
                if (result.success) {
                    this.loadWishlistItems();
                    ui.updateCartCount();
                    ui.showToast('Moved to cart', 'success');
                }
              } else if (action === 'remove') {
                const wishlistItem = e.target.closest('.wishlist-item');
                wishlistItem.classList.add('removing');
                
                setTimeout(() => {
                    wishlist.removeItem(productId);
                    this.loadWishlistItems();
                    ui.updateWishlistCount();
                    ui.showToast('Removed from wishlist', 'success');
                }, 300);
            }
        });
    }

    // Initialize checkout page
    async initCheckoutPage() {
        try {
            const authRequired = document.getElementById('authRequired');
            const emptyCartCheckout = document.getElementById('emptyCartCheckout');
            const checkoutWrapper = document.getElementById('checkoutWrapper');

            // Check authentication
            if (!auth.isAuthenticated()) {
                if (authRequired) authRequired.style.display = 'block';
                if (checkoutWrapper) checkoutWrapper.style.display = 'none';
                return;
            }

            // Check cart
            if (cart.isEmpty()) {
                if (emptyCartCheckout) emptyCartCheckout.style.display = 'block';
                if (checkoutWrapper) checkoutWrapper.style.display = 'none';
                return;
            }

            // Show checkout form
            if (authRequired) authRequired.style.display = 'none';
            if (emptyCartCheckout) emptyCartCheckout.style.display = 'none';
            if (checkoutWrapper) checkoutWrapper.style.display = 'block';

            // Load order summary
            this.loadOrderSummary();

            // Setup checkout form
            this.setupCheckoutForm();
        } catch (error) {
            console.error('Error initializing checkout page:', error);
        }
    }

    // Load order summary
    loadOrderSummary() {
        const container = document.getElementById('summaryItems');
        const cartItems = cart.getItems();
        const totals = cart.getTotals();

        if (!container) return;

        container.innerHTML = cartItems.map(item => `
            <div class="summary-item">
                <div class="summary-item-info">
                    <div class="summary-item-name">${item.product.title}</div>
                    <div class="summary-item-quantity">Qty: ${item.quantity}</div>
                </div>
                <div class="summary-item-price">${formatCurrency(item.product.price * item.quantity)}</div>
            </div>
        `).join('');

        // Update totals
        const subtotalEl = document.getElementById('summarySubtotal');
        const deliveryEl = document.getElementById('summaryDelivery');
        const discountEl = document.getElementById('summaryDiscount');
        const discountRow = document.getElementById('summaryDiscountRow');
        const totalEl = document.getElementById('summaryTotal');

        if (subtotalEl) subtotalEl.textContent = formatCurrency(totals.subtotal);
        if (deliveryEl) deliveryEl.textContent = formatCurrency(totals.deliveryCharge);
        if (discountEl) {
            discountEl.textContent = `-${formatCurrency(totals.discount)}`;
            discountRow.style.display = totals.discount > 0 ? 'flex' : 'none';
        }
        if (totalEl) totalEl.textContent = formatCurrency(totals.total);
    }

    // Setup checkout form
    setupCheckoutForm() {
        const form = document.getElementById('checkoutForm');
        if (!form) return;

        // Prefill user data
        const user = auth.getCurrentUser();
        if (user) {
            const emailField = form.querySelector('[name="email"]');
            if (emailField) emailField.value = user.email;
        }

        // Form submission
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const checkoutData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                phone: formData.get('phone'),
                address: formData.get('address'),
                city: formData.get('city'),
                state: formData.get('state'),
                zipCode: formData.get('zipCode'),
                country: formData.get('country'),
                paymentMethod: formData.get('paymentMethod')
            };

            const result = await checkout.processCheckout(checkoutData);

            if (result.success) {
                ui.showToast('Order placed successfully!', 'success');
                window.location.href = `index.html?order=${result.order.id}`;
            } else {
                ui.showToast(result.error, 'error');
            }
        });
    }

    // Initialize login page
    async initLoginPage() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const email = formData.get('email');
            const password = formData.get('password');
            const rememberMe = document.getElementById('rememberMe').checked;

            const result = await auth.login(email, password, rememberMe);

            if (result.success) {
                ui.updateAuthLinks();
                ui.showToast('Login successful!', 'success');
                
                // Redirect to checkout if coming from there
                const redirectUrl = new URLSearchParams(window.location.search).get('redirect');
                window.location.href = redirectUrl || 'index.html';
            } else {
                ui.showToast(result.error, 'error');
            }
        });
    }

    // Initialize signup page
    async initSignupPage() {
        const form = document.getElementById('signupForm');
        if (!form) return;

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                email: formData.get('email'),
                password: formData.get('password'),
                confirmPassword: formData.get('confirmPassword')
            };

            const result = await auth.signup(userData);

            if (result.success) {
                ui.updateAuthLinks();
                ui.showToast('Account created successfully!', 'success');
                window.location.href = 'index.html';
            } else {
                ui.showToast(result.error, 'error');
            }
        });
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ShopKart...');
    console.log('Dummy data available:', typeof window.getDummyProducts !== 'undefined');
    console.log('USE_DUMMY_DATA setting:', API_CONFIG?.USE_DUMMY_DATA);
    
    try {
        const app = new App();
        console.log('ShopKart initialized successfully');
    } catch (error) {
        console.error('Error initializing ShopKart:', error);
        // Show error to user
        document.body.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100vh; text-align: center; padding: 20px;">
                <div>
                    <h1 style="color: #e74c3c; margin-bottom: 20px;">Application Error</h1>
                    <p style="margin-bottom: 20px;">Failed to initialize the application. Please refresh the page.</p>
                    <p style="color: #666; font-size: 14px;">Error: ${error.message}</p>
                    <button onclick="location.reload()" style="margin-top: 20px; padding: 12px 24px; background: #ff6b35; color: white; border: none; border-radius: 8px; cursor: pointer;">Refresh Page</button>
                </div>
            </div>
        `;
    }
});
