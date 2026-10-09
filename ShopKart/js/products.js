/**
 * ShopKart - Products Module
 * Product display and management
 */

// Products class
class Products {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentFilters = {
            category: '',
            priceRange: '',
            sortBy: 'default',
            search: ''
        };
        this.currentPage = 1;
        this.itemsPerPage = 8;
        this.init();
    }

    // Initialize products
    async init() {
        try {
            await this.loadCategories();
        } catch (error) {
            console.error('Error initializing products:', error);
        }
    }

    // Load all products
    async loadProducts() {
        try {
            this.products = await CachedAPI.getProducts();
            return this.products;
        } catch (error) {
            console.error('Error loading products:', error);
            throw error;
        }
    }

    // Load categories
    async loadCategories() {
        try {
            this.categories = await CachedAPI.getCategories();
            return this.categories;
        } catch (error) {
            console.error('Error loading categories:', error);
            throw error;
        }
    }

    // Get all products
    getProducts() {
        return this.products;
    }

    // Get all categories
    getCategories() {
        return this.categories;
    }

    // Get product by ID
    async getProduct(id) {
        try {
            const product = await CachedAPI.getProduct(id);
            return product;
        } catch (error) {
            console.error(`Error loading product ${id}:`, error);
            throw error;
        }
    }

    // Get products by category
    async getProductsByCategory(category) {
        try {
            const products = await CachedAPI.getProductsByCategory(category);
            return products;
        } catch (error) {
            console.error(`Error loading products for category ${category}:`, error);
            throw error;
        }
    }

    // Get featured products
    async getFeaturedProducts(count = 4) {
        try {
            const products = await API.getFeaturedProducts(count);
            return products;
        } catch (error) {
            console.error('Error loading featured products:', error);
            throw error;
        }
    }

    // Get trending products
    async getTrendingProducts(count = 4) {
        try {
            const products = await API.getTrendingProducts(count);
            return products;
        } catch (error) {
            console.error('Error loading trending products:', error);
            throw error;
        }
    }

    // Get latest products
    async getLatestProducts(count = 4) {
        try {
            const products = await API.getLatestProducts(count);
            return products;
        } catch (error) {
            console.error('Error loading latest products:', error);
            throw error;
        }
    }

    // Get related products
    async getRelatedProducts(productId, category, count = 4) {
        try {
            const products = await API.getRelatedProducts(productId, category, count);
            return products;
        } catch (error) {
            console.error('Error loading related products:', error);
            throw error;
        }
    }

    // Search products
    async searchProducts(query) {
        try {
            const products = await API.searchProducts(query);
            return products;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    // Set filters
    setFilters(filters) {
        this.currentFilters = { ...this.currentFilters, ...filters };
        this.currentPage = 1; // Reset to first page when filters change
    }

    // Get current filters
    getFilters() {
        return this.currentFilters;
    }

    // Reset filters
    resetFilters() {
        this.currentFilters = {
            category: '',
            priceRange: '',
            sortBy: 'default',
            search: ''
        };
        this.currentPage = 1;
    }

    // Set current page
    setPage(page) {
        this.currentPage = page;
    }

    // Get current page
    getPage() {
        return this.currentPage;
    }

    // Get filtered and paginated products
    async getFilteredProducts() {
        try {
            let products = this.products.length > 0 ? this.products : await this.loadProducts();

            // Apply search filter
            if (this.currentFilters.search) {
                products = await this.searchProducts(this.currentFilters.search);
            }

            // Apply category filter
            if (this.currentFilters.category) {
                products = API.filterByCategory(products, this.currentFilters.category);
            }

            // Apply price range filter
            if (this.currentFilters.priceRange) {
                products = API.filterByPrice(products, this.currentFilters.priceRange);
            }

            // Apply sorting
            if (this.currentFilters.sortBy) {
                products = API.sortProducts(products, this.currentFilters.sortBy);
            }

            // Apply pagination
            const total = products.length;
            const totalPages = Math.ceil(total / this.itemsPerPage);
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            const paginatedProducts = products.slice(startIndex, endIndex);

            return {
                products: paginatedProducts,
                pagination: {
                    page: this.currentPage,
                    itemsPerPage: this.itemsPerPage,
                    total,
                    totalPages,
                    hasNext: this.currentPage < totalPages,
                    hasPrev: this.currentPage > 1
                }
            };
        } catch (error) {
            console.error('Error getting filtered products:', error);
            throw error;
        }
    }

    // Render product card HTML
    renderProductCard(product) {
        const isInWishlist = wishlist.hasItem(product.id);
        const isInCart = cart.hasItem(product.id);

        return `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image">
                    <img 
                        src="${product.image}" 
                        alt="${product.title}" 
                        loading="lazy"
                        onerror="this.src='https://via.placeholder.com/300x300?text=Image+Not+Available'"
                    >
                    <button class="product-wishlist ${isInWishlist ? 'active' : ''}" 
                            data-action="wishlist" 
                            data-product-id="${product.id}"
                            aria-label="Add to wishlist">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                    <button class="product-quick-view" data-action="quick-view" data-product-id="${product.id}">
                        Quick View
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-category">${product.category}</div>
                    <h3 class="product-title">
                        <a href="product-details.html?id=${product.id}">${product.title}</a>
                    </h3>
                    <div class="product-rating">
                        <span class="rating-stars">${this.renderStars(product.rating.rate)}</span>
                        <span class="rating-count">(${product.rating.count})</span>
                    </div>
                    <div class="product-price">${formatCurrency(product.price)}</div>
                    <div class="product-actions">
                        <button class="btn btn-primary" data-action="add-to-cart" data-product-id="${product.id}">
                            ${isInCart ? 'Add More' : 'Add to Cart'}
                        </button>
                        <a href="product-details.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                    </div>
                </div>
            </div>
        `;
    }

    // Render quick view modal
    renderQuickViewModal(product) {
        const isInWishlist = wishlist.hasItem(product.id);
        const isInCart = cart.hasItem(product.id);

        return `
            <div class="modal" id="quickViewModal">
                <div class="modal-content">
                    <button class="modal-close" id="closeModal">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                    <div class="modal-body">
                        <div class="modal-product-image image-zoom-container">
                            <img src="${product.image}" alt="${product.title}"
                                 onerror="this.src='https://via.placeholder.com/500x500?text=Image+Not+Available'">
                        </div>
                        <div class="modal-product-info">
                            <span class="modal-product-category">${product.category}</span>
                            <h2 class="modal-product-title">${product.title}</h2>
                            <div class="modal-product-rating">
                                <span class="rating-stars">${this.renderStars(product.rating.rate)}</span>
                                <span class="rating-count">(${product.rating.count} reviews)</span>
                            </div>
                            <div class="modal-product-price">${formatCurrency(product.price)}</div>
                            <p class="modal-product-description">${product.description}</p>
                            
                            <div class="modal-quantity-selector">
                                <button class="modal-quantity-btn" data-action="decrease">-</button>
                                <input type="number" class="modal-quantity-input" value="1" min="1" max="99" id="modalQuantity">
                                <button class="modal-quantity-btn" data-action="increase">+</button>
                            </div>
                            
                            <div class="modal-actions">
                                <button class="btn btn-primary" id="modalAddToCart" data-product-id="${product.id}">
                                    ${isInCart ? 'Add More' : 'Add to Cart'}
                                </button>
                                <button class="btn btn-secondary" id="modalWishlist" data-product-id="${product.id}">
                                    ${isInWishlist ? '♥ In Wishlist' : '♡ Add to Wishlist'}
                                </button>
                            </div>
                            
                            <a href="product-details.html?id=${product.id}" class="btn btn-secondary btn-block mt-2">
                                View Full Details
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Render star rating
    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

        let stars = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars += '★';
        }
        
        // Half star
        if (hasHalfStar) {
            stars += '½';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            stars += '☆';
        }

        return stars;
    }

    // Render category card
    renderCategoryCard(category) {
        const categoryIcons = {
            "electronics": "📱",
            "jewelery": "💎",
            "men's clothing": "👔",
            "women's clothing": "👗"
        };

        const icon = categoryIcons[category] || "📦";

        return `
            <div class="category-card" data-category="${category}">
                <div class="category-icon">${icon}</div>
                <div class="category-name">${toTitleCase(category)}</div>
            </div>
        `;
    }

    // Add to recently viewed
    addToRecentlyViewed(product) {
        RecentlyViewedStorage.addProduct(product);
    }

    // Get recently viewed products
    getRecentlyViewed() {
        return RecentlyViewedStorage.getRecentlyViewed();
    }
}

// Create products instance
const products = new Products();

// Make products globally available for browser environment
if (typeof window !== 'undefined') {
    window.products = products;
}

// Export products module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Products,
        products
    };
}
