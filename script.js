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
    
    // Auto-stagger logic for children of grids
    const containers = document.querySelectorAll('.services-grid, .shop-grid');
    containers.forEach(container => {
        const children = container.querySelectorAll('.reveal');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
        });
    });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
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

    // --- Coupon Logic ---
    let appliedDiscount = 0; // valor fixo de desconto em reais

    const VALID_COUPONS = {
        'GLOW10':   0.10,
        'CURLY20':  0.20,
        'GLOWVIP':  0.30,
    };

    const applyCouponBtn = document.getElementById('applyCouponBtn');
    const couponInput    = document.getElementById('couponInput');
    const couponStatus   = document.getElementById('couponStatus');
    const discountRow    = document.getElementById('discountRow');
    const summaryDiscount = document.getElementById('summaryDiscount');

    if (applyCouponBtn) {
        applyCouponBtn.addEventListener('click', () => {
            const code = couponInput.value.trim().toUpperCase();
            const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

            if (!code) {
                couponStatus.textContent = 'Por favor, insira um cupom.';
                couponStatus.className = 'coupon-status error';
                return;
            }

            if (VALID_COUPONS[code]) {
                const pct = VALID_COUPONS[code];
                appliedDiscount = subtotal * pct;

                couponStatus.textContent = `✓ Cupom aplicado! ${(pct * 100).toFixed(0)}% de desconto.`;
                couponStatus.className = 'coupon-status success';
                applyCouponBtn.textContent = 'Aplicado ✓';
                applyCouponBtn.disabled = true;
                couponInput.disabled = true;
            } else {
                appliedDiscount = 0;
                couponStatus.textContent = '✗ Cupom inválido ou expirado.';
                couponStatus.className = 'coupon-status error';
            }

            updateFinalTotal();
        });
    }

    function updateFinalTotal() {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const shipping = summaryShipping.textContent === 'Grátis' ? 0 : 15;

        // Recalcular desconto com base no subtotal atual
        const couponCode = couponInput ? couponInput.value.trim().toUpperCase() : '';
        if (VALID_COUPONS[couponCode] && appliedDiscount > 0) {
            appliedDiscount = subtotal * VALID_COUPONS[couponCode];
        }

        const total = Math.max(0, subtotal + shipping - appliedDiscount);

        if (summaryDiscount && discountRow) {
            if (appliedDiscount > 0) {
                summaryDiscount.textContent = `- R$ ${appliedDiscount.toFixed(2).replace('.', ',')}`;
                discountRow.classList.remove('hidden');
            } else {
                discountRow.classList.add('hidden');
            }
        }

        document.getElementById('summaryTotal').textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    }

    // Payment Card Selection
    const paymentCards = document.querySelectorAll('.payment-card');
    const pixDetails = document.getElementById('pixDetails');
    const cardDetails = document.getElementById('cardDetails');
    const copyPixBtn = document.getElementById('copyPixBtn');
    const pixCodeInput = document.getElementById('pixCode');

    paymentCards.forEach(card => {
        card.addEventListener('click', () => {
            paymentCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            const radio = card.querySelector('input');
            radio.checked = true;

            // Show/Hide Payment Details
            if (pixDetails && cardDetails) {
                if (radio.value === 'pix') {
                    pixDetails.style.display = 'flex';
                    cardDetails.style.display = 'none';
                } else if (radio.value === 'card') {
                    pixDetails.style.display = 'none';
                    cardDetails.style.display = 'grid';
                    updateInstallments(); 
                } else {
                    pixDetails.style.display = 'none';
                    cardDetails.style.display = 'none';
                }
            }
        });
    });

    // Interactive Card Logic
    const cardNumberInput = document.getElementById('cardNumber');
    const cardNameInput = document.getElementById('cardName');
    const cardExpiryInput = document.getElementById('cardExpiry');
    const cardCVVInput = document.getElementById('cardCVV');
    const creditCardVisual = document.getElementById('creditCard');

    // Display elements on the card
    const cardNumberDisplay = document.querySelector('.card-number-display');
    const cardNameDisplay = document.querySelector('.card-name-display');
    const cardExpiryDisplay = document.querySelector('.card-expiry-display');
    const cardCVVDisplay = document.querySelector('.card-cvv-display');

    // Card Number Mask & Update
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            value = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = value;
            cardNumberDisplay.textContent = value || '•••• •••• •••• ••••';
        });
    }

    // Card Name Update
    if (cardNameInput) {
        cardNameInput.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase();
            cardNameDisplay.textContent = value || 'NOME NO CARTÃO';
        });
    }

    // Card Expiry Mask & Update
    if (cardExpiryInput) {
        cardExpiryInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
            cardExpiryDisplay.textContent = value || 'MM/AA';
        });
    }

    // Card CVV Update & Flip
    if (cardCVVInput) {
        cardCVVInput.addEventListener('input', (e) => {
            cardCVVDisplay.textContent = e.target.value || '•••';
        });
        cardCVVInput.addEventListener('focus', () => {
            creditCardVisual.classList.add('flipped');
        });
        cardCVVInput.addEventListener('blur', () => {
            creditCardVisual.classList.remove('flipped');
        });
    }

    // Credit/Debit Toggle
    const typeBtns = document.querySelectorAll('.type-btn');
    const installmentsArea = document.getElementById('installmentsArea');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Toggle installments visibility based on type (Credit only)
            if (btn.dataset.cardType === 'credit') {
                updateInstallments();
            } else {
                installmentsArea.classList.add('hidden');
            }
        });
    });

    function updateInstallments() {
        const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const shipping = summaryShipping.textContent === 'Grátis' ? 0 : 15;
        const total = subtotal + shipping;
        const installmentsSelect = document.getElementById('installments');

        if (total >= 100) {
            installmentsArea.classList.remove('hidden');
            installmentsSelect.innerHTML = '';
            
            for (let i = 1; i <= 12; i++) {
                const installmentValue = (total / i).toFixed(2).replace('.', ',');
                const option = document.createElement('option');
                option.value = i;
                option.textContent = `${i}x de R$ ${installmentValue} ${i === 1 ? 'à vista' : 'sem juros'}`;
                installmentsSelect.appendChild(option);
            }
        } else {
            installmentsArea.classList.add('hidden');
        }
    }

    // Copy PIX Code Logic
    if (copyPixBtn && pixCodeInput) {
        copyPixBtn.addEventListener('click', () => {
            pixCodeInput.select();
            pixCodeInput.setSelectionRange(0, 99999); // For mobile devices
            navigator.clipboard.writeText(pixCodeInput.value).then(() => {
                const originalIcon = copyPixBtn.innerHTML;
                copyPixBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
                copyPixBtn.classList.add('copied');
                
                setTimeout(() => {
                    copyPixBtn.innerHTML = originalIcon;
                    copyPixBtn.classList.remove('copied');
                }, 2000);
            });
        });
    }

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

    // --- Auth Flow ---
    const authModal = document.getElementById('authModal');
    const openAuthBtns = document.querySelectorAll('.open-auth-modal');
    const closeAuthBtn = document.getElementById('closeAuth');
    const authTabs = document.querySelectorAll('.auth-tabs .toggle-btn');
    const authForm = document.getElementById('authForm');
    const authStatus = document.getElementById('authStatus');

    if (openAuthBtns) {
        openAuthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                authModal.classList.add('active');
            });
        });
    }

    if (closeAuthBtn) {
        closeAuthBtn.addEventListener('click', () => {
            authModal.classList.remove('active');
        });
    }

    if (authTabs.length > 0) {
        authTabs.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Update active tab button
                authTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Elements to toggle
                const nameGroup = document.getElementById('nameGroup');
                const confirmPassGroup = document.getElementById('confirmPassGroup');
                const forgotPassBtn = document.getElementById('forgotPassBtn');
                const emailInput = document.getElementById('authEmail');
                const passInput = document.getElementById('authPassword');
                const confirmPassInput = document.getElementById('authConfirmPassword');
                const authSubmitBtn = document.getElementById('authSubmitBtn');
                const emailLabel = document.getElementById('emailLabel');
                const passLabel = document.getElementById('passLabel');

                if (tab === 'register') {
                    if (nameGroup) nameGroup.style.display = 'block';
                    if (confirmPassGroup) confirmPassGroup.style.display = 'block';
                    if (forgotPassBtn) forgotPassBtn.style.display = 'none';
                    if (emailLabel) emailLabel.style.display = 'block';
                    if (passLabel) passLabel.style.display = 'block';
                    
                    if (emailInput) emailInput.placeholder = "seu@email.com";
                    if (passInput) passInput.placeholder = "Crie uma senha";
                    if (authSubmitBtn) authSubmitBtn.textContent = 'Cadastrar';
                    
                    document.getElementById('authName').required = true;
                    if (confirmPassInput) confirmPassInput.required = true;
                } else {
                    if (nameGroup) nameGroup.style.display = 'none';
                    if (confirmPassGroup) confirmPassGroup.style.display = 'none';
                    if (forgotPassBtn) forgotPassBtn.style.display = 'block';
                    if (emailLabel) emailLabel.style.display = 'none';
                    if (passLabel) passLabel.style.display = 'none';
                    
                    if (emailInput) emailInput.placeholder = "Endereço de E-mail";
                    if (passInput) passInput.placeholder = "Senha";
                    if (authSubmitBtn) authSubmitBtn.textContent = 'Entrar';
                    
                    document.getElementById('authName').required = false;
                    if (confirmPassInput) confirmPassInput.required = false;
                }
            });
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = authSubmitBtn.textContent;
            authSubmitBtn.textContent = 'Processando...';
            authSubmitBtn.disabled = true;

            setTimeout(() => {
                authSubmitBtn.textContent = originalText;
                authSubmitBtn.disabled = false;
                
                const isLogin = document.querySelector('.auth-tabs .toggle-btn.active').dataset.tab === 'login';
                authStatus.textContent = isLogin ? 'Login efetuado com sucesso!' : 'Conta criada com sucesso!';
                authStatus.style.color = '#28a745';
                
                setTimeout(() => {
                    authStatus.textContent = '';
                    authModal.classList.remove('active');
                    authForm.reset();
                    // Reset to login tab
                    authTabs[0].click();
                }, 2000);
            }, 1500);
        });
    }

    // --- Contact Form Logic (Simulation for Controlled Environments) ---
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const originalText = contactSubmitBtn.textContent;
            contactSubmitBtn.textContent = 'Enviando...';
            contactSubmitBtn.disabled = true;

            // Simula um tempo de rede de 1.5 segundos
            setTimeout(() => {
                alert("mensagem enviada com sucesso");
                contactForm.reset();
                contactSubmitBtn.textContent = originalText;
                contactSubmitBtn.disabled = false;
            }, 1500);
        });
    }

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
        let currentReviewIndex = 0;

        const updateCarousel = () => {
            if (!reviewsGrid.parentElement) return;
            const carouselWidth = reviewsGrid.parentElement.offsetWidth;
            const gap = 50; // O mesmo valor definido no CSS
            const offset = currentReviewIndex * (carouselWidth + gap);
            reviewsGrid.style.transform = `translateX(-${offset}px)`;
            
            // Update dots
            dots.forEach((d, i) => {
                d.classList.toggle('active', i == currentReviewIndex);
            });
        };

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentReviewIndex = index;
                updateCarousel();
            });
        });

        // Garantir que o alinhamento se mantenha ao redimensionar a tela
        window.addEventListener('resize', updateCarousel);
    }

    // --- Cookie Banner Logic ---
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    if (cookieBanner && acceptCookiesBtn) {
        // Mostra o banner toda vez que a página carrega
        setTimeout(() => {
            cookieBanner.classList.add('show');
        }, 1500);

        acceptCookiesBtn.addEventListener('click', () => {
            cookieBanner.classList.remove('show');
        });
    }
    // --- Input Masks ---
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
            e.target.value = !x[2] ? x[1] : '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '');
        });
    }

    const zipInput = document.getElementById('zip');
    if (zipInput) {
        zipInput.addEventListener('input', (e) => {
            let x = e.target.value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/);
            e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2];
        });
    }

    const forgotPassBtn = document.getElementById('forgotPassBtn');
    if (forgotPassBtn) {
        forgotPassBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            if (email) {
                alert(`Um link de recuperação de senha foi enviado para: ${email}`);
            } else {
                alert('Por favor, preencha o seu e-mail antes de solicitar a recuperação.');
            }
        });
    }

    // Set min date for pickup
    const pickupDateInput = document.getElementById('pickupDate');
    if (pickupDateInput) {
        const today = new Date().toISOString().split('T')[0];
        pickupDateInput.setAttribute('min', today);
    }
});
