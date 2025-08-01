// Global Variables
let products = [];
let sales = [];
let reviews = [];
let isAdminLoggedIn = false;
let scanner = null;

// Sample data initialization
const sampleProducts = [
    {
        id: 1,
        name: "Fresh Apples",
        barcode: "1234567890123",
        price: 2.99,
        weight: "500g",
        category: "fruits",
        image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400",
        description: "Fresh and juicy red apples"
    },
    {
        id: 2,
        name: "Organic Milk",
        barcode: "2345678901234",
        price: 3.49,
        weight: "1L",
        category: "dairy",
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400",
        description: "Fresh organic whole milk"
    },
    {
        id: 3,
        name: "Whole Grain Bread",
        barcode: "3456789012345",
        price: 2.29,
        weight: "500g",
        category: "bakery",
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400",
        description: "Fresh whole grain bread"
    },
    {
        id: 4,
        name: "Chicken Breast",
        barcode: "4567890123456",
        price: 8.99,
        weight: "1kg",
        category: "meat",
        image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=400",
        description: "Fresh boneless chicken breast"
    },
    {
        id: 5,
        name: "Orange Juice",
        barcode: "5678901234567",
        price: 4.99,
        weight: "1L",
        category: "beverages",
        image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400",
        description: "100% natural orange juice"
    },
    {
        id: 6,
        name: "Potato Chips",
        barcode: "6789012345678",
        price: 1.99,
        weight: "150g",
        category: "snacks",
        image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400",
        description: "Crispy potato chips"
    }
];

const sampleReviews = [
    {
        id: 1,
        name: "Sarah Johnson",
        rating: 5,
        message: "Excellent service and fresh products! The prices are very reasonable.",
        date: "2024-01-15"
    },
    {
        id: 2,
        name: "Mike Chen",
        rating: 4,
        message: "Great selection of organic products. Staff is very helpful.",
        date: "2024-01-14"
    }
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadSampleData();
    renderProducts();
    renderSales();
    renderReviews();
    setupScrollAnimations();
});

// Initialize the application
function initializeApp() {
    // Load data from localStorage or use sample data
    products = JSON.parse(localStorage.getItem('alhusainy_products')) || sampleProducts;
    sales = JSON.parse(localStorage.getItem('alhusainy_sales')) || [];
    reviews = JSON.parse(localStorage.getItem('alhusainy_reviews')) || sampleReviews;
    
    console.log('Initialized with products:', products.length);
    console.log('Sample products available:', sampleProducts.length);
    
    // Check if admin is logged in
    isAdminLoggedIn = localStorage.getItem('alhusainy_admin_logged_in') === 'true';
}

// Setup event listeners
function setupEventListeners() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Admin login form
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', handleAdminLogin);
    }

    // Add product form
    const addProductForm = document.getElementById('addProductForm');
    if (addProductForm) {
        addProductForm.addEventListener('submit', handleAddProduct);
    }

    // Add sale form
    const addSaleForm = document.getElementById('addSaleForm');
    if (addSaleForm) {
        addSaleForm.addEventListener('submit', handleAddSale);
    }

    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', handleAddReview);
    }

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        console.log('Search input found, adding event listener');
        // Add input event for real-time search
        searchInput.addEventListener('input', (e) => {
            searchProducts();
        });
        
        // Add keyup event for immediate response
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
        
        // Add clear search functionality
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchProducts();
            }
        });
    } else {
        console.error('Search input element not found!');
    }
    
    // Search button functionality
    const searchBtn = document.querySelector('.search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', () => {
            searchProducts();
        });
    }
    
    // Clear button functionality
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearSearch);
    }

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// Load sample data
function loadSampleData() {
            if (!localStorage.getItem('alhusainy_products')) {
            localStorage.setItem('alhusainy_products', JSON.stringify(sampleProducts));
        }
        if (!localStorage.getItem('alhusainy_reviews')) {
            localStorage.setItem('alhusainy_reviews', JSON.stringify(sampleReviews));
        }
}

