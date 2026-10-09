# ShopKart - Mini E-Commerce Platform

A production-quality, fully functional e-commerce platform built with vanilla HTML, CSS, and JavaScript. ShopKart demonstrates modern frontend development practices without relying on any frameworks or libraries.

![ShopKart](https://img.shields.io/badge/version-1.0.0-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

## 🌟 Features

### Core Functionality
- **Product Catalog**: Browse products from FakeStoreAPI with categories, search, and filters
- **Product Details**: Detailed product pages with images, descriptions, ratings, and related products
- **Shopping Cart**: Full cart functionality with quantity management, coupons, and persistent storage
- **Wishlist**: Save favorite items for later with easy move-to-cart functionality
- **User Authentication**: Complete signup/login system with form validation
- **Checkout Process**: Secure checkout with billing, shipping, and payment options
- **Order Management**: Order history with status tracking

### Advanced Features
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Responsive Design**: Fully responsive layout for desktop, tablet, and mobile
- **Search & Filters**: Advanced product search with category, price, and sorting options
- **Pagination**: Efficient product pagination for large catalogs
- **Coupon System**: Apply discount codes at checkout
- **Recently Viewed**: Track and display recently viewed products
- **Toast Notifications**: Real-time feedback for user actions
- **Loading States**: Skeleton loaders and spinners for better UX
- **Form Validation**: Comprehensive client-side validation with error handling
- **Local Storage**: Persistent cart, wishlist, user data, and theme preferences

## 📁 Project Structure

```
shopkart/
│
├── index.html                  # Home page
├── products.html               # Products listing page
├── product-details.html        # Product details page
├── cart.html                   # Shopping cart page
├── wishlist.html               # Wishlist page
├── checkout.html               # Checkout page
├── login.html                  # Login page
├── signup.html                 # Signup page
│
├── css/
│   ├── style.css               # Main styles and CSS variables
│   ├── components.css          # Component-specific styles
│   └── responsive.css          # Responsive design and media queries
│
├── js/
│   ├── app.js                  # Main application logic
│   ├── api.js                  # API integration with FakeStoreAPI
│   ├── auth.js                 # Authentication module
│   ├── cart.js                 # Shopping cart module
│   ├── checkout.js             # Checkout and order management
│   ├── products.js             # Product display and management
│   ├── storage.js              # LocalStorage management
│   ├── ui.js                   # UI components and interactions
│   ├── utils.js                # Utility functions
│   └── validation.js           # Form validation
│
├── assets/
│   ├── images/                 # Static images
│   └── icons/                  # Static icons
│
└── README.md                   # Project documentation
```

## 🛠 Technologies Used

- **HTML5**: Semantic markup and modern HTML features
- **CSS3**: Modern CSS with variables, flexbox, grid, and animations
- **Vanilla JavaScript (ES6+)**: Modern JavaScript features including:
  - Arrow functions
  - Template literals
  - Destructuring
  - Spread/Rest operators
  - Async/Await
  - Promises
  - Classes
  - Modules
  - Fetch API
- **LocalStorage**: Client-side data persistence
- **FakeStoreAPI**: Product data source

## 🚀 Installation

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for development)

### Setup Instructions

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd shopkart
   ```

2. **Open the project**
   - Simply open `index.html` in your web browser
   - Or use a local web server for development:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js (http-server)
     npx http-server
     
     # Using PHP
     php -S localhost:8000
     ```

3. **Access the application**
   - Navigate to `http://localhost:8000` (or whichever port your server uses)

## 📖 Usage Guide

### Navigation
- **Home**: Featured products, categories, and latest arrivals
- **Products**: Full product catalog with filters and search
- **Cart**: View and manage shopping cart items
- **Wishlist**: Save and manage favorite products
- **Login/Signup**: User authentication for checkout

### Product Features
- **Browse Products**: View all products or filter by category
- **Search**: Use the search bar to find specific products
- **Filter Options**:
  - Category: Electronics, Jewelry, Men's Clothing, Women's Clothing
  - Price Range: Under $50, $50-$100, $100-$200, $200+
  - Sort By: Price (low/high), Rating, Newest
- **Product Details**: Click on any product to view full details
- **Add to Cart**: Add products with quantity selection
- **Wishlist**: Save items by clicking the heart icon

### Shopping Cart
- **View Cart**: See all items in your cart
- **Update Quantity**: Increase or decrease item quantities
- **Remove Items**: Remove individual items or clear entire cart
- **Apply Coupons**: Enter coupon codes for discounts
  - Available coupons: `SAVE10`, `SAVE20`, `FLAT50`, `WELCOME`
- **Checkout**: Proceed to checkout when ready

### Checkout Process
1. **Login**: You must be logged in to checkout
2. **Billing Information**: Enter your contact details
3. **Shipping Address**: Provide delivery address
4. **Payment Method**: Choose from:
   - Cash on Delivery
   - Credit/Debit Card
   - UPI
5. **Review**: Check order summary
6. **Place Order**: Complete your purchase

