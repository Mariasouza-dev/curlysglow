document.addEventListener('DOMContentLoaded', () => {
    // --- Existing Features ---
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Reveal Animations on Scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });
    revealElements.forEach(el => revealObserver.observe(el));

    // Booking Form Simulation
    const bookingForm = document.getElementById('bookingForm');
    const formStatus = document.getElementById('formStatus');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = bookingForm.querySelector('button');
            submitBtn.textContent = 'Processando...';
            submitBtn.disabled = true;
            setTimeout(() => {
                submitBtn.textContent = 'Enviar Pedido';
                submitBtn.disabled = false;
                formStatus.textContent = 'Pedido enviado com sucesso! Entraremos em contato brevemente.';
                formStatus.style.color = '#28a745';
                bookingForm.reset();
                setTimeout(() => formStatus.textContent = '', 5000);
            }, 1500);
        });
    }

    // Mobile Menu Control
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const closeMenuBtn = document.getElementById('closeMenu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        const closeMenu = () => {
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        };
        closeMenuBtn.addEventListener('click', closeMenu);
        mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });

    // --- New E-commerce Features ---

    const cart = [];
    
    // --- Service Price Reveal ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            // Close other cards
            serviceCards.forEach(c => {
                if (c !== card) c.classList.remove('active');
            });
            // Toggle current card
            card.classList.toggle('active');
        });
    });
    
    // --- Side Cart Logic ---
    const sideCart = document.getElementById('sideCart');
    const cartIcon = document.querySelector('.cart-icon');
    const closeCartBtn = document.getElementById('closeCart');
    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalDisplay = document.getElementById('cartTotal');
    const cartCountDisplay = document.querySelector('.cart-count');
    const checkoutBtn = document.getElementById('checkoutBtn');

    // Toggle Cart Drawer
    cartIcon.addEventListener('click', (e) => {
        e.preventDefault();
        sideCart.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        sideCart.classList.remove('active');
    });

    // Add to Cart Logic
    const shopProducts = document.querySelectorAll('.product-card');
    shopProducts.forEach(card => {
        const addBtn = card.querySelector('.add-to-cart');
        addBtn.addEventListener('click', () => {
            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.product-price').textContent;
            const price = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
            const img = card.querySelector('img').src;

            addToCart({ name, price, img });
            
            // Visual feedback on button
            const originalText = addBtn.textContent;
            addBtn.textContent = 'Adicionado!';
            addBtn.style.backgroundColor = '#28a745';
            setTimeout(() => {
                addBtn.textContent = originalText;
                addBtn.style.backgroundColor = '';
            }, 1000);
        });
    });

    function addToCart(product) {
        const existingItem = cart.find(item => item.name === product.name);
        if (existingItem) {
            existingItem.qty++;
        } else {
            cart.push({ ...product, qty: 1 });
        }
        updateCart();
        sideCart.classList.add('active');
    }

    function updateCart() {
        // Update Count
        const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);
        cartCountDisplay.textContent = totalItems;

        // Render Items
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-msg">O seu carrinho está vazio.</p>';
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="cart-item">
                    <img src="${item.img}" alt="${item.name}">
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <p class="price">R$ ${(item.price * item.qty).toFixed(2).replace('.', ',')}</p>
                        <div class="qty-control">
                            <span class="qty">Qtd: ${item.qty}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        }

        // Update Total
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        cartTotalDisplay.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        // Update Summary if modal is open
        document.getElementById('summarySubtotal').textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        updateFinalTotal();
    }

    // --- Checkout Flow ---
    const checkoutModal = document.getElementById('checkoutModal');
    const closeCheckoutBtn = document.getElementById('closeCheckout');
    const logisticBtns = document.querySelectorAll('.option-toggle .toggle-btn');
    const pickupInfo = document.getElementById('pickupInfo');
    const deliveryForm = document.getElementById('deliveryForm');
    const summaryShipping = document.getElementById('summaryShipping');

    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) return alert('O carrinho está vazio!');
        sideCart.classList.remove('active');
        checkoutModal.classList.add('active');
        updateCart();
    });

    closeCheckoutBtn.addEventListener('click', () => {
        checkoutModal.classList.remove('active');
    });

    // Logistic Toggle
    logisticBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            logisticBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (btn.dataset.type === 'entrega') {
                pickupInfo.classList.add('hidden');
                deliveryForm.classList.remove('hidden');
                summaryShipping.textContent = 'R$ 15,00';
            } else {
                pickupInfo.classList.remove('hidden');
                deliveryForm.classList.add('hidden');
                summaryShipping.textContent = 'Grátis';
            }
            updateFinalTotal();
        });
    });

    function updateFinalTotal() {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const shipping = summaryShipping.textContent === 'Grátis' ? 0 : 15;
        const total = subtotal + shipping;
        document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Payment Card Selection
    const paymentCards = document.querySelectorAll('.payment-card');
    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            card.querySelector('input').checked = true;
        });
    });

    // Confirm Purchase
    const confirmBtn = document.getElementById('confirmPurchaseBtn');
    confirmBtn.addEventListener('click', () => {
        confirmBtn.textContent = 'Processando...';
        confirmBtn.disabled = true;

        setTimeout(() => {
            alert('Compra finalizada com sucesso! Verifique o seu e-mail para os detalhes do pedido.');
            cart = [];
            updateCart();
            checkoutModal.classList.remove('active');
            confirmBtn.textContent = 'Confirmar e Pagar';
            confirmBtn.disabled = false;
        }, 2000);
    });

    // --- Theme Toggle Logic ---
    const themeToggles = [document.getElementById('themeToggle'), document.getElementById('themeToggleMobile')];
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        updateThemeIcons('dark');
    }

    themeToggles.forEach(btn => {
        if (btn) {
            btn.addEventListener('click', () => {
                body.classList.toggle('dark-theme');
                const currentTheme = body.classList.contains('dark-theme') ? 'dark' : 'light';
                localStorage.setItem('theme', currentTheme);
                updateThemeIcons(currentTheme);
                
                // Add animation
                btn.classList.add('animate');
                setTimeout(() => btn.classList.remove('animate'), 800);
            });
        }
    });

    function updateThemeIcons(theme) {
        themeToggles.forEach(btn => {
            if (btn) {
                const icon = btn.querySelector('i');
                if (theme === 'dark') {
                    icon.classList.remove('fa-sun');
                    icon.classList.add('fa-moon');
                } else {
                    icon.classList.remove('fa-moon');
                    icon.classList.add('fa-sun');
                }
            }
        });
    }

    // --- Reviews Carousel Logic ---
    const reviewsGrid = document.getElementById('reviewsGrid');
    const dots = document.querySelectorAll('.dot');
    
    if (reviewsGrid && dots.length > 0) {
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const index = dot.dataset.index;
                
                // Move the grid (accounting for the 40px gap)
                reviewsGrid.style.transform = `translateX(calc(-${index} * (100% + 40px)))`;
                
                // Update dots
                dots.forEach(d => d.classList.remove('active'));
                dot.classList.add('active');
            });
        });
    }
});
