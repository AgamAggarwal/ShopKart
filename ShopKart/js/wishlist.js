/**
 * ShopKart - Wishlist Module
 * Wishlist functionality
 */

// Wishlist class
class Wishlist {
    constructor() {
        this.items = WishlistStorage.getWishlist();
        this.init();
    }

    // Initialize wishlist
    init() {
        // Any initialization logic
    }

    // Get all wishlist items
    getItems() {
        return this.items;
    }

    // Add item to wishlist
    addItem(product) {
        // Check if item already exists
        if (this.hasItem(product.id)) {
            return { success: false, error: 'Item already in wishlist' };
        }

        this.items.push({
            id: product.id,
            product: product,
            addedAt: new Date().toISOString()
        });

        this.saveWishlist();

        return { 
            success: true, 
            item: this.items.find(item => item.id === product.id),
            count: this.getItemCount()
        };
    }

    // Remove item from wishlist
    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        
        if (index === -1) {
            return { success: false, error: 'Item not found in wishlist' };
        }

        this.items.splice(index, 1);
        this.saveWishlist();

        return { success: true, count: this.getItemCount() };
    }

    // Toggle item in wishlist
    toggleItem(product) {
        if (this.hasItem(product.id)) {
            return this.removeItem(product.id);
        } else {
            return this.addItem(product);
        }
    }

    // Move item to cart
    moveToCart(productId) {
        const item = this.items.find(item => item.id === productId);
        
        if (!item) {
            return { success: false, error: 'Item not found in wishlist' };
        }

        // Add to cart
        const cartResult = cart.addItem(item.product, 1);
        
        if (cartResult.success) {
            // Remove from wishlist
            this.removeItem(productId);
            return { success: true, cartItem: cartResult.item };
        }

        return cartResult;
    }

    // Move all items to cart
    moveAllToCart() {
        const results = [];
        const itemIds = this.items.map(item => item.id);

        itemIds.forEach(productId => {
            const result = this.moveToCart(productId);
            results.push(result);
        });

        return results;
    }

    // Clear wishlist
    clearWishlist() {
        this.items = [];
        this.saveWishlist();

        return { success: true };
    }

    // Save wishlist to storage
    saveWishlist() {
        WishlistStorage.saveWishlist(this.items);
    }

    // Get wishlist item count
    getItemCount() {
        return this.items.length;
    }

    // Check if wishlist is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Check if product is in wishlist
    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    // Get item by product ID
    getItem(productId) {
        return this.items.find(item => item.id === productId);
    }

    // Sort wishlist by date added
    sortByDate(order = 'desc') {
        if (order === 'desc') {
            this.items.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
        } else {
            this.items.sort((a, b) => new Date(a.addedAt) - new Date(b.addedAt));
        }

        this.saveWishlist();
        return this.items;
    }

    // Sort wishlist by price
    sortByPrice(order = 'asc') {
        if (order === 'asc') {
            this.items.sort((a, b) => a.product.price - b.product.price);
        } else {
            this.items.sort((a, b) => b.product.price - a.product.price);
        }

        this.saveWishlist();
        return this.items;
    }

    // Sort wishlist by name
    sortByName(order = 'asc') {
        if (order === 'asc') {
            this.items.sort((a, b) => a.product.title.localeCompare(b.product.title));
        } else {
            this.items.sort((a, b) => b.product.title.localeCompare(a.product.title));
        }

        this.saveWishlist();
        return this.items;
    }
}

// Create wishlist instance
const wishlist = new Wishlist();

// Make wishlist globally available for browser environment
if (typeof window !== 'undefined') {
    window.wishlist = wishlist;
}

// Export wishlist module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Wishlist,
        wishlist
    };
}
