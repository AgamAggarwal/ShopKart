/**
 * ShopKart - API Module
 * API calls to fetch products from FakeStoreAPI or use dummy data
 */

// API configuration
const API_CONFIG = {
    BASE_URL: 'https://fakestoreapi.com',
    ENDPOINTS: {
        PRODUCTS: '/products',
        PRODUCT: '/products/{id}',
        CATEGORIES: '/products/categories',
        CATEGORY: '/products/category/{category}'
    },
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000,
    USE_DUMMY_DATA: true // Set to true to use dummy data, false to use FakeStoreAPI
};

// API error class
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// Fetch wrapper with timeout
const fetchWithTimeout = async (url, options = {}, timeout = API_CONFIG.TIMEOUT) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new APIError('Request timeout', 408);
        }
        throw error;
    }
};

// Retry fetch function
const fetchWithRetry = async (url, options = {}, attempts = API_CONFIG.RETRY_ATTEMPTS, delay = API_CONFIG.RETRY_DELAY) => {
    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetchWithTimeout(url, options);
            return response;
        } catch (error) {
            if (i === attempts - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
    }
};

// Handle API response
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new APIError(
            errorData?.message || `HTTP error! status: ${response.status}`,
            response.status,
            errorData
        );
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
        return await response.json();
    }

    return await response.text();
};

// Build URL with parameters
const buildUrl = (endpoint, params = {}) => {
    const url = new URL(API_CONFIG.BASE_URL + endpoint);
    
    for (const key in params) {
        if (params[key] !== undefined && params[key] !== null) {
            url.searchParams.append(key, params[key]);
        }
    }

    return url.toString();
};

// API class
class API {
    // Get all products
    static async getProducts(params = {}) {
        // Use dummy data if configured
        if (API_CONFIG.USE_DUMMY_DATA) {
            console.log('Using dummy data for products');
            // Access from window object for browser environment
            const getProducts = window.getDummyProducts || getDummyProducts;
            return getProducts();
        }

        try {
            const url = buildUrl(API_CONFIG.ENDPOINTS.PRODUCTS, params);
            const response = await fetchWithRetry(url);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            console.error('Error fetching products:', error);
            // Fallback to dummy data on API failure
            console.log('Falling back to dummy data');
            const getProducts = window.getDummyProducts || getDummyProducts;
            return getProducts();
        }
    }

    // Get single product by ID
    static async getProduct(id) {
        // Use dummy data if configured
        if (API_CONFIG.USE_DUMMY_DATA) {
            console.log('Using dummy data for product');
            const getProductById = window.getDummyProductById || getDummyProductById;
            const product = getProductById(id);
            if (product) return product;
            throw new APIError('Product not found', 404);
        }

        try {
            const endpoint = API_CONFIG.ENDPOINTS.PRODUCT.replace('{id}', id);
            const url = buildUrl(endpoint);
            const response = await fetchWithRetry(url);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            // Fallback to dummy data on API failure
            const getProductById = window.getDummyProductById || getDummyProductById;
            const product = getProductById(id);
            if (product) {
                console.log('Falling back to dummy data');
                return product;
            }
            throw error;
        }
    }

    // Get all categories
    static async getCategories() {
        // Use dummy data if configured
        if (API_CONFIG.USE_DUMMY_DATA) {
            console.log('Using dummy data for categories');
            const getCategories = window.getDummyCategories || getDummyCategories;
            return getCategories();
        }

        try {
            const url = buildUrl(API_CONFIG.ENDPOINTS.CATEGORIES);
            const response = await fetchWithRetry(url);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Fallback to dummy data on API failure
            console.log('Falling back to dummy data');
            const getCategories = window.getDummyCategories || getDummyCategories;
            return getCategories();
        }
    }

