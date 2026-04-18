const cart = {
    items: [],
    
    init() {
        // Load from localStorage
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
        this.updateUI();
    },
    
    addItem(productId) {
        const product = products.find(p => p.id === productId);
        const existing = this.items.find(item => item.id === productId);
        
        if (existing) {
            existing.quantity++;
        } else {
            this.items.push({
                id: productId,
                name: product.name,
                price: product.price,
                quantity: 1,
                image: product.image
            });
        }
        
        this.save();
        this.updateUI();
        alert('Added to cart!');
    },
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateUI();
    },
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    },
    
    updateUI() {
        // Update cart count in navbar
        const count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cart-count').textContent = count;
        
        // Update cart page if we're on it
        if (window.location.pathname.includes('cart')) {
            renderCartPage();
        }
    },
    
    getTotal() {
        return this.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
    }
};

// Initialize cart
cart.init();
