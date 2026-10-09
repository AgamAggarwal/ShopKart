
import { StorageService } from './storage.js';
import { ProductService } from './products.js';

export const CartService = {
    getCart() {
        const cart = StorageService.get('cart');

        if (!Array.isArray(cart)) {
            return [];
        }

        return cart
            .filter(item => item && typeof item === 'object')
            .map(item => ({
                id: Number(item.id),
                qty: Number(item.qty)
            }))
            .filter(item =>
                Number.isFinite(item.id) &&
                Number.isFinite(item.qty) &&
                item.qty > 0 &&
                ProductService.getById(item.id)
            );
    },

    saveCart(cart) {
        // Save an empty array when no items are present
        StorageService.set('cart', cart);

        // Update badge immediately
        this.updateBadge();
    },

    add(productId, qty = 1) {
        const cart = this.getCart();
        const numericId = Number(productId);
        const numericQty = Number(qty);

        if (
            !Number.isFinite(numericId) ||
            !Number.isFinite(numericQty) ||
            numericQty <= 0
        ) {
            return;
        }

        const existing = cart.find(
            item => item.id === numericId
        );

        if (existing) {
            existing.qty += numericQty;
        } else {
            cart.push({
                id: numericId,
                qty: numericQty
            });
        }

        this.saveCart(cart);
        alert('Product added to cart!');
    },

    remove(productId) {
        const numericId = Number(productId);

        const cart = this.getCart().filter(
            item => item.id !== numericId
        );

        this.saveCart(cart);

        if (
            window.router &&
            typeof window.router.renderCurrentView === 'function'
        ) {
            window.router.renderCurrentView();
        }
    },

    updateQty(productId, delta) {
        const cart = this.getCart();
        const numericId = Number(productId);

        const item = cart.find(
            item => item.id === numericId
        );

        if (item) {
            item.qty += Number(delta) || 0;

            if (item.qty <= 0) {
                this.remove(numericId);
                return;
            }
        }

        this.saveCart(cart);

        if (
            window.router &&
            typeof window.router.renderCurrentView === 'function'
        ) {
            window.router.renderCurrentView();
        }
    },

    getTotalAmount() {
        const cart = this.getCart();

        return cart.reduce((sum, item) => {
            const product = ProductService.getById(item.id);

            const price =
                product && !isNaN(product.price)
                    ? Number(product.price)
                    : 0;

            return sum + price * item.qty;
        }, 0);
    },

    updateBadge() {
        const cart = this.getCart();

        const count = cart.reduce(
            (sum, item) => sum + item.qty,
            0
        );

        const badgeEl = document.getElementById('cartBadge');

        if (badgeEl) {
            badgeEl.innerText = count;
        }
    }
};

// Initialize the cart badge when this module loads
if (typeof document !== 'undefined') {
    const initializeBadge = () => CartService.updateBadge();

    if (document.readyState === 'loading') {
        document.addEventListener(
            'DOMContentLoaded',
            initializeBadge
        );
    } else {
        initializeBadge();
    }
}