    // Get products by category
    static async getProductsByCategory(category, params = {}) {
        // Use dummy data if configured
        if (API_CONFIG.USE_DUMMY_DATA) {
            console.log('Using dummy data for category products');
            const getProductsByCategory = window.getDummyProductsByCategory || getDummyProductsByCategory;
            return getProductsByCategory(category);
        }

        try {
            const endpoint = API_CONFIG.ENDPOINTS.CATEGORY.replace('{category}', category);
            const url = buildUrl(endpoint, params);
            const response = await fetchWithRetry(url);
            const data = await handleResponse(response);
            return data;
        } catch (error) {
            console.error(`Error fetching products for category ${category}:`, error);
            // Fallback to dummy data on API failure
            console.log('Falling back to dummy data');
            const getProductsByCategory = window.getDummyProductsByCategory || getDummyProductsByCategory;
            return getProductsByCategory(category);
        }
    }

    // Search products (client-side filtering since API doesn't support search)
    static async searchProducts(query) {
        try {
            const products = await this.getProducts();
            const searchTerm = query.toLowerCase().trim();
            
            if (!searchTerm) return products;

            return products.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        } catch (error) {
            console.error('Error searching products:', error);
            // Fallback to dummy data search
            const getProducts = window.getDummyProducts || getDummyProducts;
            const allProducts = getProducts();
            const searchTerm = query.toLowerCase().trim();
            return allProducts.filter(product => 
                product.title.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.category.toLowerCase().includes(searchTerm)
            );
        }
    }

    // Sort products
    static sortProducts(products, sortBy = 'default') {
        const sorted = [...products];

        switch (sortBy) {
            case 'price-low':
                return sorted.sort((a, b) => a.price - b.price);
            case 'price-high':
                return sorted.sort((a, b) => b.price - a.price);
            case 'rating':
                return sorted.sort((a, b) => b.rating.rate - a.rating.rate);
            case 'newest':
                return sorted.sort((a, b) => b.id - a.id);
            case 'default':
            default:
                return sorted;
        }
    }

    // Filter products by price range
    static filterByPrice(products, priceRange) {
        if (!priceRange) return products;

        const [min, max] = priceRange.split('-').map(p => parseFloat(p.replace('+', '')));

        if (priceRange.includes('+')) {
            return products.filter(product => product.price >= min);
        }

        return products.filter(product => product.price >= min && product.price <= max);
    }

    // Filter products by category
    static filterByCategory(products, category) {
        if (!category) return products;

        return products.filter(product => 
            product.category.toLowerCase() === category.toLowerCase()
        );
    }

    // Get featured products (random selection)
    static async getFeaturedProducts(count = 4) {
        try {
            const products = await this.getProducts();
            const shuffled = products.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            const allProducts = getProducts();
            const shuffled = allProducts.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }
    }