// Render products
function renderProducts(filteredProducts = null) {
    const productsGrid = document.getElementById('productsGrid');
    const productsToRender = filteredProducts || products;

    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (productsToRender.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }

    productsToRender.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create product card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card scroll-animate';
    
    const sale = sales.find(s => s.productId === product.id && new Date(s.endDate) > new Date());
    const discountedPrice = sale ? product.price * (1 - sale.discount / 100) : null;

    card.innerHTML = `
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <i class="fas fa-image" style="font-size: 3rem; color: #9ca3af;"></i>
            </div>
        </div>
        <div class="product-category">${getCategoryDisplayName(product.category)}</div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                ${discountedPrice ? `
                    <span class="old-price">$${product.price.toFixed(2)}</span>
                    <span class="new-price">$${discountedPrice.toFixed(2)}</span>
                ` : `$${product.price.toFixed(2)}`}
            </div>
            <p class="product-weight">${product.weight}</p>
            <p class="product-barcode">Barcode: ${product.barcode}</p>
            ${product.description ? `<p style="color: #6b7280; font-size: 0.9rem; margin-top: 0.5rem;">${product.description}</p>` : ''}
        </div>
        </div>
    `;

    // Add 3D hover effect
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
    });

    return card;
}

// Get category display name
function getCategoryDisplayName(category) {
    const categories = {
        'fruits': 'Fruits & Vegetables',
        'dairy': 'Dairy & Eggs',
        'meat': 'Meat & Fish',
        'bakery': 'Bakery',
        'beverages': 'Beverages',
        'snacks': 'Snacks',
        'household': 'Household'
    };
    return categories[category] || category;
}

// Render sales
function renderSales() {
    const salesGrid = document.getElementById('salesGrid');
    if (!salesGrid) return;

    const activeSales = sales.filter(sale => new Date(sale.endDate) > new Date());
    
    salesGrid.innerHTML = '';

    if (activeSales.length === 0) {
        salesGrid.innerHTML = `
            <div class="no-sales">
                <i class="fas fa-tags" style="font-size: 3rem; color: #9ca3af; margin-bottom: 1rem;"></i>
                <h3>No active sales</h3>
                <p>Check back later for amazing deals!</p>
            </div>
        `;
        return;
    }

    activeSales.forEach(sale => {
        const product = products.find(p => p.id === sale.productId);
        if (product) {
            const saleCard = createSaleCard(product, sale);
            salesGrid.appendChild(saleCard);
        }
    });
}

// Create sale card
function createSaleCard(product, sale) {
    const card = document.createElement('div');
    card.className = 'sale-card scroll-animate';
    
    const discountedPrice = product.price * (1 - sale.discount / 100);

    card.innerHTML = `
        <div class="sale-badge">-${sale.discount}% OFF</div>
        <div class="product-image">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
            <div style="display: none; align-items: center; justify-content: center; width: 100%; height: 100%;">
                <i class="fas fa-image" style="font-size: 3rem; color: #9ca3af;"></i>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="price-comparison">
                <span class="old-price">$${product.price.toFixed(2)}</span>
                <span class="new-price">$${discountedPrice.toFixed(2)}</span>
            </div>
            <p class="product-weight">${product.weight}</p>
            <p class="product-barcode">Barcode: ${product.barcode}</p>
            <p style="color: #ef4444; font-size: 0.9rem; margin-top: 0.5rem;">
                <i class="fas fa-clock"></i> Sale ends: ${new Date(sale.endDate).toLocaleDateString()}
            </p>
        </div>
    `;

    return card;
}

// Render reviews
function renderReviews() {
    const reviewsList = document.getElementById('reviewsList');
    const adminReviewsList = document.getElementById('adminReviewsList');
    
    if (reviewsList) {
        reviewsList.innerHTML = '';
        reviews.forEach(review => {
            const reviewItem = createReviewItem(review);
            reviewsList.appendChild(reviewItem);
        });
    }

    if (adminReviewsList) {
        adminReviewsList.innerHTML = '';
        reviews.forEach(review => {
            const reviewItem = createReviewItem(review, true);
            adminReviewsList.appendChild(reviewItem);
        });
    }
}

