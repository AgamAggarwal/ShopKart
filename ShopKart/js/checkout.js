/**
 * ShopKart - Checkout Module
 * Checkout and order management
 */

// Checkout class
class Checkout {
    constructor() {
        this.order = null;
        this.init();
    }

    // Initialize checkout
    init() {
        // Any initialization logic
    }

    // Validate checkout data
    validateCheckoutData(checkoutData) {
        const validator = new Validator();

        // Add validation rules
        validator.addRule('firstName', 'required');
        validator.addRule('firstName', { rule: 'minLength', options: { min: 2 } });
        validator.addRule('lastName', 'required');
        validator.addRule('lastName', { rule: 'minLength', options: { min: 2 } });
        validator.addRule('email', 'required');
        validator.addRule('email', 'email');
        validator.addRule('phone', 'required');
        validator.addRule('phone', 'phone');
        validator.addRule('address', 'required');
        validator.addRule('address', { rule: 'minLength', options: { min: 10 } });
        validator.addRule('city', 'required');
        validator.addRule('state', 'required');
        validator.addRule('zipCode', 'required');
        validator.addRule('zipCode', 'zipCode');
        validator.addRule('country', 'required');

        const isValid = validator.validateAll(checkoutData);
        const errors = validator.getErrors();

        return { isValid, errors };
    }

    // Process checkout
    async processCheckout(checkoutData) {
        try {
            // Check if user is authenticated
            if (!auth.isAuthenticated()) {
                return { success: false, error: 'User must be logged in to checkout' };
            }

            // Check if cart is empty
            if (cart.isEmpty()) {
                return { success: false, error: 'Cart is empty' };
            }

            // Validate checkout data
            const validation = this.validateCheckoutData(checkoutData);
            if (!validation.isValid) {
                return { success: false, error: 'Invalid checkout data', errors: validation.errors };
            }

            // Get cart items and totals
            const cartItems = cart.getItems();
            const totals = cart.getTotals();

            // Generate order ID
            const orderId = this.generateOrderId();

            // Create order object
            const order = {
                id: orderId,
                userId: auth.getCurrentUser().id,
                items: cartItems.map(item => ({
                    productId: item.id,
                    title: item.product.title,
                    price: item.product.price,
                    quantity: item.quantity,
                    image: item.product.image
                })),
                billing: {
                    firstName: checkoutData.firstName,
                    lastName: checkoutData.lastName,
                    email: checkoutData.email,
                    phone: checkoutData.phone
                },
                shipping: {
                    address: checkoutData.address,
                    city: checkoutData.city,
                    state: checkoutData.state,
                    zipCode: checkoutData.zipCode,
                    country: checkoutData.country
                },
                payment: {
                    method: checkoutData.paymentMethod || 'cod'
                },
                totals: {
                    subtotal: totals.subtotal,
                    deliveryCharge: totals.deliveryCharge,
                    discount: totals.discount,
                    total: totals.total
                },
                coupon: cart.coupon,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            // Save order
            OrdersStorage.addOrder(order);
            this.order = order;

            // Clear cart
            cart.clearCart();

            return { success: true, order };
        } catch (error) {
            console.error('Checkout error:', error);
            return { success: false, error: error.message };
        }
    }

    // Generate order ID
    generateOrderId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `SK${timestamp}${random}`;
    }

    // Get order by ID
    getOrder(orderId) {
        return OrdersStorage.getOrderById(orderId);
    }

    // Get all orders for current user
    getUserOrders() {
        if (!auth.isAuthenticated()) {
            return [];
        }

        const allOrders = OrdersStorage.getOrders();
        const userId = auth.getCurrentUser().id;

        return allOrders.filter(order => order.userId === userId);
    }

    // Update order status
    updateOrderStatus(orderId, status) {
        const orders = OrdersStorage.getOrders();
        const orderIndex = orders.findIndex(order => order.id === orderId);

        if (orderIndex === -1) {
            return { success: false, error: 'Order not found' };
        }

        orders[orderIndex].status = status;
        orders[orderIndex].updatedAt = new Date().toISOString();
        OrdersStorage.saveOrders(orders);

        return { success: true, order: orders[orderIndex] };
    }

    // Cancel order
    cancelOrder(orderId) {
        return this.updateOrderStatus(orderId, 'cancelled');
    }

    // Format order status
    formatStatus(status) {
        const statusMap = {
            'pending': 'Pending',
            'processing': 'Processing',
            'shipped': 'Shipped',
            'delivered': 'Delivered',
            'cancelled': 'Cancelled'
        };

        return statusMap[status] || status;
    }

    // Get status color class
    getStatusColor(status) {
        const colorMap = {
            'pending': 'warning',
            'processing': 'info',
            'shipped': 'primary',
            'delivered': 'success',
            'cancelled': 'danger'
        };

        return colorMap[status] || 'secondary';
    }

    // Render order summary HTML
    renderOrderSummary(order) {
        return `
            <div class="order-summary-card">
                <div class="order-header">
                    <div class="order-id">Order #${order.id}</div>
                    <div class="order-status status-${this.getStatusColor(order.status)}">
                        ${this.formatStatus(order.status)}
                    </div>
                </div>
                <div class="order-date">
                    Placed on ${formatDate(order.createdAt)}
                </div>
                <div class="order-items">
                    ${order.items.map(item => `
                        <div class="order-item">
                            <img src="${item.image}" alt="${item.title}" class="order-item-image">
                            <div class="order-item-details">
                                <div class="order-item-title">${item.title}</div>
                                <div class="order-item-quantity">Qty: ${item.quantity}</div>
                            </div>
                            <div class="order-item-price">${formatCurrency(item.price * item.quantity)}</div>
                        </div>
                    `).join('')}
                </div>
                <div class="order-totals">
                    <div class="order-total-row">
                        <span>Subtotal</span>
                        <span>${formatCurrency(order.totals.subtotal)}</span>
                    </div>
                    <div class="order-total-row">
                        <span>Delivery</span>
                        <span>${formatCurrency(order.totals.deliveryCharge)}</span>
                    </div>
                    ${order.totals.discount > 0 ? `
                        <div class="order-total-row discount">
                            <span>Discount</span>
                            <span>-${formatCurrency(order.totals.discount)}</span>
                        </div>
                    ` : ''}
                    <div class="order-total-row total">
                        <span>Total</span>
                        <span>${formatCurrency(order.totals.total)}</span>
                    </div>
                </div>
                <div class="order-shipping">
                    <h4>Shipping Address</h4>
                    <p>
                        ${order.shipping.address}<br>
                        ${order.shipping.city}, ${order.shipping.state} ${order.shipping.zipCode}<br>
                        ${order.shipping.country}
                    </p>
                </div>
                <div class="order-payment">
                    <h4>Payment Method</h4>
                    <p>${order.payment.method.toUpperCase()}</p>
                </div>
            </div>
        `;
    }
}

// Create checkout instance
const checkout = new Checkout();

// Make checkout globally available for browser environment
if (typeof window !== 'undefined') {
    window.checkout = checkout;
}

// Export checkout module
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        Checkout,
        checkout
    };
}
