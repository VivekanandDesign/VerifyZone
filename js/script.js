// Main script for VerifyZone landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form handlers
    initializeContactForm();
    initializeNewsletterForm();
    
    // Initialize feature tabs
    initializeFeatureTabs();
    
    // Initialize testimonials carousel
    initializeTestimonialsCarousel();
    
    // Smooth scroll for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 60; // Account for sticky header
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                const nav = document.querySelector('.nav');
                nav.classList.remove('active');
            }
        });
    });

    // Add animation on scroll for feature cards
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe animated elements
    const animatedElements = document.querySelectorAll('.feature-card, .stat, .testimonial-card, .customer-logo, .tab-panel');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
});

// Initialize testimonials carousel
function initializeTestimonialsCarousel() {
    const track = document.getElementById('testimonialTrack');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    let totalSlides = 6; // Total number of testimonials
    let slidesPerView = getSlidesPerView();
    let maxSlide = totalSlides - slidesPerView;

    // Update slides per view based on screen size
    function getSlidesPerView() {
        if (window.innerWidth >= 1024) return 3; // Desktop: show 3
        if (window.innerWidth >= 768) return 2;  // Tablet: show 2
        return 1; // Mobile: show 1
    }

    function updateCarousel() {
        const slideWidth = 100 / totalSlides; // Each slide is 1/6 of total width
        const translateX = -currentSlide * slideWidth;
        track.style.transform = `translateX(${translateX}%)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
    }

    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateCarousel();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    }

    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex <= maxSlide) {
            currentSlide = slideIndex;
            updateCarousel();
        }
    }

    // Event listeners
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            goToSlide(Math.min(index, maxSlide));
        });
    });

    // Auto-play functionality
    let autoPlayInterval;
    
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            if (currentSlide >= maxSlide) {
                currentSlide = 0;
            } else {
                currentSlide++;
            }
            updateCarousel();
        }, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    // Start auto-play
    startAutoPlay();

    // Pause auto-play on hover
    const carousel = document.querySelector('.testimonials-carousel');
    if (carousel) {
        carousel.addEventListener('mouseenter', stopAutoPlay);
        carousel.addEventListener('mouseleave', startAutoPlay);
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        const newSlidesPerView = getSlidesPerView();
        if (newSlidesPerView !== slidesPerView) {
            slidesPerView = newSlidesPerView;
            maxSlide = totalSlides - slidesPerView;
            if (currentSlide > maxSlide) {
                currentSlide = maxSlide;
            }
            updateCarousel();
        }
    });

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });

    track.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next slide
                nextSlide();
            } else {
                // Swipe right - previous slide
                prevSlide();
            }
        }
    }

    // Initialize carousel
    updateCarousel();
}

// Initialize feature tabs
function initializeFeatureTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    if (tabButtons.length === 0) return;

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and panels
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked button and corresponding panel
            this.classList.add('active');
            const targetPanel = document.getElementById(targetTab);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });

    // Keyboard navigation for tabs
    document.addEventListener('keydown', function(e) {
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab) return;

        const allTabs = Array.from(document.querySelectorAll('.tab-btn'));
        const currentIndex = allTabs.indexOf(activeTab);

        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            e.preventDefault();
            allTabs[currentIndex - 1].click();
            allTabs[currentIndex - 1].focus();
        } else if (e.key === 'ArrowRight' && currentIndex < allTabs.length - 1) {
            e.preventDefault();
            allTabs[currentIndex + 1].click();
            allTabs[currentIndex + 1].focus();
        }
    });
}

// Initialize contact form
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Basic validation
        if (!validateContactForm(data)) {
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            showNotification('Thank you! Your message has been sent successfully.', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // If newsletter signup is checked, handle that too
            if (data.newsletter) {
                setTimeout(() => {
                    showNotification('You have been subscribed to our newsletter!', 'info');
                }, 1000);
            }
        }, 2000);
    });
}

// Initialize newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.getElementById('newsletterForm');
    if (!newsletterForm) return;

    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = this.querySelector('#newsletter-email').value;
        
        if (!validateEmail(email)) {
            showNotification('Please enter a valid email address.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Subscribing...';
        submitBtn.disabled = true;
        
        // Simulate subscription
        setTimeout(() => {
            showNotification('Successfully subscribed to our newsletter!', 'success');
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 1500);
    });
}

// Form validation
function validateContactForm(data) {
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
            return false;
        }
    }
    
    if (!validateEmail(data.email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }
    
    return true;
}

// Email validation
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;

    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'warning':
            notification.style.background = '#ffc107';
            notification.style.color = '#333';
            break;
        default:
            notification.style.background = '#17a2b8';
    }

    // Style close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Handle responsive changes (legacy function, kept for compatibility)
function handleResize() {
    const navToggle = document.querySelector('.nav-toggle');
    const nav = document.querySelector('.nav');
    
    if (window.innerWidth <= 768) {
        if (navToggle) navToggle.style.display = 'block';
    } else {
        if (navToggle) navToggle.style.display = 'none';
        nav.classList.remove('active');
        if (navToggle) navToggle.innerHTML = '☰';
    }
}

// Add loading animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add particle effect to hero section (optional enhancement)
function createParticles() {
    const hero = document.querySelector('.hero');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            animation: float ${Math.random() * 3 + 2}s infinite ease-in-out;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s;
        `;
        hero.appendChild(particle);
    }
    
    // Add keyframes for particle animation
    const particleStyle = document.createElement('style');
    particleStyle.textContent = `
        @keyframes float {
            0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
            50% { transform: translateY(-20px) translateX(10px); opacity: 1; }
        }
    `;
    document.head.appendChild(particleStyle);
}

// Initialize particles after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(createParticles, 1000);
    
    // Handle dashboard button clicks
    initializeDashboardButtons();
});

