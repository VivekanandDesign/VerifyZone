// Global Navbar Component
class GlobalNavbar {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop();
        
        if (filename === 'blog.html') return 'blog';
        if (path.includes('VZoneDashboard')) return 'VZoneDashboard';
        if (path.includes('XZoneDashboard')) return 'XZoneDashboard';
        return 'home';
    }

    generateNavbarHTML() {
        const isMainPage = this.currentPage === 'home';
        const isBlogPage = this.currentPage === 'blog';
        const isDashboard = this.currentPage.includes('dashboard');
        
        // Base path for links
        let basePath = '';
        if (this.currentPage === 'blog') basePath = '';
        if (this.currentPage === 'VZoneDashboard') basePath = '../';
        if (this.currentPage === 'XZoneDashboard') basePath = '../';

        return `
            <header class="header" id="globalHeader">
                <div class="container">
                    <div class="logo">
                        <h1><a href="${basePath}index.html">VerifyZone</a></h1>
                    </div>
                    <nav class="nav" id="navMenu">
                        <ul>
                            <li><a href="${basePath}index.html#home" ${this.currentPage === 'home' ? 'class="active"' : ''}>Home</a></li>
                            <li><a href="${basePath}index.html#features">Features</a></li>
                            <li><a href="${basePath}index.html#about">About</a></li>
                            <li><a href="${basePath}index.html#customers">Customers</a></li>
                            <li><a href="${basePath}index.html#testimonials">Testimonials</a></li>
                            <li><a href="${basePath}blog.html" ${this.currentPage === 'blog' ? 'class="active"' : ''}>Blog</a></li>
                            <li><a href="${basePath}index.html#contact">Contact</a></li>
                        </ul>
                    </nav>
                    <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                        <span class="hamburger-line"></span>
                    </button>
                </div>
            </header>
        `;
    }

    init() {
        // Only add navbar to non-dashboard pages
        if (!this.currentPage.includes('dashboard')) {
            document.addEventListener('DOMContentLoaded', () => {
                // Replace existing header or insert at beginning of body
                const existingHeader = document.querySelector('header.header');
                const navbarHTML = this.generateNavbarHTML();
                
                if (existingHeader) {
                    existingHeader.outerHTML = navbarHTML;
                } else {
                    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
                }
                
                // Initialize navbar functionality
                this.initializeNavbarFeatures();
            });
        }
    }

    initializeNavbarFeatures() {
        // Mobile menu toggle
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Sticky navbar on scroll
        const header = document.getElementById('globalHeader');
        if (header) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Auto-hide navbar on scroll down, show on scroll up
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });
        }

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const headerHeight = header ? header.offsetHeight : 80;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// Initialize the global navbar
new GlobalNavbar();