// Create review item
function createReviewItem(review, isAdmin = false) {
    const item = document.createElement('div');
    item.className = 'review-item';
    
    const stars = '⭐'.repeat(review.rating);
    
    item.innerHTML = `
        <div class="review-header">
            <span class="review-name">${review.name}</span>
            <span class="review-rating">${stars}</span>
        </div>
        <p class="review-message">${review.message}</p>
        <small style="color: #9ca3af;">${new Date(review.date).toLocaleDateString()}</small>
        ${isAdmin ? `<button onclick="deleteReview(${review.id})" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer; margin-top: 0.5rem;">Delete</button>` : ''}
    `;

    return item;
}

// Search products
function searchProducts() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) {
        console.error('Search input not found');
        return;
    }
    
    const searchTerm = searchInput.value.toLowerCase().trim();
    console.log('Searching for:', searchTerm);
    console.log('Available products:', products.length);
    
    // If no search term, show all products
    if (!searchTerm) {
        renderProducts();
        // Hide clear button
        const clearBtn = document.querySelector('.clear-btn');
        if (clearBtn) {
            clearBtn.style.display = 'none';
        }
        return;
    }

    // Filter products based on search term
    const filteredProducts = products.filter(product => {
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        const barcodeMatch = product.barcode.toLowerCase().includes(searchTerm);
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        
        return nameMatch || barcodeMatch || categoryMatch;
    });

    console.log('Filtered products:', filteredProducts.length);
    renderProducts(filteredProducts);
    
    // Show clear button when there's a search term
    const clearBtn = document.querySelector('.clear-btn');
    if (clearBtn) {
        clearBtn.style.display = 'block';
    }
    
    // Show notification if no products found
    if (filteredProducts.length === 0 && searchTerm) {
        showNotification(`No products found for "${searchTerm}"`, 'info');
    }
}

function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.value = '';
        searchProducts();
        searchInput.focus();
    }
}

// Barcode scanner functionality
async function openBarcodeScanner() {
    const modal = document.getElementById('scannerModal');
    modal.style.display = 'block';
    
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        const video = document.getElementById('scanner-video');
        video.srcObject = stream;
        
        // Initialize ZXing scanner
        const codeReader = new ZXing.BrowserMultiFormatReader();
        
        codeReader.decodeFromVideoDevice(null, 'scanner-video', (result, err) => {
            if (result) {
                const barcode = result.text;
                const searchInput = document.getElementById('searchInput');
                searchInput.value = barcode;
                searchInput.focus();
                searchProducts();
                closeBarcodeScanner();
                showNotification(`Barcode scanned: ${barcode}`, 'success');
            }
        });
        
        scanner = codeReader;
    } catch (error) {
        showNotification('Camera access denied or not available', 'error');
        closeBarcodeScanner();
    }
}

function closeBarcodeScanner() {
    const modal = document.getElementById('scannerModal');
    modal.style.display = 'none';
    
    if (scanner) {
        scanner.reset();
        scanner = null;
    }
    
    const video = document.getElementById('scanner-video');
    if (video.srcObject) {
        video.srcObject.getTracks().forEach(track => track.stop());
    }
}

// Admin functionality
function handleAdminLogin(e) {
    e.preventDefault();
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    
    if (username === 'ali saleme' && password === '1234321') {
        isAdminLoggedIn = true;
        localStorage.setItem('alhusainy_admin_logged_in', 'true');
        closeAdminModal();
        openAdminDashboard();
        showNotification('Admin login successful! Welcome Ali Saleme!', 'success');
    } else {
        showNotification('Invalid credentials. Only Ali Saleme can access admin panel.', 'error');
        // Clear the password field for security
        document.getElementById('adminPassword').value = '';
    }
}

function openAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'block';
}

function closeAdminModal() {
    const modal = document.getElementById('adminModal');
    modal.style.display = 'none';
    document.getElementById('adminLoginForm').reset();
}

function openAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    modal.style.display = 'block';
    populateProductSelect();
    renderAdminReviews();
    renderAdminProducts();
    
    // Add logout button if not already present
    const dashboardHeader = document.querySelector('.admin-dashboard h2');
    if (!document.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('button');
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        logoutBtn.onclick = logoutAdmin;
        logoutBtn.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
        `;
        dashboardHeader.parentElement.style.position = 'relative';
        dashboardHeader.parentElement.appendChild(logoutBtn);
    }
}

