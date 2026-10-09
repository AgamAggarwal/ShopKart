/**
 * ShopKart - Cart Module
 * Shopping cart functionality
 */

// Cart class
class Cart {
    constructor() {
        this.items = CartStorage.getCart();
        this.coupon = CouponStorage.getCoupon();
        this.deliveryCharge = 0;
        this.discount = 0;
        this.init();
    }

    // Initialize cart
    init() {
        this.calculateTotals();
    }

    // Get all cart items
    getItems() {
        return this.items;
    }

    // Add item to cart
    addItem(product, quantity = 1) {
        // Validate quantity
        if (!validateQuantity(quantity)) {
            return { success: false, error: 'Invalid quantity' };
        }

        // Check if item already exists
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            // Update quantity
            const newQuantity = existingItem.quantity + quantity;
            if (!validateQuantity(newQuantity)) {
                return { success: false, error: 'Maximum quantity exceeded' };
            }
            existingItem.quantity = newQuantity;
        } else {
            // Add new item
            this.items.push({
                id: product.id,
                product: product,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        this.calculateTotals();
        
        return { 
            success: true, 
            item: this.items.find(item => item.id === product.id),
            count: this.getItemCount()
        };
    }

    // Update item quantity
    updateItemQuantity(productId, quantity) {
        // Validate quantity
        if (!validateQuantity(quantity)) {
            return { success: false, error: 'Invalid quantity' };
        }

        const item = this.items.find(item => item.id === productId);
        
        if (!item) {
            return { success: false, error: 'Item not found in cart' };
        }

        if (quantity <= 0) {
            return this.removeItem(productId);
        }

        item.quantity = quantity;
        this.saveCart();
        this.calculateTotals();

        return { success: true, item };
    }

    // Remove item from cart
    removeItem(productId) {
        const index = this.items.findIndex(item => item.id === productId);
        
        if (index === -1) {
            return { success: false, error: 'Item not found in cart' };
        }

        this.items.splice(index, 1);
        this.saveCart();
        this.calculateTotals();

        return { success: true, count: this.getItemCount() };
    }

    // Clear cart
    clearCart() {
        this.items = [];
        this.coupon = null;
        this.discount = 0;
        this.saveCart();
        CouponStorage.clearCoupon();
        this.calculateTotals();

        return { success: true };
    }

    // Save cart to storage
    saveCart() {
        CartStorage.saveCart(this.items);
    }

    // Get cart item count
    getItemCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    }

    // Get cart subtotal
    getSubtotal() {
        return this.items.reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.getSubtotal();
        
        // Calculate delivery charge (free for orders over $100)
        this.deliveryCharge = subtotal >= 100 ? 0 : 10;
        
        // Calculate discount if coupon is applied
        if (this.coupon) {
            this.discount = this.calculateCouponDiscount(subtotal);
        } else {
            this.discount = 0;
        }

        const total = subtotal + this.deliveryCharge - this.discount;

        return {
            subtotal,
            deliveryCharge: this.deliveryCharge,
            discount: this.discount,
            total
        };
    }

    // Get totals
    getTotals() {
        return this.calculateTotals();
    }

    // Apply coupon
    applyCoupon(couponCode) {
        // Validate coupon format
        if (!validateCoupon(couponCode)) {
            return { success: false, error: 'Invalid coupon code format' };
        }

        // Check if coupon is valid (simulated)
        const validCoupons = {
            'SAVE10': { type: 'percent', value: 10 },
            'SAVE20': { type: 'percent', value: 20 },
            'FLAT50': { type: 'flat', value: 50 },
            'WELCOME': { type: 'percent', value: 15 }
        };

        const coupon = validCoupons[couponCode.toUpperCase()];
        
        if (!coupon) {
            return { success: false, error: 'Invalid coupon code' };
        }

        this.coupon = {
            code: couponCode.toUpperCase(),
            ...coupon
        };

        CouponStorage.saveCoupon(this.coupon);
        this.calculateTotals();

        return { success: true, coupon: this.coupon };
    }

    // Remove coupon
    removeCoupon() {
        this.coupon = null;
        this.discount = 0;
        CouponStorage.clearCoupon();
        this.calculateTotals();

        return { success: true };
    }

    // Calculate coupon discount
    calculateCouponDiscount(subtotal) {
        if (!this.coupon) return 0;

        if (this.coupon.type === 'percent') {
            return subtotal * (this.coupon.value / 100);
        } else if (this.coupon.type === 'flat') {
            return Math.min(this.coupon.value, subtotal);
        }

        return 0;
    }

    // Check if cart is empty
    isEmpty() {
        return this.items.length === 0;
    }

    // Check if product is in cart
    hasItem(productId) {
        return this.items.some(item => item.id === productId);
    }

    // Get item by product ID
    getItem(productId) {
        return this.items.find(item => item.id === productId);
    }

    // Move to checkout
    moveToCheckout() {
        if (this.isEmpty()) {
            return { success: false, error: 'Cart is empty' };
        }

        return { success: true, items: this.items, totals: this.getTotals() };
    }
}

// Create cart instance
const cart = new Cart();

// Make cart globally available for browser environment
if (typeof window !== 'undefined') {
    window.cart = cart;
}

// Export cart module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Cart,
        cart
    };
}