// Handle disabled dashboard navigation
function initializeDashboardButtons() {
    // Find all dashboard-related buttons and links
    const dashboardButtons = document.querySelectorAll('a[href="#"][onclick="return false;"]');
    
    dashboardButtons.forEach(button => {
        // Remove the inline onclick and add event listener
        button.removeAttribute('onclick');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show a toast message or modal
            showDashboardMessage(this.textContent.trim());
            
            return false;
        });
    });
}

// Show message when dashboard buttons are clicked
function showDashboardMessage(buttonText) {
    // Create and show a simple toast notification
    const toast = document.createElement('div');
    toast.className = 'dashboard-toast';
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">🔒</span>
            <span class="toast-message">${buttonText} is currently unavailable for demo purposes</span>
        </div>
    `;
    
    // Add toast styles
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #361968 0%, #9967d1 100%);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(54, 25, 104, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Cookie Banner Functions
document.addEventListener('DOMContentLoaded', function() {
    // Show cookie banner if not already accepted
    if (!getCookie('cookies_accepted')) {
        setTimeout(() => {
            const banner = document.getElementById('cookieBanner');
            if (banner) {
                banner.classList.add('show');
            }
        }, 1000);
    }
});

function acceptCookies() {
    setCookie('cookies_accepted', 'true', 365);
    hideCookieBanner();
    showToastMessage('✅ Cookie preferences saved');
}

function declineCookies() {
    setCookie('cookies_accepted', 'false', 365);
    hideCookieBanner();
    showToastMessage('🚫 Cookies declined');
}

function hideCookieBanner() {
    const banner = document.getElementById('cookieBanner');
    if (banner) {
        banner.classList.remove('show');
    }
}

// Cookie helper functions
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Legal Modal Functions
function showPrivacyPolicy() {
    showLegalModal('Privacy Policy', getPrivacyPolicyContent());
}

function showTermsConditions() {
    showLegalModal('Terms & Conditions', getTermsConditionsContent());
}

function showCookiePolicy() {
    showLegalModal('Cookie Policy', getCookiePolicyContent());
}

function showLegalModal(title, content) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.legal-modal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'legal-modal';
    modal.innerHTML = `
        <div class="legal-modal-content">
            <div class="legal-modal-header">
                <h2>${title}</h2>
                <button class="modal-close" onclick="closeLegalModal()">&times;</button>
            </div>
            <div class="legal-content">
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Close on background click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeLegalModal();
        }
    });
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeLegalModal() {
    const modal = document.querySelector('.legal-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    }
}

// Legal Content
function getPrivacyPolicyContent() {
    return `
        <h3>Information We Collect</h3>
        <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us for support.</p>
        
        <h3>How We Use Your Information</h3>
        <ul>
            <li>To provide, maintain, and improve our services</li>
            <li>To process transactions and send related information</li>
            <li>To send you technical notices and support messages</li>
            <li>To communicate with you about products, services, and events</li>
        </ul>
        
        <h3>Information Sharing</h3>
        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>
        
        <h3>Data Security</h3>
        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
        
        <h3>Contact Us</h3>
        <p>If you have any questions about this Privacy Policy, please contact us at privacy@verifyzone.com.</p>
    `;
}

function getTermsConditionsContent() {
    return `
        <h3>Acceptance of Terms</h3>
        <p>By accessing and using VerifyZone, you accept and agree to be bound by the terms and provision of this agreement.</p>
        
        <h3>Use License</h3>
        <p>Permission is granted to temporarily download one copy of VerifyZone materials for personal, non-commercial transitory viewing only.</p>
        
        <h3>Disclaimer</h3>
        <p>The materials on VerifyZone are provided on an 'as is' basis. VerifyZone makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
        
        <h3>Limitations</h3>
        <p>In no event shall VerifyZone or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use VerifyZone materials.</p>
        
        <h3>Service Terms</h3>
        <ul>
            <li>You must be at least 18 years old to use our services</li>
            <li>You are responsible for maintaining the confidentiality of your account</li>
            <li>You agree not to use the service for any unlawful purposes</li>
            <li>We reserve the right to terminate accounts that violate these terms</li>
        </ul>
        
        <h3>Contact Information</h3>
        <p>For questions regarding these terms, please contact us at legal@verifyzone.com.</p>
    `;
}

function getCookiePolicyContent() {
    return `
        <h3>What Are Cookies</h3>
        <p>Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.</p>
        
        <h3>How We Use Cookies</h3>
        <p>We use cookies for the following purposes:</p>
        <ul>
            <li><strong>Essential Cookies:</strong> These are necessary for the website to function properly</li>
            <li><strong>Analytics Cookies:</strong> These help us understand how visitors interact with our website</li>
            <li><strong>Functional Cookies:</strong> These enable enhanced functionality and personalization</li>
            <li><strong>Marketing Cookies:</strong> These are used to deliver relevant advertisements</li>
        </ul>
        
        <h3>Types of Cookies We Use</h3>
        <ul>
            <li><strong>Session Cookies:</strong> Temporary cookies that expire when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device until they expire or you delete them</li>
            <li><strong>First-party Cookies:</strong> Set by our website</li>
            <li><strong>Third-party Cookies:</strong> Set by external services we use</li>
        </ul>
        
        <h3>Managing Cookies</h3>
        <p>You can control and manage cookies in your browser settings. Please note that disabling certain cookies may impact the functionality of our website.</p>
        
        <h3>Updates to This Policy</h3>
        <p>We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.</p>
        
        <p>Last updated: ${new Date().toLocaleDateString()}</p>
    `;
}

function showToastMessage(message) {
    // Create toast element
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #361968, #9967d1);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(54, 25, 104, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
    `;
    
    // Add to page
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}
