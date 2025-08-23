// Main JavaScript for Vzone Landing Page
document.addEventListener('DOMContentLoaded', function() {
    // Check if someone is trying to access dashboard pages from root URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('page')) {
        // Redirect to the appropriate dashboard
        const page = urlParams.get('page');
        if (page.includes('verification') || page.includes('ex-zone') || page.includes('discrepancies') || page === 'profile' || page === 'settings') {
            // Redirect to VZone Dashboard
            window.location.href = `/VZoneDashboard/index.html?page=${page}`;
            return;
        }
    }

    // Mobile menu toggle
    const navbarToggle = document.getElementById('navbar-toggle');
    const navbar = document.querySelector('.navbar-nav');
    
    if (navbarToggle) {
        navbarToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            navbarToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                navbar.classList.remove('active');
                navbarToggle.classList.remove('active');
            }
        });
    });

    // Dashboard access buttons
    const dashboardButtons = document.querySelectorAll('.dashboard-access-btn');
    dashboardButtons.forEach(button => {
        button.addEventListener('click', function() {
            const dashboardType = this.dataset.type;
            handleDashboardAccess(dashboardType);
        });
    });

    // Dashboard card click handlers
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('click', function() {
            const dashboardType = this.dataset.dashboard;
            if (dashboardType) {
                handleDashboardAccess(dashboardType);
            }
        });
        
        // Prevent button click from triggering card click
        const button = card.querySelector('.dashboard-access-btn');
        if (button) {
            button.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
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

    // Observe feature cards and dashboard cards
    const animatedElements = document.querySelectorAll('.feature-card, .dashboard-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Handle dashboard access with authentication check
function handleDashboardAccess(dashboardType) {
    // Store the requested dashboard type for after login
    sessionStorage.setItem('requestedDashboard', dashboardType);
    
    // Redirect to login page with dashboard type as parameter
    window.location.href = `login.html?dashboard=${dashboardType}`;
}

// Add CSS for navbar scroll effect
const style = document.createElement('style');
style.textContent = `
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.95);
        backdrop-filter: blur(10px);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .navbar.scrolled .navbar-brand,
    .navbar.scrolled .nav-link {
        color: var(--text-color);
    }
    
    .navbar.scrolled .brand-icon {
        color: var(--primary-color);
    }
    
    .navbar.scrolled .login-link {
        color: #ffffff !important;
    }
`;
document.head.appendChild(style);