function closeAdminDashboard() {
    const modal = document.getElementById('adminDashboard');
    modal.style.display = 'none';
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    localStorage.removeItem('alhusainy_admin_logged_in');
    closeAdminDashboard();
    showNotification('Admin logged out successfully!', 'success');
}

function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
    
    // Load specific content for tabs
    if (tabName === 'manageProducts') {
        renderAdminProducts();
    } else if (tabName === 'viewReviews') {
        renderAdminReviews();
    }
}

// Product management
function handleAddProduct(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Handle image file upload
    const imageFile = formData.get('image');
    if (imageFile && imageFile.size > 0) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const imageDataUrl = event.target.result;
            
            const newProduct = {
                id: Date.now(),
                name: formData.get('name'),
                barcode: formData.get('barcode'),
                price: parseFloat(formData.get('price')),
                weight: formData.get('weight'),
                category: formData.get('category'),
                image: imageDataUrl,
                description: formData.get('description')
            };
            
            products.push(newProduct);
            localStorage.setItem('alhusainy_products', JSON.stringify(products));
            
            renderProducts();
            populateProductSelect();
            e.target.reset();
            
            showNotification('Product added successfully!', 'success');
        };
        
        reader.readAsDataURL(imageFile);
    } else {
        showNotification('Please select an image file', 'error');
    }
}

function populateProductSelect() {
    const select = document.getElementById('saleProductSelect');
    if (!select) return;
    
    select.innerHTML = '<option value="">Choose a product</option>';
    products.forEach(product => {
        const option = document.createElement('option');
        option.value = product.id;
        option.textContent = product.name;
        select.appendChild(option);
    });
}

// Sales management
function handleAddSale(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newSale = {
        id: Date.now(),
        productId: parseInt(formData.get('productId')),
        discount: parseInt(formData.get('discount')),
        endDate: formData.get('endDate')
    };
    
    sales.push(newSale);
            localStorage.setItem('alhusainy_sales', JSON.stringify(sales));
    
    renderSales();
    e.target.reset();
    
    showNotification('Sale added successfully!', 'success');
}

// Review management
function handleAddReview(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const newReview = {
        id: Date.now(),
        name: formData.get('name'),
        rating: parseInt(formData.get('rating')),
        message: formData.get('message'),
        date: new Date().toISOString().split('T')[0]
    };
    
    reviews.push(newReview);
    localStorage.setItem('alhusainy_reviews', JSON.stringify(reviews));
    
    renderReviews();
    e.target.reset();
    
    showNotification('Review submitted successfully!', 'success');
}

function deleteReview(reviewId) {
    reviews = reviews.filter(review => review.id !== reviewId);
    localStorage.setItem('alhusainy_reviews', JSON.stringify(reviews));
    renderReviews();
    showNotification('Review deleted successfully!', 'success');
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(product => product.id !== productId);
        // Also remove any sales for this product
        sales = sales.filter(sale => sale.productId !== productId);
        localStorage.setItem('alhusainy_products', JSON.stringify(products));
        localStorage.setItem('alhusainy_sales', JSON.stringify(sales));
        renderProducts();
        renderSales();
        populateProductSelect();
        showNotification('Product deleted successfully!', 'success');
    }
}

