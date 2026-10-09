export const PRODUCTS_DATA = [
    { id: 1, title: 'Wireless Noise-Canceling Headphones', price: 199.99, category: 'Electronics', rating: 4.8, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', featured: true, trending: true, desc: 'Experience crystal clear audio with active noise cancellation and 30-hour battery life.' },
    { id: 2, title: 'Smart Fitness Activity Tracker', price: 79.99, category: 'Electronics', rating: 4.5, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', featured: true, trending: false, desc: 'Monitor your heart rate, steps, sleep quality, and workouts with this sleek smartwatch.' },
    { id: 3, title: 'Minimalist Casual Backpack', price: 49.99, category: 'Fashion', rating: 4.6, image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', featured: false, trending: true, desc: 'Durable, water-resistant daily backpack with a dedicated 15-inch laptop sleeve.' },
    { id: 4, title: 'Ergonomic Mechanical Keyboard', price: 129.99, category: 'Electronics', rating: 4.9, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400', featured: true, trending: true, desc: 'RGB backlit mechanical keyboard with tactile switches for high-performance typing.' },
    { id: 5, title: 'Classic Leather Watch', price: 149.99, category: 'Fashion', rating: 4.4, image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400', featured: false, trending: true, desc: 'Timeless design featuring genuine leather strap and scratch-resistant sapphire crystal.' },
    { id: 6, title: 'Ceramic Pour-Over Coffee Maker', price: 34.99, category: 'Home', rating: 4.7, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400', featured: false, trending: false, desc: 'Brew barista-quality pour-over coffee right at home with thermal ceramic design.' },
    { id: 7, title: 'Portable Bluetooth Speaker', price: 89.99, category: 'Electronics', rating: 4.3, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400', featured: true, trending: false, desc: 'Deep bass and robust waterproof build make this speaker ideal for outdoor adventures.' },
    { id: 8, title: 'Modern Ceramic Planter Set', price: 29.99, category: 'Home', rating: 4.6, image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400', featured: false, trending: true, desc: 'Set of 3 geometric ceramic plant pots with bamboo drainage trays.' }
];

export const CATEGORIES_DATA = [
    { name: 'Electronics', icon: 'fa-laptop', count: 4 },
    { name: 'Fashion', icon: 'fa-shirt', count: 2 },
    { name: 'Home', icon: 'fa-house', count: 2 }
];

export const ProductService = {
    getAll() { return PRODUCTS_DATA; },
    getById(id) { return PRODUCTS_DATA.find(p => p.id === Number(id)); },
    getCategories() { return CATEGORIES_DATA; },

    renderProductCard(product, isInWishlist) {
        return `
            <div class="product-card">
                <div class="product-img-wrapper" onclick="window.router.navigate('product-details', ${product.id})">
                    <img src="${product.image}" alt="${product.title}">
                    <button class="wishlist-btn ${isInWishlist ? 'active' : ''}" onclick="event.stopPropagation(); window.wishlistModule.toggle(${product.id})">
                        <i class="fa-${isInWishlist ? 'solid' : 'regular'} fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <div class="product-rating">
                        ${'★'.repeat(Math.floor(product.rating))} (${product.rating})
                    </div>
                    <h4 class="product-title" onclick="window.router.navigate('product-details', ${product.id})">${product.title}</h4>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-actions">
                        <button class="btn-secondary" onclick="window.productModule.openQuickView(${product.id})">Quick View</button>
                        <button class="btn-add-cart" onclick="window.cartModule.add(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    },

    openQuickView(id) {
        const product = this.getById(id);
        if (!product) return;
        const modal = document.getElementById('quickViewModal');
        const content = document.getElementById('quickViewContent');
        content.innerHTML = `
            <span class="close-modal" onclick="document.getElementById('quickViewModal').classList.remove('active')">&times;</span>
            <div style="display:flex; gap:1.5rem; align-items:center;">
                <img src="${product.image}" style="width:200px; height:200px; object-fit:contain;">
                <div>
                    <h2>${product.title}</h2>
                    <h3 style="color:var(--primary); margin:0.5rem 0;">$${product.price.toFixed(2)}</h3>
                    <p style="color:var(--text-light); margin-bottom:1rem;">${product.desc}</p>
                    <button class="btn-primary" onclick="window.cartModule.add(${product.id}); document.getElementById('quickViewModal').classList.remove('active');">Add to Cart</button>
                </div>
            </div>
        `;
        modal.classList.add('active');
    }
};