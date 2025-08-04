// Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile navigation
    initializeMobileNavigation();

    // Navigation functionality
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if it's an external link
            if (this.classList.contains('external')) {
                return;
            }
            
            e.preventDefault();
            
            // Remove active class from all nav links and sections
            navLinks.forEach(nl => nl.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked nav link
            this.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                targetSection.classList.add('active');
            }

            // Close mobile sidebar after navigation
            closeMobileSidebar();
        });
    });

    // Initialize charts
    initializeCharts();

    // Refresh button functionality
    const refreshBtn = document.querySelector('.btn-primary');
    if (refreshBtn && refreshBtn.textContent.includes('Refresh')) {
        refreshBtn.addEventListener('click', function() {
            // Add loading state
            this.textContent = 'Refreshing...';
            this.disabled = true;
            
            // Simulate data refresh
            setTimeout(() => {
                this.textContent = 'Refresh';
                this.disabled = false;
                
                // Update charts with new data
                updateCharts();
                
                // Show success message
                showNotification('Data refreshed successfully!', 'success');
            }, 2000);
        });
    }

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.data-table tbody tr');
            
            tableRows.forEach(row => {
                const text = row.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // Mobile sidebar toggle
    createMobileSidebarToggle();
});

// Chart initialization
function initializeCharts() {
    // Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Revenue',
                    data: [65000, 78000, 82000, 95000, 88000, 105000, 124500],
                    borderColor: '#361968',
                    backgroundColor: 'rgba(54, 25, 104, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        }
                    }
                }
            }
        });
    }

    // Users Chart
    const usersCtx = document.getElementById('usersChart');
    if (usersCtx) {
        new Chart(usersCtx, {
            type: 'doughnut',
            data: {
                labels: ['New Users', 'Returning Users', 'Inactive Users'],
                datasets: [{
                    data: [3200, 4500, 756],
                    backgroundColor: [
                        '#361968',
                        '#9967d1',
                        '#e9ecef'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
}

// Update charts with new data
function updateCharts() {
    // This would typically fetch new data from an API
    // For demo purposes, we'll just generate random data
    const revenueChart = Chart.getChart('revenueChart');
    const usersChart = Chart.getChart('usersChart');

    if (revenueChart) {
        // Generate new revenue data
        const newData = revenueChart.data.datasets[0].data.map(value => {
            return value + (Math.random() - 0.5) * 10000;
        });
        revenueChart.data.datasets[0].data = newData;
        revenueChart.update();
    }

    if (usersChart) {
        // Generate new user data
        const newData = [
            3200 + Math.floor(Math.random() * 500),
            4500 + Math.floor(Math.random() * 500),
            756 + Math.floor(Math.random() * 100)
        ];
        usersChart.data.datasets[0].data = newData;
        usersChart.update();
    }

    // Update KPI values
    updateKPIValues();
}

// Update KPI values
function updateKPIValues() {
    const kpiValues = document.querySelectorAll('.kpi-value');
    kpiValues.forEach(kpi => {
        // Add a subtle animation
        kpi.style.transform = 'scale(1.05)';
        setTimeout(() => {
            kpi.style.transform = 'scale(1)';
        }, 200);
    });
}

// Create mobile sidebar toggle
function createMobileSidebarToggle() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'sidebar-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.setAttribute('aria-label', 'Toggle Navigation Menu');
    toggleBtn.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 1002;
        background: var(--primary-color);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        font-size: 1.2rem;
        cursor: pointer;
        display: none;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        transition: all 0.3s ease;
    `;

    document.body.appendChild(toggleBtn);

    // Toggle functionality
    toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        sidebar.classList.toggle('open');
        
        // Update button appearance
        if (sidebar.classList.contains('open')) {
            toggleBtn.innerHTML = '✕';
            toggleBtn.style.background = '#dc3545';
            document.body.style.overflow = 'hidden'; // Prevent body scroll when menu is open
        } else {
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.background = 'var(--primary-color)';
            document.body.style.overflow = '';
        }
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
            sidebar.classList.remove('open');
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.background = 'var(--primary-color)';
            document.body.style.overflow = '';
        }
    });

    // Handle escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.background = 'var(--primary-color)';
            document.body.style.overflow = '';
            toggleBtn.focus();
        }
    });

    // Show/hide toggle button based on screen size
    function handleResize() {
        if (window.innerWidth <= 1024) {
            toggleBtn.style.display = 'block';
        } else {
            toggleBtn.style.display = 'none';
            sidebar.classList.remove('open');
            toggleBtn.innerHTML = '☰';
            toggleBtn.style.background = 'var(--primary-color)';
            document.body.style.overflow = '';
        }
        
        // Recalculate chart sizes on resize
        setTimeout(() => {
            resizeCharts();
        }, 300);
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

// Resize charts function
function resizeCharts() {
    const charts = Chart.getChart ? Object.values(Chart.instances) : [];
    charts.forEach(chart => {
        if (chart && typeof chart.resize === 'function') {
            chart.resize();
        }
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
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

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Export data functionality
document.addEventListener('click', function(e) {
    if (e.target.textContent.includes('Export Data')) {
        e.preventDefault();
        
        // Simulate data export
        showNotification('Preparing data export...', 'info');
        
        setTimeout(() => {
            showNotification('Data exported successfully!', 'success');
            
            // In a real application, this would trigger a file download
            console.log('Data export would be triggered here');
        }, 2000);
    }
});

// Real-time updates simulation
function startRealTimeUpdates() {
    setInterval(() => {
        // Randomly update one of the KPI values
        const kpiCards = document.querySelectorAll('.kpi-card');
        const randomCard = kpiCards[Math.floor(Math.random() * kpiCards.length)];
        const valueElement = randomCard.querySelector('.kpi-value');
        const changeElement = randomCard.querySelector('.kpi-change');
        
        if (valueElement && changeElement) {
            // Add subtle flash effect
            valueElement.style.background = 'rgba(54, 25, 104, 0.1)';
            setTimeout(() => {
                valueElement.style.background = 'transparent';
            }, 500);
        }
    }, 30000); // Update every 30 seconds
}

// Initialize real-time updates
setTimeout(startRealTimeUpdates, 5000);

// Mobile Navigation Functions
function initializeMobileNavigation() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeMobileSidebar);
    }

    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeMobileSidebar();
        }
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });
}

function toggleMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    
    if (sidebar && sidebarOverlay) {
        sidebar.classList.toggle('show');
        sidebarOverlay.classList.toggle('show');
        
        // Update button icon
        const toggleButton = document.getElementById('mobileMenuToggle');
        if (toggleButton) {
            toggleButton.textContent = sidebar.classList.contains('show') ? '✕' : '☰';
        }

        // Prevent body scroll when sidebar is open
        document.body.style.overflow = sidebar.classList.contains('show') ? 'hidden' : '';
    }
}

function closeMobileSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const toggleButton = document.getElementById('mobileMenuToggle');
    
    if (sidebar) {
        sidebar.classList.remove('show');
    }
    
    if (sidebarOverlay) {
        sidebarOverlay.classList.remove('show');
    }
    
    if (toggleButton) {
        toggleButton.textContent = '☰';
    }

    // Restore body scroll
    document.body.style.overflow = '';
}
