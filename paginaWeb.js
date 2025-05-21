document.addEventListener('DOMContentLoaded', function() {
    // Header scroll effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.menu');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
            
            // Toggle hamburger animation
            this.classList.toggle('active');
            if (this.classList.contains('active')) {
                this.children[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                this.children[1].style.opacity = '0';
                this.children[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                this.children[0].style.transform = 'none';
                this.children[1].style.opacity = '1';
                this.children[2].style.transform = 'none';
            }
        });
    }

    // Cart sidebar toggle
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartOverlay = document.querySelector('.cart-overlay');
    const closeCart = document.querySelector('.close-cart');
    
    if (cartIcon && cartSidebar && cartOverlay && closeCart) {
        cartIcon.addEventListener('click', function(e) {
            e.preventDefault();
            cartSidebar.classList.add('active');
            cartOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        function closeCartSidebar() {
            cartSidebar.classList.remove('active');
            cartOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
        
        closeCart.addEventListener('click', closeCartSidebar);
        cartOverlay.addEventListener('click', closeCartSidebar);
    }

    // Add to cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const totalAmount = document.querySelector('.total-amount');
    const notification = document.getElementById('notification');
    
    let cart = [];
    let total = 0;
    
    // Load cart from localStorage if available
    if (localStorage.getItem('cart')) {
        try {
            cart = JSON.parse(localStorage.getItem('cart'));
            updateCartUI();
        } catch (e) {
            console.error('Error loading cart from localStorage', e);
            localStorage.removeItem('cart');
        }
    }
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('img').src;
            
            // Check if product already in cart
            const existingItemIndex = cart.findIndex(item => item.name === productName);
            
            if (existingItemIndex > -1) {
                // Increase quantity if already in cart
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new item to cart
                cart.push({
                    name: productName,
                    price: parseFloat(productPrice),
                    image: productImage,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart UI
            updateCartUI();
            
            // Show notification
            showNotification();
        });
    });
    
    function updateCartUI() {
        // Update cart count
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
        
        // Update cart items
        if (cart.length === 0) {
            if (emptyCart) emptyCart.style.display = 'flex';
            cartItems.innerHTML = emptyCart.outerHTML;
        } else {
            if (emptyCart) emptyCart.style.display = 'none';
            
            let cartHTML = '';
            total = 0;
            
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.quantity;
                total += itemTotal;
                
                cartHTML += `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                            <div class="cart-item-quantity">
                                <button class="quantity-btn decrease" data-index="${index}">-</button>
                                <input type="text" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn increase" data-index="${index}">+</button>
                            </div>
                        </div>
                        <button class="remove-item" data-index="${index}">×</button>
                    </div>
                `;
            });
            
            cartItems.innerHTML = cartHTML;
            
            // Add event listeners to quantity buttons and remove buttons
            document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    if (cart[index].quantity > 1) {
                        cart[index].quantity -= 1;
                    } else {
                        cart.splice(index, 1);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart[index].quantity += 1;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', function() {
                    const index = parseInt(this.dataset.index);
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    updateCartUI();
                });
            });
        }
        
        // Update total
        if (totalAmount) {
            totalAmount.textContent = `$${total.toFixed(2)}`;
        }
    }
    
    function showNotification() {
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }

    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            
            if (validateEmail(email)) {
                // Here you would typically send the email to your server
                // For now, we'll just show a notification
                notification.querySelector('p').textContent = '¡Gracias por suscribirte!';
                showNotification();
                this.reset();
            } else {
                notification.querySelector('p').textContent = 'Por favor, introduce un email válido';
                showNotification();
            }
        });
    }
    
    function validateEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Animate on scroll functionality
    const animatedElements = document.querySelectorAll('[data-aos]');
    
    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    window.addEventListener('scroll', checkScroll);
    checkScroll(); // Check on initial load

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (menu.classList.contains('active')) {
                    menu.classList.remove('active');
                    mobileToggle.classList.remove('active');
                    mobileToggle.children[0].style.transform = 'none';
                    mobileToggle.children[1].style.opacity = '1';
                    mobileToggle.children[2].style.transform = 'none';
                }
                
                // Close cart if open
                if (cartSidebar && cartSidebar.classList.contains('active')) {
                    cartSidebar.classList.remove('active');
                    cartOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                // Scroll to target
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Product color selection
    const colorDots = document.querySelectorAll('.color-dot');
    
    colorDots.forEach(dot => {
        dot.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productImage = productCard.querySelector('.product-image img');
            
            // Here you would typically change the product image based on the selected color
            // For this demo, we'll just add a selected class to the dot
            const siblings = Array.from(this.parentNode.children);
            siblings.forEach(sibling => sibling.classList.remove('selected'));
            this.classList.add('selected');
        });
    });

    // Checkout button
    const checkoutBtn = document.querySelector('.checkout-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                notification.querySelector('p').textContent = 'Tu carrito está vacío';
                showNotification();
                return;
            }
            
            // Here you would typically redirect to a checkout page
            // For this demo, we'll just show a notification
            notification.querySelector('p').textContent = 'Redirigiendo al checkout...';
            showNotification();
        });
    }
});