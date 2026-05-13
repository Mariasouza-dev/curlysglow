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

    // --- Step Transition Logic ---
    const goToPaymentBtn = document.getElementById('goToPaymentBtn');
    const backToStep1Btn = document.getElementById('backToStep1Btn');
    const checkoutStep1 = document.getElementById('checkoutStep1');
    const checkoutStep2 = document.getElementById('checkoutStep2');
    const confirmPurchaseBtn = document.getElementById('confirmPurchaseBtn');

    if(goToPaymentBtn) {
        goToPaymentBtn.addEventListener('click', () => {
            checkoutStep1.classList.add('hidden');
            checkoutStep2.classList.remove('hidden');
            if(confirmPurchaseBtn) confirmPurchaseBtn.classList.remove('hidden');
        });
    }

    if(backToStep1Btn) {
        backToStep1Btn.addEventListener('click', () => {
            checkoutStep2.classList.add('hidden');
            checkoutStep1.classList.remove('hidden');
            if(confirmPurchaseBtn) confirmPurchaseBtn.classList.add('hidden');
        });
    }

    // --- Coupon Logic ---
    let appliedDiscount = 0; // valor fixo de desconto em reais

    const VALID_COUPONS = {
        'GLOW10':   0.10,
        'GLOW15':   0.15,
        'CURLY20':  0.20,
        'GLOWVIP':  0.30,
        'FRETEGRATIS': 0.00, // Handle separately for shipping
        'GLOW05':   0.05,
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
                    pixDetails.classList.remove('hidden');
                    cardDetails.classList.add('hidden');
                    pixDetails.style.display = 'flex';
                } else if (radio.value === 'card') {
                    pixDetails.classList.add('hidden');
                    cardDetails.classList.remove('hidden');
                    cardDetails.style.display = 'grid';
                    updateInstallments(); 
                } else {
                    pixDetails.classList.add('hidden');
                    cardDetails.classList.add('hidden');
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

    // Card Number Mask & Update & Brand Detection
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            
            // Brand Detection
            const brandVisa = document.getElementById('brandVisa');
            const brandMastercard = document.getElementById('brandMastercard');
            const brandDefault = document.getElementById('brandDefault');
            
            if (brandVisa && brandMastercard && brandDefault) {
                brandVisa.classList.add('hidden');
                brandMastercard.classList.add('hidden');
                brandDefault.classList.add('hidden');
                
                if (value.startsWith('4')) {
                    brandVisa.classList.remove('hidden');
                } else if (value.startsWith('5')) {
                    brandMastercard.classList.remove('hidden');
                } else {
                    brandDefault.classList.remove('hidden');
                }
            }

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
    const cardTypeDisplay = document.getElementById('cardTypeDisplay');

    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const isCredit = btn.dataset.cardType === 'credit';
            
            // Update Card Visual
            if(cardTypeDisplay) cardTypeDisplay.textContent = isCredit ? 'CRÉDITO' : 'DÉBITO';
            
            // Toggle installments visibility
            if (isCredit) {
                updateInstallments();
                installmentsArea.classList.remove('hidden');
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
            // Clear the cart properly (const array)
            cart.length = 0;
            updateCart();
            checkoutModal.classList.remove('active');
            confirmBtn.textContent = 'Confirmar e Pagar';
            confirmBtn.disabled = false;
        }, 2000);
    });

    // --- Auth Flow (Real Simulation with localStorage) ---
    const authModal = document.getElementById('authModal');
    const openAuthBtns = document.querySelectorAll('.open-auth-modal');
    const closeAuthBtn = document.getElementById('closeAuth');
    const authTabs = document.querySelectorAll('.auth-tabs .toggle-btn');
    const authForm = document.getElementById('authForm');
    const authStatus = document.getElementById('authStatus');
    const userActions = document.querySelector('.nav-actions');
    const userIconLink = document.querySelector('.user-icon');

    // Check for existing session
    let currentUser = JSON.parse(localStorage.getItem('currentUser'));

    function updateAuthUI() {
        if (currentUser) {
            // User is logged in
            const firstName = currentUser.name.split(' ')[0];
            userIconLink.innerHTML = `<span class="user-welcome">Olá, ${firstName}</span>`;
            userIconLink.title = 'Minha Conta';
            userIconLink.classList.remove('open-auth-modal');
            
            // Add logout button if not exists
            if (!document.getElementById('logoutBtn')) {
                const logoutBtn = document.createElement('a');
                logoutBtn.href = '#';
                logoutBtn.id = 'logoutBtn';
                logoutBtn.innerHTML = '<i class="fa-solid fa-arrow-right-from-bracket"></i>';
                logoutBtn.title = 'Sair';
                logoutBtn.style.fontSize = '1.1rem';
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    localStorage.removeItem('currentUser');
                    currentUser = null;
                    location.reload(); // Simple reload to reset state
                });
                // Insert logout button after user icon link
                userIconLink.insertAdjacentElement('afterend', logoutBtn);
            }
        } else {
            // User is logged out
            userIconLink.innerHTML = '<i class="fa-solid fa-user"></i>';
            userIconLink.title = 'Login / Cadastro';
            userIconLink.classList.add('open-auth-modal');
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) logoutBtn.remove();
        }
    }

    updateAuthUI();

    if (openAuthBtns) {
        openAuthBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                if (!currentUser) {
                    authModal.classList.add('active');
                } else {
                    // Could redirect to a profile page, but for now just stay or show info
                    alert(`Você já está logado como ${currentUser.name}`);
                }
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
                authTabs.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
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
                    emailInput.placeholder = "seu@email.com";
                    passInput.placeholder = "Crie uma senha";
                    authSubmitBtn.textContent = 'Cadastrar';
                    document.getElementById('authName').required = true;
                    if (confirmPassInput) confirmPassInput.required = true;
                } else {
                    if (nameGroup) nameGroup.style.display = 'none';
                    if (confirmPassGroup) confirmPassGroup.style.display = 'none';
                    if (forgotPassBtn) forgotPassBtn.style.display = 'block';
                    if (emailLabel) emailLabel.style.display = 'none';
                    if (passLabel) passLabel.style.display = 'none';
                    emailInput.placeholder = "Endereço de E-mail";
                    passInput.placeholder = "Senha";
                    authSubmitBtn.textContent = 'Entrar';
                    document.getElementById('authName').required = false;
                    if (confirmPassInput) confirmPassInput.required = false;
                }
            });
        });
    }

    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const tab = document.querySelector('.auth-tabs .toggle-btn.active').dataset.tab;
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;
            const submitBtn = document.getElementById('authSubmitBtn');
            const originalText = submitBtn.textContent;

            submitBtn.textContent = 'Processando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                let users = JSON.parse(localStorage.getItem('glowUsers')) || [];

                if (tab === 'register') {
                    const name = document.getElementById('authName').value;
                    const confirmPass = document.getElementById('authConfirmPassword').value;

                    if (password !== confirmPass) {
                        authStatus.textContent = 'As senhas não coincidem!';
                        authStatus.style.color = '#ef4444';
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        return;
                    }

                    if (users.find(u => u.email === email)) {
                        authStatus.textContent = 'Este e-mail já está cadastrado!';
                        authStatus.style.color = '#ef4444';
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        return;
                    }

                    const newUser = { name, email, password };
                    users.push(newUser);
                    localStorage.setItem('glowUsers', JSON.stringify(users));
                    
                    authStatus.textContent = 'Conta criada com sucesso! Você já pode entrar.';
                    authStatus.style.color = '#28a745';
                    setTimeout(() => authTabs[0].click(), 1500);
                } else {
                    const user = users.find(u => u.email === email && u.password === password);
                    if (user) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                        currentUser = user;
                        authStatus.textContent = 'Login efetuado! Redirecionando...';
                        authStatus.style.color = '#28a745';
                        setTimeout(() => {
                            updateAuthUI();
                            authModal.classList.remove('active');
                            authForm.reset();
                        }, 1500);
                    } else {
                        authStatus.textContent = 'E-mail ou senha incorretos.';
                        authStatus.style.color = '#ef4444';
                    }
                }

                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    // --- Contact Form Logic (AJAX submission with Formsubmit.co) ---
    const contactForm = document.getElementById('contactForm');
    const contactSubmitBtn = document.getElementById('contactSubmitBtn');
    const contactStatus = document.getElementById('contactStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const originalText = contactSubmitBtn.textContent;
            contactSubmitBtn.textContent = 'Enviando...';
            contactSubmitBtn.disabled = true;
            contactStatus.textContent = '';

            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    contactStatus.textContent = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
                    contactStatus.style.color = '#28a745';
                    contactForm.reset();
                } else {
                    throw new Error('Falha no envio');
                }
            } catch (error) {
                contactStatus.textContent = '✗ Erro ao enviar mensagem. Por favor, tente novamente mais tarde.';
                contactStatus.style.color = '#ef4444';
            } finally {
                contactSubmitBtn.textContent = originalText;
                contactSubmitBtn.disabled = false;
                setTimeout(() => contactStatus.textContent = '', 5000);
            }
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

        // Clique no card para avançar
        const reviewCards = document.querySelectorAll('.review-card');
        reviewCards.forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                currentReviewIndex = (currentReviewIndex + 1) % dots.length;
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
            let value = e.target.value.replace(/\D/g, '');
            let x = value.match(/(\d{0,5})(\d{0,3})/);
            e.target.value = !x[2] ? x[1] : x[1] + '-' + x[2];

            // Auto-fill logic
            if (value.length === 8) {
                const addressInput = document.getElementById('address');
                const cityInput = document.getElementById('city');
                
                // Visual feedback: loading
                addressInput.placeholder = 'Buscando endereço...';
                cityInput.placeholder = 'Buscando cidade...';
                addressInput.classList.add('loading-pulse');
                cityInput.classList.add('loading-pulse');

                fetch(`https://viacep.com.br/ws/${value}/json/`)
                    .then(response => response.json())
                    .then(data => {
                        addressInput.classList.remove('loading-pulse');
                        cityInput.classList.remove('loading-pulse');
                        
                        if (!data.erro) {
                            addressInput.value = `${data.logradouro}${data.bairro ? ', ' + data.bairro : ''}`;
                            cityInput.value = `${data.localidade} - ${data.uf}`;
                            // Focus on address to let user add number/complement
                            addressInput.focus();
                        } else {
                            addressInput.placeholder = 'CEP não encontrado';
                            cityInput.placeholder = 'CEP não encontrado';
                            setTimeout(() => {
                                addressInput.placeholder = 'Endereço Completo';
                                cityInput.placeholder = 'Cidade';
                            }, 2000);
                        }
                    })
                    .catch(() => {
                        addressInput.classList.remove('loading-pulse');
                        cityInput.classList.remove('loading-pulse');
                        addressInput.placeholder = 'Erro ao buscar CEP';
                    });
            }
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
    // --- Password Visibility Toggle ---
    const toggleAuthPassword = document.getElementById('toggleAuthPassword');
    const authPasswordInput = document.getElementById('authPassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const confirmPasswordInput = document.getElementById('authConfirmPassword');

    if (toggleAuthPassword && authPasswordInput) {
        toggleAuthPassword.addEventListener('click', () => {
            const type = authPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            authPasswordInput.setAttribute('type', type);
            toggleAuthPassword.classList.toggle('fa-eye');
            toggleAuthPassword.classList.toggle('fa-eye-slash');
        });
    }

    if (toggleConfirmPassword && confirmPasswordInput) {
        toggleConfirmPassword.addEventListener('click', () => {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            toggleConfirmPassword.classList.toggle('fa-eye');
            toggleConfirmPassword.classList.toggle('fa-eye-slash');
        });
    }
    // --- Coupon Wheel Logic ---
    const wheel = document.getElementById('wheel');
    const spinBtn = document.getElementById('spinBtn');
    const wheelModal = document.getElementById('wheelModal');
    const openWheelBtn = document.getElementById('openWheel');
    const closeWheelBtn = document.getElementById('closeWheel');
    const wheelResult = document.getElementById('wheelResult');
    const prizeText = document.getElementById('prizeText');
    const wonCouponCode = document.getElementById('wonCouponCode');
    const copyWonCoupon = document.getElementById('copyWonCoupon');

    const prizes = [
        { text: "10% OFF", code: "GLOW10" },
        { text: "15% OFF", code: "GLOW15" },
        { text: "Tente Novamente", code: "" },
        { text: "30% OFF", code: "GLOWVIP" },
        { text: "Frete Grátis", code: "FRETEGRATIS" },
        { text: "20% OFF", code: "CURLY20" },
        { text: "5% OFF", code: "GLOW05" },
        { text: "Tente Novamente", code: "" }
    ];

    // Generate segments
    if (wheel) {
        const segmentAngle = 360 / prizes.length;
        wheel.innerHTML = prizes.map((prize, i) => `
            <div class="wheel-segment" style="transform: rotate(${i * segmentAngle}deg) skewY(${90 - segmentAngle}deg)">
                <div class="segment-content" style="transform: skewY(-${90 - segmentAngle}deg) rotate(${segmentAngle / 2}deg)">
                    <span class="prize-name">${prize.text}</span>
                    <span class="prize-code">${prize.code}</span>
                </div>
            </div>
        `).join('');
    }

    let isSpinning = false;
    let currentRotation = 0;

    if (openWheelBtn) {
        openWheelBtn.addEventListener('click', () => {
            wheelModal.classList.add('active');
            wheelResult.classList.add('hidden');
            wheel.style.transition = 'none';
            wheel.style.transform = 'rotate(0deg)';
            currentRotation = 0;
        });
    }

    if (closeWheelBtn) {
        closeWheelBtn.addEventListener('click', () => {
            wheelModal.classList.remove('active');
        });
    }

    if (spinBtn) {
        spinBtn.addEventListener('click', () => {
            if (isSpinning) return;
            
            isSpinning = true;
            wheelResult.classList.add('hidden');
            
            const extraSpins = 5 + Math.floor(Math.random() * 5);
            const randomAngle = Math.floor(Math.random() * 360);
            const totalRotation = extraSpins * 360 + randomAngle;
            
            wheel.style.transition = 'transform 5s cubic-bezier(0.15, 0, 0.15, 1)';
            wheel.style.transform = `rotate(${totalRotation}deg)`;
            
            setTimeout(() => {
                isSpinning = false;
                
                // Calculate which prize was won (pointer is at top - 0deg)
                const normalizedAngle = (360 - (totalRotation % 360)) % 360;
                const prizeIndex = Math.floor(normalizedAngle / (360 / prizes.length));
                const win = prizes[prizeIndex];

                if (win.code) {
                    prizeText.textContent = win.text;
                    wonCouponCode.textContent = win.code;
                    wheelResult.classList.remove('hidden');
                } else {
                    alert("Não foi dessa vez! Tente girar novamente.");
                }
            }, 5000);
        });
    }

    if (copyWonCoupon) {
        copyWonCoupon.addEventListener('click', () => {
            navigator.clipboard.writeText(wonCouponCode.textContent).then(() => {
                const originalIcon = copyWonCoupon.innerHTML;
                copyWonCoupon.innerHTML = '<i class="fa-solid fa-check"></i>';
                setTimeout(() => copyWonCoupon.innerHTML = originalIcon, 2000);
            });
        });
    }

    // --- Translation Logic ---
    const langBtns = document.querySelectorAll('.lang-dropdown button, .lang-switcher-mobile button');
    const currentLangDisplay = document.getElementById('currentLang');

    // Default language or saved preference
    let currentLang = localStorage.getItem('language') || 'pt-BR';

    function updateLanguage(lang) {
        if (!translations[lang]) return;

        // Save preference
        localStorage.setItem('language', lang);
        currentLang = lang;

        // Update UI
        const shortLang = lang === 'pt-BR' ? 'PT' : lang.toUpperCase();
        if (currentLangDisplay) currentLangDisplay.textContent = shortLang;

        // Update active class on buttons
        langBtns.forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Translate all elements with data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[lang][key]) {
                // Check if it's an input or textarea (placeholder)
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    // Update innerHTML to support <br> or <span> tags
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        // Specific cases like input placeholders that aren't using data-i18n directly or need special handling
        const placeholders = {
            'contactName': 'form-name',
            'contactEmail': 'form-email',
            'contactSubject': 'contact-subject',
            'contactMessage': 'contact-message',
            'name': 'form-name',
            'email': 'form-email',
            'phone': 'form-phone'
        };

        for (const [id, key] of Object.entries(placeholders)) {
            const el = document.getElementById(id);
            if (el && translations[lang][key]) {
                el.placeholder = translations[lang][key];
            }
        }

        // Update select options
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            const options = serviceSelect.options;
            if (options[0]) options[0].textContent = translations[lang]['form-service-placeholder'];
            // Individual options mapping if needed, but the select is mostly static
        }

        // Update document title and description
        if (lang === 'en') {
            document.title = 'Curlys Glow | The Shine of Your Curls';
        } else if (lang === 'es') {
            document.title = 'Curlys Glow | El Brillo de tus Rizos';
        } else {
            document.title = 'Curlys Glow | O Brilho dos Seus Cachos';
        }
    }

    // Event listeners for buttons
    langBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            updateLanguage(lang);
        });
    });

    // Initialize with current language
    updateLanguage(currentLang);
});
