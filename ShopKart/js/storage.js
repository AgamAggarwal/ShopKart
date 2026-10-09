/**
 * ShopKart - Storage Module
 * LocalStorage management for cart, wishlist, user, orders, and theme
 */

// Storage keys
const STORAGE_KEYS = {
    CART: 'shopkart_cart',
    WISHLIST: 'shopkart_wishlist',
    USER: 'shopkart_user',
    ORDERS: 'shopkart_orders',
    THEME: 'shopkart_theme',
    RECENTLY_VIEWED: 'shopkart_recently_viewed',
    COUPON: 'shopkart_coupon'
};

// Storage class for managing LocalStorage
class Storage {
    // Get item from LocalStorage
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error(`Error getting item from storage: ${error}`);
            return defaultValue;
        }
    }

    // Set item in LocalStorage
    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error(`Error setting item in storage: ${error}`);
            return false;
        }
    }

    // Remove item from LocalStorage
    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error(`Error removing item from storage: ${error}`);
            return false;
        }
    }

    // Clear all items from LocalStorage
    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error(`Error clearing storage: ${error}`);
            return false;
        }
    }

    // Check if item exists in LocalStorage
    static has(key) {
        return localStorage.getItem(key) !== null;
    }

    // Get all keys from LocalStorage
    static keys() {
        return Object.keys(localStorage);
    }

    // Get storage size in bytes
    static getSize() {
        let total = 0;
        for (const key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        return total;
    }
}

// Cart storage operations
const CartStorage = {
    // Get cart from storage
    getCart() {
        return Storage.get(STORAGE_KEYS.CART, []);
    },

    // Save cart to storage
    saveCart(cart) {
        return Storage.set(STORAGE_KEYS.CART, cart);
    },

    // Add item to cart
    addToCart(product, quantity = 1) {
        const cart = this.getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: product.id,
                product: product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart(cart);
        return cart;
    },

    // Update item quantity in cart
    updateQuantity(productId, quantity) {
        const cart = this.getCart();
        const item = cart.find(item => item.id === productId);

        if (item) {
            if (quantity <= 0) {
                return this.removeFromCart(productId);
            }
            item.quantity = quantity;
            this.saveCart(cart);
        }

        return cart;
    },

    // Remove item from cart
    removeFromCart(productId) {
        const cart = this.getCart();
        const updatedCart = cart.filter(item => item.id !== productId);
        this.saveCart(updatedCart);
        return updatedCart;
    },

    // Clear cart
    clearCart() {
        this.saveCart([]);
        return [];
    },

    // Get cart total
    getCartTotal() {
        const cart = this.getCart();
        return cart.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    },

    // Get cart item count
    getCartCount() {
        const cart = this.getCart();
        return cart.reduce((count, item) => count + item.quantity, 0);
    },

    // Check if product is in cart
    isInCart(productId) {
        const cart = this.getCart();
        return cart.some(item => item.id === productId);
    }
};

// Wishlist storage operations
const WishlistStorage = {
    // Get wishlist from storage
    getWishlist() {
        return Storage.get(STORAGE_KEYS.WISHLIST, []);
    },

    // Save wishlist to storage
    saveWishlist(wishlist) {
        return Storage.set(STORAGE_KEYS.WISHLIST, wishlist);
    },

    // Add item to wishlist
    addToWishlist(product) {
        const wishlist = this.getWishlist();
        
        if (!this.isInWishlist(product.id)) {
            wishlist.push({
                id: product.id,
                product: product,
                addedAt: new Date().toISOString()
            });
            this.saveWishlist(wishlist);
        }

        return wishlist;
    },

    // Remove item from wishlist
    removeFromWishlist(productId) {
        const wishlist = this.getWishlist();
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        this.saveWishlist(updatedWishlist);
        return updatedWishlist;
    },

    // Clear wishlist
    clearWishlist() {
        this.saveWishlist([]);
        return [];
    },

    // Move item from wishlist to cart
    moveToCart(productId) {
        const wishlist = this.getWishlist();
        const item = wishlist.find(item => item.id === productId);

        if (item) {
            CartStorage.addToCart(item.product, 1);
            this.removeFromWishlist(productId);
        }

        return { wishlist: this.getWishlist(), cart: CartStorage.getCart() };
    },

    // Check if product is in wishlist
    isInWishlist(productId) {
        const wishlist = this.getWishlist();
        return wishlist.some(item => item.id === productId);
    },

    // Get wishlist count
    getWishlistCount() {
        const wishlist = this.getWishlist();
        return wishlist.length;
    }
};

