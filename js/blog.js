// Blog-specific JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize blog functionality
    initBlogFeatures();
    initAnimations();
    initNewsletterForm();
    initCategoryFilters();
    initLoadMore();
});

// Initialize blog features
function initBlogFeatures() {
    // Add active class to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav a');
    
    navLinks.forEach(link => {
        if (link.href.includes(currentPage) || (currentPage === 'blog.html' && link.textContent === 'Blog')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Initialize scroll animations
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Add staggered animation for grid items
                if (entry.target.classList.contains('category-card') || 
                    entry.target.classList.contains('blog-post')) {
                    const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.featured-post, .category-card, .blog-post, .newsletter-cta'
    );
    
    animatedElements.forEach(el => observer.observe(el));
}

// Newsletter form handling
function initNewsletterForm() {
    const newsletterForm = document.getElementById('blogNewsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const submitButton = this.querySelector('button[type="submit"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                showNotification('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission
            submitButton.textContent = 'Subscribing...';
            submitButton.disabled = true;
            
            setTimeout(() => {
                showNotification('Successfully subscribed to our blog!', 'success');
                emailInput.value = '';
                submitButton.textContent = 'Subscribe to Blog';
                submitButton.disabled = false;
            }, 1500);
        });
    }
}

// Category filter functionality
function initCategoryFilters() {
    const categoryCards = document.querySelectorAll('.category-card');
    
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Remove active class from all cards
            categoryCards.forEach(c => c.classList.remove('active-category'));
            
            // Add active class to clicked card
            this.classList.add('active-category');
            
            // Filter articles (if we had more articles, we'd filter them here)
            filterArticlesByCategory(category);
            
            // Smooth scroll to articles
            setTimeout(() => {
                document.querySelector('.recent-articles').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);
        });
    });
}

// Filter articles by category
function filterArticlesByCategory(category) {
    const articles = document.querySelectorAll('.blog-post');
    
    articles.forEach(article => {
        const articleCategory = article.querySelector('.category').textContent.toLowerCase().replace(' ', '-');
        
        if (category === 'all' || articleCategory === category) {
            article.style.display = 'flex';
            article.classList.add('fade-in');
        } else {
            article.style.display = 'none';
            article.classList.remove('fade-in');
        }
    });
    
    // Show message if no articles found
    const visibleArticles = Array.from(articles).filter(article => 
        article.style.display !== 'none'
    );
    
    if (visibleArticles.length === 0) {
        showNotification(`No articles found for category: ${category.replace('-', ' ')}`, 'info');
    }
}

// Load more functionality
function initLoadMore() {
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.classList.add('loading');
            this.textContent = 'Loading...';
            
            // Simulate loading more articles
            setTimeout(() => {
                loadMoreArticles();
                this.classList.remove('loading');
                this.textContent = 'Load More Articles';
            }, 2000);
        });
    }
}

// Simulate loading more articles
function loadMoreArticles() {
    const articlesGrid = document.querySelector('.articles-grid');
    const newArticles = [
        {
            category: 'Use Cases',
            date: 'July 12, 2025',
            title: 'Healthcare Analytics: Improving Patient Outcomes with Data',
            excerpt: 'Learn how healthcare providers use VerifyZone to analyze patient data, improve treatment outcomes, and optimize resource allocation.',
            categoryClass: 'use-cases'
        },
        {
            category: 'Tutorials',
            date: 'July 10, 2025',
            title: 'Advanced Data Visualization Techniques',
            excerpt: 'Master the art of creating compelling data visualizations that tell stories and drive business decisions.',
            categoryClass: 'tutorials'
        },
        {
            category: 'Best Practices',
            date: 'July 8, 2025',
            title: 'Performance Optimization for Large Datasets',
            excerpt: 'Essential techniques for handling and analyzing large datasets efficiently without compromising performance.',
            categoryClass: 'best-practices'
        }
    ];
    
    newArticles.forEach((article, index) => {
        const articleElement = createArticleElement(article);
        articleElement.style.opacity = '0';
        articleElement.style.transform = 'translateY(30px)';
        articlesGrid.appendChild(articleElement);
        
        // Animate in new articles
        setTimeout(() => {
            articleElement.style.transition = 'all 0.5s ease';
            articleElement.style.opacity = '1';
            articleElement.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    showNotification('3 new articles loaded!', 'success');
}

// Create article element
function createArticleElement(article) {
    const articleEl = document.createElement('article');
    articleEl.className = 'blog-post';
    
    articleEl.innerHTML = `
        <div class="post-image">
            <div class="placeholder-image">
                <span>Article Image</span>
            </div>
        </div>
        <div class="post-content">
            <div class="post-meta">
                <span class="category">${article.category}</span>
                <span class="date">${article.date}</span>
            </div>
            <h3>${article.title}</h3>
            <p>${article.excerpt}</p>
            <a href="#" class="read-more">Read More</a>
        </div>
    `;
    
    return articleEl;
}

// Utility function to validate email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        min-width: 300px;
        max-width: 500px;
        padding: 1rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease;
        background: ${type === 'success' ? '#059669' : type === 'error' ? '#dc2626' : '#2563eb'};
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: background 0.2s ease;
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

// Enhanced smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add reading progress indicator
function addReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, var(--primary-color), var(--secondary-color));
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(scrollPercent, 100) + '%';
    });
}

// Initialize reading progress
addReadingProgress();

// Search functionality (basic implementation)
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            const articles = document.querySelectorAll('.blog-post');
            
            articles.forEach(article => {
                const title = article.querySelector('h3').textContent.toLowerCase();
                const excerpt = article.querySelector('p').textContent.toLowerCase();
                const category = article.querySelector('.category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    article.style.display = 'flex';
                } else {
                    article.style.display = searchTerm ? 'none' : 'flex';
                }
            });
        });
    }
}
