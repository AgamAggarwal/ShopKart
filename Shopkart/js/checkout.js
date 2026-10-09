import { CartService } from './cart.js';

export const CheckoutService = {
    renderSummary() {
        const container = document.getElementById('checkoutSummary');
        const cart = CartService.getCart();
        const subtotal = CartService.getTotalAmount();
        const shipping = subtotal > 0 ? 10.00 : 0;
        const total = subtotal + shipping;

        container.innerHTML = `
            <h3>Order Summary</h3>
            <div class="summary-row" style="margin-top:1rem;"><span>Items (${cart.reduce((s,i)=>s+i.qty,0)})</span><span>$${subtotal.toFixed(2)}</span></div>
            <div class="summary-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
            <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
            <button type="submit" class="btn-primary full-width" style="margin-top:1.5rem;">Place Order</button>
        `;
    },

    processOrder(e) {
        e.preventDefault();
        const cart = CartService.getCart();
        if (cart.length === 0) {
            alert('Your cart is empty.');
            return;
        }
        alert('Order placed successfully! Thank you for shopping with ShopKart.');
        localStorage.removeItem('shopkart_cart');
        CartService.updateBadge();
        window.router.navigate('home');
    }
};