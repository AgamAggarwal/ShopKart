import { AuthService } from './auth.js';
import { ProductService } from './products.js';
import { CartService } from './cart.js';
import { WishlistService } from './wishlist.js';
import { CheckoutService } from './checkout.js';

class Router {
    constructor() {
        this.currentView = 'home';
        this.currentParam = null;
        
        // Expose modules globally for inline HTML event handlers
        window.router = this;
        window.authModule = AuthService;
        window.cartModule = CartService;
        window.wishlistModule = WishlistService;
        window.productModule = ProductService;
    }

    init() {
        AuthService.updateAuthNav();
        CartService.updateBadge();
        WishlistService.updateBadge();
        this.setupEventListeners();
        this.navigate('home');
    }

    navigate(viewName, param = null) {
        this.currentView = viewName;
        this.currentParam = param;
        
        // Hide all views
        document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
        
        // Show target view
        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.add('active');
        
        window.scrollTo(0, 0);
        this.renderCurrentView();
    }

    renderCurrentView() {
        switch (this.currentView) {
            case 'home':
                this.renderHome();
                break;
            case 'products':
                this.renderCatalog();
                break;
            case 'product-details':
                this.renderProductDetails(this.currentParam);
                break;
            case 'cart':
                this.renderCart();
                break;
            case 'wishlist':
                this.renderWishlist();
                break;
            case 'checkout':
                CheckoutService.renderSummary();
                break;
        }
    }

    renderHome() {
        // Categories
        const catContainer = document.getElementById('homeCategories');
        catContainer.innerHTML = ProductService.getCategories().map(cat => `
            <div class="category-card" onclick="window.router.navigate('products')">
                <i class="fa-solid ${cat.icon}"></i>
                <h3>${cat.name}</h3>
                <p style="color:var(--text-light); font-size:0.85rem; margin-top:0.3rem;">${cat.count} Items</p>
            </div>
        `).join('');

        // Featured
        const featuredContainer = document.getElementById('homeFeatured');
        const featured = ProductService.getAll().filter(p => p.featured);
        featuredContainer.innerHTML = featured.map(p => ProductService.renderProductCard(p, WishlistService.has(p.id))).join('');

        // Trending
        const trendingContainer = document.getElementById('homeTrending');
        const trending = ProductService.getAll().filter(p => p.trending);
        trendingContainer.innerHTML = trending.map(p => ProductService.renderProductCard(p, WishlistService.has(p.id))).join('');
    }

    renderCatalog() {
        const grid = document.getElementById('catalogProducts');
        const products = ProductService.getAll();
        
        // Populate category dropdown filter if empty
        const catSelect = document.getElementById('filterCategory');
        if (catSelect.options.length <= 1) {
            ProductService.getCategories().forEach(c => {
                catSelect.innerHTML += `<option value="${c.name}">${c.name}</option>`;
            });
        }

        const selectedCat = catSelect.value;
        const maxPrice = Number(document.getElementById('filterPrice').value);
        document.getElementById('priceVal').innerText = maxPrice;
        const sortBy = document.getElementById('filterSort').value;

        let filtered = products.filter(p => {
            const matchesCat = selectedCat === 'all' || p.category === selectedCat;
            const matchesPrice = p.price <= maxPrice;
            return matchesCat && matchesPrice;
        });

        if (sortBy === 'low-high') filtered.sort((a,b) => a.price - b.price);
        if (sortBy === 'high-low') filtered.sort((a,b) => b.price - a.price);
        if (sortBy === 'rating') filtered.sort((a,b) => b.rating - a.rating);

        grid.innerHTML = filtered.length > 0 ? 
            filtered.map(p => ProductService.renderProductCard(p, WishlistService.has(p.id))).join('') :
            `<p style="grid-column: 1/-1; text-align:center; color:var(--text-light);">No products found matching criteria.</p>`;
    }