function renderAdminReviews() {
    const adminReviewsList = document.getElementById('adminReviewsList');
    if (!adminReviewsList) return;
    
    adminReviewsList.innerHTML = '';
    reviews.forEach(review => {
        const reviewItem = createReviewItem(review, true);
        adminReviewsList.appendChild(reviewItem);
    });
}

function renderAdminProducts() {
    const adminProductsList = document.getElementById('adminProductsList');
    if (!adminProductsList) return;
    
    adminProductsList.innerHTML = '';
    products.forEach(product => {
        const productItem = createAdminProductItem(product);
        adminProductsList.appendChild(productItem);
    });
}

function createAdminProductItem(product) {
    const item = document.createElement('div');
    item.className = 'admin-product-item';
    item.style.cssText = `
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1rem;
        background: white;
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    item.innerHTML = `
        <img src="${product.image}" alt="${product.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 5px;" onerror="this.style.display='none';">
        <div style="flex: 1;">
            <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <h4 style="margin: 0;" id="product-name-${product.id}">${product.name}</h4>
                <button onclick="editProductName(${product.id})" style="background: #3b82f6; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; font-size: 0.8rem;">Edit Name</button>
            </div>
            <p style="margin: 0; color: #6b7280; font-size: 0.9rem;">Barcode: ${product.barcode}</p>
            <div style="display: flex; align-items: center; gap: 0.5rem; margin: 0.5rem 0;">
                <span style="color: #6b7280; font-size: 0.9rem;">Price: $<span id="product-price-${product.id}">${product.price.toFixed(2)}</span> | Weight: ${product.weight}</span>
                <button onclick="editProductPrice(${product.id})" style="background: #10b981; color: white; border: none; padding: 0.25rem 0.5rem; border-radius: 3px; cursor: pointer; font-size: 0.8rem;">Edit Price</button>
            </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <button onclick="deleteProduct(${product.id})" style="background: #ef4444; color: white; border: none; padding: 0.5rem 1rem; border-radius: 5px; cursor: pointer;">Delete</button>
        </div>
    `;
    
    return item;
}

// Edit product name
function editProductName(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newName = prompt('Enter new product name:', product.name);
    if (newName && newName.trim() !== '' && newName !== product.name) {
        product.name = newName.trim();
        localStorage.setItem('alhusainy_products', JSON.stringify(products));
        
        // Update the display
        const nameElement = document.getElementById(`product-name-${productId}`);
        if (nameElement) {
            nameElement.textContent = product.name;
        }
        
        // Update main products display
        renderProducts();
        renderSales();
        
        showNotification('Product name updated successfully!', 'success');
    }
}

// Edit product price
function editProductPrice(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const newPrice = prompt('Enter new price (USD):', product.price.toFixed(2));
    if (newPrice && !isNaN(newPrice) && parseFloat(newPrice) > 0) {
        const price = parseFloat(newPrice);
        if (price !== product.price) {
            product.price = price;
            localStorage.setItem('alhusainy_products', JSON.stringify(products));
            
            // Update the display
            const priceElement = document.getElementById(`product-price-${productId}`);
            if (priceElement) {
                priceElement.textContent = product.price.toFixed(2);
            }
            
            // Update main products display
            renderProducts();
            renderSales();
            
            showNotification('Product price updated successfully!', 'success');
        }
    } else if (newPrice !== null) {
        showNotification('Please enter a valid price greater than 0', 'error');
    }
}

// Utility functions
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach(el => {
        observer.observe(el);
    });
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Button click effects
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn')) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = e.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        e.target.style.position = 'relative';
        e.target.style.overflow = 'hidden';
        e.target.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
});

// Add ripple animation to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Console welcome message
    console.log('%c🛒 Welcome to Alhusainy Supermarket!', 'color: #10b981; font-size: 20px; font-weight: bold;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'color: #6b7280; font-size: 14px;');
console.log('%cAdmin Login: ali saleme / 1234321', 'color: #3b82f6; font-size: 12px;'); 