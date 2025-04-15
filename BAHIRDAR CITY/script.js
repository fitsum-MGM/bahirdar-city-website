// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle (for all pages)
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    // Quick Facts Counter Animation (for homepage)
    const factNumbers = document.querySelectorAll('.fact-number');
    let hasAnimated = false;

    function animateNumbers() {
        if (hasAnimated) return;

        factNumbers.forEach(number => {
            const target = parseInt(number.getAttribute('data-target'));
            const duration = 2000; // Animation duration in milliseconds
            const increment = target / (duration / 16); // 60fps
            let current = 0;

            const updateNumber = () => {
                if (current < target) {
                    current += increment;
                    number.textContent = Math.round(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    number.textContent = target;
                }
            };

            updateNumber();
        });

        hasAnimated = true;
    }

    // Observe Quick Facts section for animation (for homepage)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateNumbers();
            }
        });
    }, { threshold: 0.5 });

    const quickFacts = document.querySelector('#quick-facts');
    if (quickFacts) {
        observer.observe(quickFacts);
    }

    // Attractions Slider (for homepage)
    const slider = document.querySelector('.attractions-slider');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.carousel-dots');
    const cards = document.querySelectorAll('.attraction-card');
    let currentIndex = 0;

    if (slider && cards.length) {
        // Always display 2 cards by default
        const cardsPerView = 2;

        // Create dots (one for each group of cards)
        const totalDots = Math.ceil(cards.length / cardsPerView);
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i * cardsPerView));
            dotsContainer.appendChild(dot);
        }

        const dots = document.querySelectorAll('.dot');

        function updateDots() {
            const activeDotIndex = Math.floor(currentIndex / cardsPerView);
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
                dot.setAttribute('aria-current', index === activeDotIndex ? 'true' : 'false');
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, cards.length - cardsPerView));
            const offset = -(currentIndex * (100 / cardsPerView));
            slider.style.transform = `translateX(${offset}%)`;
            updateDots();
            updateButtons();
        }

        function updateButtons() {
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= cards.length - cardsPerView;
            prevBtn.style.opacity = prevBtn.disabled ? '0.5' : '1';
            nextBtn.style.opacity = nextBtn.disabled ? '0.5' : '1';
        }

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                goToSlide(currentIndex - 1);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (currentIndex < cards.length - cardsPerView) {
                goToSlide(currentIndex + 1);
            }
        });

        // Initialize
        updateButtons();
    }

    // Smooth Scroll for Navigation Links (for all pages)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    hamburger.classList.remove('active');
                }
            }
        });
    });

    // Navbar Background on Scroll (for all pages)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // AOS Animation Initialize (if you're using AOS library)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // Experience Section Parallax Effect (for homepage)
    const experienceSection = document.querySelector('.experience-section');
    if (experienceSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.5;
            experienceSection.style.backgroundPositionY = `${rate}px`;
        });
    }

    // Modal functionality (for services page)
    const modals = document.querySelectorAll('.modal');
    const openModalButtons = document.querySelectorAll('.open-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');

    // Open modal when "Learn More" is clicked
    openModalButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = button.getAttribute('href');
            const modal = document.querySelector(modalId);
            if (modal) {
                modal.style.display = 'flex';
            }
        });
    });

    // Close modal when the close button is clicked
    closeModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });

    // Close modal when clicking outside the modal
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Featured Attractions Learn More Links
    const learnMoreLinks = document.querySelectorAll('.learn-more');
    
    learnMoreLinks.forEach(link => {
        // Prevent default to handle custom navigation
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            // Smooth scroll or page navigation
            if (href.startsWith('#')) {
                // If it's an anchor link within the same page
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    targetElement.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            } else {
                // If it's a full page link
                window.location.href = href;
            }
        });

        // Add hover effect
        link.addEventListener('mouseenter', () => {
            link.style.transform = 'translateY(-3px)';
            link.style.boxShadow = '0 4px 10px rgba(26, 95, 122, 0.2)';
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'translateY(0)';
            link.style.boxShadow = 'none';
        });
    });

    // Homepage About Section Learn More Link
    const homeAboutLearnMoreLink = document.querySelector('#about-city .learn-more');
    
    if (homeAboutLearnMoreLink) {
        homeAboutLearnMoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            const href = homeAboutLearnMoreLink.getAttribute('href');
            
            // Smooth page transition
            window.location.href = href;
        });

        // Hover effect
        homeAboutLearnMoreLink.addEventListener('mouseenter', () => {
            homeAboutLearnMoreLink.style.transform = 'translateY(-3px)';
            homeAboutLearnMoreLink.style.boxShadow = '0 6px 15px rgba(26, 95, 122, 0.2)';
        });

        homeAboutLearnMoreLink.addEventListener('mouseleave', () => {
            homeAboutLearnMoreLink.style.transform = 'translateY(0)';
            homeAboutLearnMoreLink.style.boxShadow = 'none';
        });
    }

    // ======================================================
    // New JavaScript Code for About Page
    // ======================================================

    // Experience Section Hover Effects (for About page)
    const experienceItems = document.querySelectorAll('.experience-item');
    if (experienceItems.length > 0) {
        experienceItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                item.style.transform = 'translateY(-10px)';
                item.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            });

            item.addEventListener('mouseleave', () => {
                item.style.transform = 'translateY(0)';
                item.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // News Section Hover Effects (for About page)
    const newsCards = document.querySelectorAll('.news-card');
    if (newsCards.length > 0) {
        newsCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.2)';
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
            });
        });
    }

    // News Section Interactivity
    const newsCardsHomepage = document.querySelectorAll('.news-card');
    const cityUpdatesSection = document.querySelector('.city-updates-section');

    newsCardsHomepage.forEach(card => {
        const newsLink = card.querySelector('.news-link');
        
        newsLink.addEventListener('click', (e) => {
            e.preventDefault();
            const newsType = card.dataset.newsType;
            
            // Navigate to about page and scroll to the correct update
            window.location.href = 'about.html';
            
            // Use setTimeout to ensure page load before scrolling
            setTimeout(() => {
                let targetUpdate;
                switch(newsType) {
                    case 'development':
                        targetUpdate = document.querySelector('.update-card.major-update');
                        break;
                    case 'tourism':
                        targetUpdate = document.querySelector('.update-card.environmental-update');
                        break;
                    case 'culture':
                        targetUpdate = document.querySelector('.update-card.economic-update');
                        break;
                    default:
                        targetUpdate = cityUpdatesSection;
                }
                
                if (targetUpdate) {
                    targetUpdate.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }, 300); // Slight delay to ensure page load
        });
    });

    // Contact Form Submission
    const cityContactForm = document.getElementById('cityContactForm');
    
    if (cityContactForm) {
        cityContactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const message = document.getElementById('message');
            
            if (!fullName.value || !email.value || !message.value) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.value)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Simulate form submission (replace with actual backend logic)
            const formData = {
                fullName: fullName.value,
                email: email.value,
                phone: document.getElementById('phone').value || 'Not provided',
                department: document.getElementById('department').value || 'General',
                message: message.value
            };
            
            // Mock submission (replace with actual AJAX or fetch call)
            console.log('Form Submission Data:', formData);
            
            // Show success message
            const successModal = document.createElement('div');
            successModal.classList.add('success-modal');
            successModal.innerHTML = `
                <div class="modal-content">
                    <i class="fas fa-check-circle"></i>
                    <h3>Message Sent Successfully!</h3>
                    <p>Thank you for reaching out to Bahir Dar City Administration. We'll get back to you soon.</p>
                    <button class="close-modal">Close</button>
                </div>
            `;
            
            document.body.appendChild(successModal);
            
            // Close modal functionality
            const closeModalBtn = successModal.querySelector('.close-modal');
            closeModalBtn.addEventListener('click', () => {
                document.body.removeChild(successModal);
            });
            
            // Reset form
            cityContactForm.reset();
        });
    }

    // Success Modal Styling (add to script or create a separate CSS file)
    const successModalStyle = document.createElement('style');
    successModalStyle.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        }
        .success-modal .modal-content {
            background: white;
            padding: 3rem;
            border-radius: 15px;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
        }
        .success-modal .modal-content i {
            color: #2ecc71;
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .success-modal .modal-content h3 {
            color: #1a5f7a;
            margin-bottom: 1rem;
        }
        .success-modal .modal-content p {
            color: #666;
            margin-bottom: 2rem;
        }
        .success-modal .close-modal {
            background-color: #1a5f7a;
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .success-modal .close-modal:hover {
            background-color: #15495f;
        }
    `;
    document.head.appendChild(successModalStyle);
});