// User storage operations
const UserStorage = {
    // Get user from storage
    getUser() {
        return Storage.get(STORAGE_KEYS.USER, null);
    },

    // Save user to storage
    saveUser(user) {
        return Storage.set(STORAGE_KEYS.USER, user);
    },

    // Remove user from storage
    removeUser() {
        return Storage.remove(STORAGE_KEYS.USER);
    },

    // Check if user is logged in
    isLoggedIn() {
        const user = this.getUser();
        return user !== null;
    },

    // Get user display name
    getUserName() {
        const user = this.getUser();
        return user ? `${user.firstName} ${user.lastName}` : '';
    },

    // Get user email
    getUserEmail() {
        const user = this.getUser();
        return user ? user.email : '';
    }
};

// Orders storage operations
const OrdersStorage = {
    // Get orders from storage
    getOrders() {
        return Storage.get(STORAGE_KEYS.ORDERS, []);
    },

    // Save orders to storage
    saveOrders(orders) {
        return Storage.set(STORAGE_KEYS.ORDERS, orders);
    },

    // Add order to storage
    addOrder(order) {
        const orders = this.getOrders();
        orders.unshift(order); // Add to beginning
        this.saveOrders(orders);
        return orders;
    },

    // Get order by ID
    getOrderById(orderId) {
        const orders = this.getOrders();
        return orders.find(order => order.id === orderId);
    },

    // Clear all orders
    clearOrders() {
        this.saveOrders([]);
        return [];
    }
};

// Theme storage operations
const ThemeStorage = {
    // Get theme from storage
    getTheme() {
        return Storage.get(STORAGE_KEYS.THEME, 'light');
    },

    // Save theme to storage
    saveTheme(theme) {
        return Storage.set(STORAGE_KEYS.THEME, theme);
    },

    // Toggle theme
    toggleTheme() {
        const currentTheme = this.getTheme();
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.saveTheme(newTheme);
        return newTheme;
    }
};

// Recently viewed products storage
const RecentlyViewedStorage = {
    // Get recently viewed products
    getRecentlyViewed() {
        return Storage.get(STORAGE_KEYS.RECENTLY_VIEWED, []);
    },

    // Save recently viewed products
    saveRecentlyViewed(products) {
        return Storage.set(STORAGE_KEYS.RECENTLY_VIEWED, products);
    },

    // Add product to recently viewed
    addProduct(product) {
        const recentlyViewed = this.getRecentlyViewed();
        
        // Remove if already exists
        const filtered = recentlyViewed.filter(item => item.id !== product.id);
        
        // Add to beginning
        filtered.unshift({
            id: product.id,
            product: product,
            viewedAt: new Date().toISOString()
        });

        // Keep only last 10 items
        const limited = filtered.slice(0, 10);
        
        this.saveRecentlyViewed(limited);
        return limited;
    },

    // Clear recently viewed
    clearRecentlyViewed() {
        this.saveRecentlyViewed([]);
        return [];
    }
};

// Coupon storage operations
const CouponStorage = {
    // Get applied coupon
    getCoupon() {
        return Storage.get(STORAGE_KEYS.COUPON, null);
    },

    // Save applied coupon
    saveCoupon(coupon) {
        return Storage.set(STORAGE_KEYS.COUPON, coupon);
    },

    // Remove coupon
    removeCoupon() {
        return Storage.remove(STORAGE_KEYS.COUPON);
    },

    // Clear coupon
    clearCoupon() {
        this.removeCoupon();
        return null;
    }
};

// Export all storage operations
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Storage,
        STORAGE_KEYS,
        CartStorage,
        WishlistStorage,
        UserStorage,
        OrdersStorage,
        ThemeStorage,
        RecentlyViewedStorage,
        CouponStorage
    };
}
