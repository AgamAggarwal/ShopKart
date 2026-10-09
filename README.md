# 🛍️ ShopKart – E-Commerce Web Application

ShopKart is a user-friendly e-commerce web application designed to provide a smooth online shopping experience. It allows users to explore products, view product details, manage their shopping cart, maintain a wishlist, and proceed to checkout through an interactive interface.

🔗 **Live Demo:** https://majestic-toffee-ae137d.netlify.app/

## ✨ Features

- **Home Page:** Displays product categories, featured products, and trending products.
- **Product Catalog:** Browse products with category filters, price filtering, and sorting options.
- **Product Details:** View product images, descriptions, prices, and ratings.
- **Shopping Cart:** Add products, remove items, and increase or decrease product quantities.
- **Dynamic Cart Badge:** Automatically updates the total item count and displays `0` when the cart is empty.
- **Wishlist Management:** Add products to or remove products from the wishlist.
- **User Authentication:** Includes login and signup interfaces.
- **Checkout:** Displays the order summary, including subtotal, shipping charges, and total amount.
- **Search Interface:** Provides a search input for finding products.
- **Responsive Interface:** Designed to provide a convenient shopping experience across different screen sizes.

## 🛠️ Technologies Used

- **HTML5** – Structures the web pages.
- **CSS3** – Handles styling, layout, and visual presentation.
- **JavaScript (ES6 Modules)** – Implements interactive features and application logic.
- **Local Storage** – Stores cart, wishlist, and other data locally in the browser, where configured.
- **Netlify** – Hosts the live application.

## 📂 Project Structure

```text
ShopKart/
├── index.html
└── styles.css
├── js/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── wishlist.js
│   ├── checkout.js
│   ├── storage.js
│   └── router.js
└── README.md
```

*Note: The structure above is illustrative. Adjust the filenames and folders to match your actual repository.*

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

### 2. Navigate to the Project Folder

```bash
cd ShopKart
```

### 3. Run the Application

Since the project uses JavaScript ES modules, run it using a local development server rather than opening the HTML file directly.

For example, in Visual Studio Code:

1. Open the project folder.
2. Install the **Live Server** extension if needed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

The application should open in your browser.

## 🛒 How It Works

1. Users open the home page and explore product categories.
2. They browse the catalog, filter products, or open individual product details.
3. They add products to the cart or save them to their wishlist.
4. The cart updates quantities and recalculates the order subtotal.
5. Users review the order summary and proceed to checkout.

The application uses separate JavaScript modules to organize authentication, product management, cart operations, wishlist functionality, storage, and navigation.

## 🎯 Project Objectives

- Build an interactive and easy-to-use e-commerce interface.
- Implement essential online shopping functionalities.
- Organize application logic using reusable JavaScript modules.
- Manage cart quantities, wishlist items, and order calculations.
- Improve understanding of frontend development and application state management.

## 🔮 Future Enhancements

- Integrate a backend API and database for persistent product and user data.
- Implement secure authentication and authorization.
- Integrate a payment gateway.
- Add order history and order tracking.
- Improve search functionality with live suggestions.
- Add inventory management and product availability checks.

## 👨‍💻 Author

**Developed as an individual project** to practice frontend development, JavaScript modular architecture, and e-commerce application functionality.

## 📄 License

This project is intended for learning and portfolio demonstration. Add a specific open-source license if you plan to distribute the source code under formal license terms.