    // Get trending products (highest rated)
    static async getTrendingProducts(count = 4) {
        try {
            const products = await this.getProducts();
            const sorted = this.sortProducts(products, 'rating');
            return sorted.slice(0, count);
        } catch (error) {
            console.error('Error fetching trending products:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            const allProducts = getProducts();
            const sorted = this.sortProducts(allProducts, 'rating');
            return sorted.slice(0, count);
        }
    }

    // Get latest products (newest by ID)
    static async getLatestProducts(count = 4) {
        try {
            const products = await this.getProducts();
            const sorted = this.sortProducts(products, 'newest');
            return sorted.slice(0, count);
        } catch (error) {
            console.error('Error fetching latest products:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            const allProducts = getProducts();
            const sorted = this.sortProducts(allProducts, 'newest');
            return sorted.slice(0, count);
        }
    }

    // Get related products (same category)
    static async getRelatedProducts(productId, category, count = 4) {
        try {
            const products = await this.getProductsByCategory(category);
            const related = products.filter(product => product.id !== productId);
            const shuffled = related.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        } catch (error) {
            console.error('Error fetching related products:', error);
            // Fallback to dummy data
            const getProductsByCategory = window.getDummyProductsByCategory || getDummyProductsByCategory;
            const categoryProducts = getProductsByCategory(category);
            const related = categoryProducts.filter(product => product.id !== productId);
            const shuffled = related.sort(() => 0.5 - Math.random());
            return shuffled.slice(0, count);
        }
    }

    // Get products with pagination
    static async getProductsWithPagination(page = 1, limit = 12, filters = {}) {
        try {
            let products = await this.getProducts();

            // Apply filters
            if (filters.category) {
                products = this.filterByCategory(products, filters.category);
            }

            if (filters.priceRange) {
                products = this.filterByPrice(products, filters.priceRange);
            }

            if (filters.search) {
                products = await this.searchProducts(filters.search);
            }

            // Apply sorting
            if (filters.sortBy) {
                products = this.sortProducts(products, filters.sortBy);
            }

            // Apply pagination
            const total = products.length;
            const totalPages = Math.ceil(total / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = products.slice(startIndex, endIndex);

            return {
                products: paginatedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            console.error('Error fetching products with pagination:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            let products = getProducts();

            if (filters.category) {
                products = this.filterByCategory(products, filters.category);
            }

            if (filters.priceRange) {
                products = this.filterByPrice(products, filters.priceRange);
            }

            if (filters.search) {
                const searchTerm = filters.search.toLowerCase().trim();
                products = products.filter(product => 
                    product.title.toLowerCase().includes(searchTerm) ||
                    product.description.toLowerCase().includes(searchTerm) ||
                    product.category.toLowerCase().includes(searchTerm)
                );
            }

            if (filters.sortBy) {
                products = this.sortProducts(products, filters.sortBy);
            }

            const total = products.length;
            const totalPages = Math.ceil(total / limit);
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedProducts = products.slice(startIndex, endIndex);

            return {
                products: paginatedProducts,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1
                }
            };
        }
    }

    // Get product count by category
    static async getProductCountByCategory() {
        try {
            const products = await this.getProducts();
            const countByCategory = {};

            products.forEach(product => {
                const category = product.category;
                countByCategory[category] = (countByCategory[category] || 0) + 1;
            });

            return countByCategory;
        } catch (error) {
            console.error('Error getting product count by category:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            const products = getProducts();
            const countByCategory = {};

            products.forEach(product => {
                const category = product.category;
                countByCategory[category] = (countByCategory[category] || 0) + 1;
            });

            return countByCategory;
        }
    }

    // Get price range
    static async getPriceRange() {
        try {
            const products = await this.getProducts();
            const prices = products.map(p => p.price);
            
            return {
                min: Math.min(...prices),
                max: Math.max(...prices),
                average: prices.reduce((a, b) => a + b, 0) / prices.length
            };
        } catch (error) {
            console.error('Error getting price range:', error);
            // Fallback to dummy data
            const getProducts = window.getDummyProducts || getDummyProducts;
            const products = getProducts();
            const prices = products.map(p => p.price);
            
            return {
                min: Math.min(...prices),
                max: Math.max(...prices),
                average: prices.reduce((a, b) => a + b, 0) / prices.length
            };
        }
    }
}

// Cache for API responses
const APICache = {
    cache: new Map(),
    ttl: 5 * 60 * 1000, // 5 minutes

    set(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    },

    get(key) {
        const cached = this.cache.get(key);
        if (!cached) return null;

        const age = Date.now() - cached.timestamp;
        if (age > this.ttl) {
            this.cache.delete(key);
            return null;
        }

        return cached.data;
    },

    clear() {
        this.cache.clear();
    }
};

// Cached API calls
const CachedAPI = {
    async getProducts(params = {}) {
        const cacheKey = `products_${JSON.stringify(params)}`;
        const cached = APICache.get(cacheKey);
        
        if (cached) return cached;

        const data = await API.getProducts(params);
        APICache.set(cacheKey, data);
        return data;
    },

    async getProduct(id) {
        const cacheKey = `product_${id}`;
        const cached = APICache.get(cacheKey);
        
        if (cached) return cached;

        const data = await API.getProduct(id);
        APICache.set(cacheKey, data);
        return data;
    },

    async getCategories() {
        const cacheKey = 'categories';
        const cached = APICache.get(cacheKey);
        
        if (cached) return cached;

        const data = await API.getCategories();
        APICache.set(cacheKey, data);
        return data;
    },

    clearCache() {
        APICache.clear();
    }
};

// Export API module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        API_CONFIG,
        API,
        APIError,
        CachedAPI,
        APICache
    };
}