    renderProductDetails(id) {
        const product = ProductService.getById(id);
        const container = document.getElementById('productDetailsContainer');
        if (!product) {
            container.innerHTML = `<p>Product not found.</p>`;
            return;
        }
        const inWishlist = WishlistService.has(product.id);
        container.innerHTML = `
            <button class="btn-secondary" onclick="window.router.navigate('products')" style="margin-bottom:1rem; width:fit-content;"><i class="fa-solid fa-arrow-left"></i> Back to Products</button>
            <div class="details-grid">
                <div class="details-img-container">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <div class="details-content">
                    <span style="color:var(--text-light); font-weight:600; text-transform:uppercase; font-size:0.8rem;">${product.category}</span>
                    <h1>${product.title}</h1>
                    <div class="product-rating">${'★'.repeat(Math.floor(product.rating))} (${product.rating} Rating)</div>
                    <div class="details-price">$${product.price.toFixed(2)}</div>
                    <p class="details-desc">${product.desc}</p>
                    <div style="display:flex; gap:1rem;">
                        <button class="btn-primary" onclick="window.cartModule.add(${product.id})"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
                        <button class="btn-secondary" onclick="window.wishlistModule.toggle(${product.id}); window.router.renderCurrentView();">
                            <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i> ${inWishlist ? 'In Wishlist' : 'Add to Wishlist'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderCart() {
        const container = document.getElementById('cartContent');
        const cart = CartService.getCart();

        if (cart.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align:center; padding:3rem; background:var(--white); border-radius:12px;">
                    <h3>Your cart is empty</h3>
                    <p style="color:var(--text-light); margin:1rem 0;">Explore our products and start shopping!</p>
                    <button class="btn-primary" onclick="window.router.navigate('products')">Shop Now</button>
                </div>
            `;
            return;
        }

        const subtotal = CartService.getTotalAmount();
        const shipping = 10.00;
        const total = subtotal + shipping;

        let itemsHtml = cart.map(item => {
            const product = ProductService.getById(item.id);
            if (!product) return '';
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.title}">
                    <div class="cart-item-details">
                        <div class="cart-item-title">${product.title}</div>
                        <div class="cart-item-price">$${product.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-controls">
                        <button class="qty-btn" onclick="window.cartModule.updateQty(${product.id}, -1)">-</button>
                        <span>${item.qty}</span>
                        <button class="qty-btn" onclick="window.cartModule.updateQty(${product.id}, 1)">+</button>
                    </div>
                    <button class="remove-cart-item" onclick="window.cartModule.remove(${product.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            `;
        }).join('');

        container.innerHTML = `
            <div class="cart-items-list">${itemsHtml}</div>
            <div class="cart-summary-card">
                <h3>Order Summary</h3>
                <div class="summary-row" style="margin-top:1rem;"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
                <div class="summary-row"><span>Shipping</span><span>$${shipping.toFixed(2)}</span></div>
                <div class="summary-row total"><span>Total</span><span>$${total.toFixed(2)}</span></div>
                <button class="btn-primary full-width" onclick="window.router.navigate('checkout')">Proceed to Checkout</button>
            </div>
        `;
    }

    renderWishlist() {
        const grid = document.getElementById('wishlistGrid');
        const list = WishlistService.getWishlist();
        const products = list.map(id => ProductService.getById(id)).filter(Boolean);

        if (products.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-light);">Your wishlist is empty.</p>`;
            return;
        }

        grid.innerHTML = products.map(p => ProductService.renderProductCard(p, true)).join('');
    }

    setupEventListeners() {
        // Global Search
        const searchInput = document.getElementById('globalSearchInput');
        const searchBtn = document.getElementById('globalSearchBtn');
        const executeSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            if (query) {
                this.navigate('products');
                // Optional quick filter integration can go here
            }
        };
        searchBtn.addEventListener('click', executeSearch);
        searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') executeSearch(); });

        // Catalog filter live updates
        document.getElementById('filterCategory').addEventListener('change', () => this.renderCatalog());
        document.getElementById('filterPrice').addEventListener('input', () => this.renderCatalog());
        document.getElementById('filterSort').addEventListener('change', () => this.renderCatalog());

        // Auth Forms
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const pass = document.getElementById('loginPassword').value;
            if (AuthService.login(email, pass)) {
                this.navigate('home');
            }
        });

        document.getElementById('signupForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const pass = document.getElementById('signupPassword').value;
            if (AuthService.signup(name, email, pass)) {
                alert('Account created successfully!');
                this.navigate('home');
            }
        });

        // Checkout Form
        document.getElementById('checkoutForm').addEventListener('submit', (e) => CheckoutService.processOrder(e));
    }
}

// Initialize application on load
window.addEventListener('DOMContentLoaded', () => {
    const router = new Router();
    router.init();
});