### User Account
- **Signup**: Create an account with email validation
- **Login**: Access your account with optional "Remember Me"
- **Profile**: View and manage your account details
- **Order History**: Track your past orders

### Coupon Codes
- `SAVE10` - 10% discount
- `SAVE20` - 20% discount
- `FLAT50` - $50 flat discount
- `WELCOME` - 15% discount for new users

## 🎨 Design Features

### UI/UX
- **Modern Design**: Clean, professional interface inspired by Amazon and Flipkart
- **Responsive Layout**: Optimized for all screen sizes
- **Smooth Animations**: Hover effects, transitions, and micro-interactions
- **Dark Mode**: Eye-friendly dark theme option
- **Loading States**: Skeleton loaders and spinners
- **Empty States**: Friendly messages when no data is available
- **Error Handling**: Graceful error messages and recovery options

### Accessibility
- Semantic HTML markup
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast in both light and dark modes
- Focus indicators for interactive elements

## 🔧 Configuration

### API Configuration
API settings can be modified in `js/api.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'https://fakestoreapi.com',
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    USE_DUMMY_DATA: true // Set to true to use dummy data, false to use FakeStoreAPI
};
```

### Using Dummy Data vs Real API
The application includes comprehensive dummy data for development and demo purposes:

**To use dummy data (default):**
- Set `USE_DUMMY_DATA: true` in `js/api.js`
- 20 sample products across 4 categories
- High-quality Unsplash images
- Full offline functionality
- No API dependencies

**To use FakeStoreAPI:**
- Set `USE_DUMMY_DATA: false` in `js/api.js`
- Real-time data from FakeStoreAPI
- 20 products from the actual API
- Requires internet connection

**Fallback behavior:**
- If the API fails, the app automatically falls back to dummy data
- Ensures the application always works, even without internet

### Storage Keys
LocalStorage keys are defined in `js/storage.js`:
```javascript
const STORAGE_KEYS = {
    CART: 'shopkart_cart',
    WISHLIST: 'shopkart_wishlist',
    USER: 'shopkart_user',
    ORDERS: 'shopkart_orders',
    THEME: 'shopkart_theme'
};
```

### Theme Colors
CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #ff6b35;
    --secondary-color: #2c3e50;
    --success-color: #27ae60;
    --danger-color: #e74c3c;
    /* ... more variables */
}
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Product browsing and filtering
- [ ] Search functionality
- [ ] Add to cart with quantity updates
- [ ] Wishlist add/remove functionality
- [ ] Move items from wishlist to cart
- [ ] Coupon code application
- [ ] User signup and login
- [ ] Checkout process
- [ ] Order placement
- [ ] Dark mode toggle
- [ ] Responsive design on different devices
- [ ] Form validation
- [ ] Error handling

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Code Quality

### JavaScript Features Used
- **ES6+ Syntax**: Arrow functions, template literals, destructuring
- **Async/Await**: For API calls and asynchronous operations
- **Classes**: For modular, object-oriented code
- **Modules**: Separated concerns across multiple files
- **Error Handling**: Try-catch blocks and custom error classes
- **Validation**: Comprehensive form validation
- **Debouncing/Throttling**: Performance optimization
- **Event Delegation**: Efficient event handling

### Best Practices
- Clean, readable code with meaningful variable names
- Separation of concerns (UI, business logic, data)
- Reusable utility functions
- Consistent code style
- Comprehensive comments
- No code duplication
- Proper error handling

## 🚧 Future Improvements

### Planned Features
- [ ] Product reviews and ratings
- [ ] Product comparison
- [ ] Advanced search with autocomplete
- [ ] Multiple payment gateway integration
- [ ] Order tracking with real-time updates
- [ ] Email notifications
- [ ] Social media sharing
- [ ] Product recommendations
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Admin panel for product management

### Technical Improvements
- [ ] Service Worker for offline support
- [ ] Web Workers for heavy computations
- [ ] Image optimization and lazy loading
- [ ] Code splitting for better performance
- [ ] SEO optimization
- [ ] PWA capabilities
- [ ] Unit and integration tests
- [ ] CI/CD pipeline

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

## 📄 License

This project is open source and available for educational purposes.

## 👨‍💻 Author

Created as a demonstration of modern vanilla JavaScript development practices.

## 🙏 Acknowledgments

- **FakeStoreAPI** for providing the product data
- **Amazon & Flipkart** for design inspiration
- **MDN Web Docs** for excellent JavaScript documentation

## 📞 Support

For questions, issues, or suggestions:
- Open an issue on GitHub
- Contact: support@shopkart.com (demo)

## 🎯 Learning Outcomes

This project demonstrates:
- Modern JavaScript without frameworks
- API integration and data fetching
- State management with LocalStorage
- Form validation and error handling
- Responsive web design
- CSS custom properties and modern layouts
- Event delegation and DOM manipulation
- Modular code architecture
- Performance optimization techniques

Perfect for:
- Portfolio projects
- Learning vanilla JavaScript
- Understanding e-commerce workflows
- Frontend development practice

---

**Built with ❤️ using vanilla HTML, CSS, and JavaScript**
