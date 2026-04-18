// Simple data store (replace with backend later)
const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: 79.99,
        image: "https://via.placeholder.com/300x200/2563eb/fff?text=Headphones",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Watch",
        price: 199.99,
        image: "https://via.placeholder.com/300x200/2563eb/fff?text=Watch",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Running Shoes",
        price: 89.99,
        image: "https://via.placeholder.com/300x200/2563eb/fff?text=Shoes",
        category: "Sports"
    }
];

// Render products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <button class="add-to-cart" onclick="cart.addItem(${product.id})">
                    Add to Cart
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', renderProducts);
