import { StorageService } from './storage.js';

export const WishlistService = {
    getWishlist() {
        return StorageService.get('wishlist') || [];
    },

    saveWishlist(list) {
        StorageService.set('wishlist', list);
        this.updateBadge();
    },

    has(productId) {
        return this.getWishlist().includes(productId);
    },

    toggle(productId) {
        let list = this.getWishlist();
        if (list.includes(productId)) {
            list = list.filter(id => id !== productId);
        } else {
            list.push(productId);
        }
        this.saveWishlist(list);
        window.router.renderCurrentView();
    },

    updateBadge() {
        const list = this.getWishlist();
        document.getElementById('wishlistBadge').innerText = list.length;
    }
};