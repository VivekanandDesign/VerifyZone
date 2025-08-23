// VZone Dashboard Main JavaScript
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded, initializing dashboard...');
    
    // Route protection - require VZone access
    try {
        if (!RouteGuard.requireAuth() || !RouteGuard.requireUserType('vzone')) {
            console.log('Authentication failed, redirecting...');
            return;
        }
        console.log('Authentication successful');
    } catch (error) {
        console.error('Authentication error:', error);
        // Continue loading dashboard even if auth fails for development
    }

    // Initialize dashboard
    try {
        initializeDashboard();
        initializeUserInterface();
        
        // Only initialize old navigation if new navigation system is not present
        if (!window.vzoneNavigation) {
            initializeNavigation();
        }
        
        // Load dashboard data
        loadDashboardData();
        console.log('Dashboard initialization completed');
    } catch (error) {
        console.error('Dashboard initialization error:', error);
        hideLoadingOverlay(); // Ensure loading overlay is hidden on error
    }
});

function initializeDashboard() {
    // Initialize user dropdown
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
    }

    // Initialize logout functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            handleLogout();
        });
    }

    // Initialize action buttons
    initializeActionButtons();
    
    // Initialize time period selector
    const timePeriod = document.getElementById('timePeriod');
    if (timePeriod) {
        timePeriod.addEventListener('change', (e) => {
            updateDashboardPeriod(e.target.value);
        });
    }
}

function initializeUserInterface() {
    const user = SessionManager.getUser();
    if (user) {
        // Update user display
        const userDisplayName = document.getElementById('userDisplayName');
        const userRole = document.getElementById('userRole');
        
        if (userDisplayName) {
            userDisplayName.textContent = user.name || 'VZone User';
        }
        if (userRole) {
            userRole.textContent = user.type === 'vzone' ? 'Analytics User' : 'User';
        }
    }
}

function initializeNavigation() {
    // Only proceed if the new navigation system is not present
    if (window.vzoneNavigation) {
        console.log('New navigation system detected, skipping old navigation initialization');
        return;
    }
    
    // Initialize dropdown functionality
    initializeDropdowns();
    
    // Initialize single navigation links
    initializeNavigationLinks();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            const mobileToggle = document.getElementById('mobileMenuToggle');
            if (navMenu && mobileToggle) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        }
    });
}

function initializeNavigationLinks() {
    // Only proceed if the new navigation system is not present
    if (window.vzoneNavigation) return;
    
    // Handle Discrepancies link
    const discrepanciesLink = document.getElementById('discrepanciesLink');
    if (discrepanciesLink) {
        discrepanciesLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('discrepancies');
            updateActiveNav(discrepanciesLink);
        });
    }

    // Handle Active Autopilot link
    const autopilotLink = document.getElementById('autopilotLink');
    if (autopilotLink) {
        autopilotLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('active-autopilot');
            updateActiveNav(autopilotLink);
        });
    }

    // Handle Dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('dashboard');
            updateActiveNav(dashboardLink);
        });
    }
}

function updateActiveNav(activeLink) {
    // Only proceed if the new navigation system is not present
    if (window.vzoneNavigation) return;
    
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}

function initializeDropdowns() {

function initializeNavigationLinks() {
    // Handle Discrepancies link
    const discrepanciesLink = document.getElementById('discrepanciesLink');
    if (discrepanciesLink) {
        discrepanciesLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('discrepancies');
            updateActiveNav(discrepanciesLink);
        });
    }

    // Handle Active Autopilot link
    const autopilotLink = document.getElementById('autopilotLink');
    if (autopilotLink) {
        autopilotLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('active-autopilot');
            updateActiveNav(autopilotLink);
        });
    }

    // Handle Dashboard link
    const dashboardLink = document.getElementById('dashboardLink');
    if (dashboardLink) {
        dashboardLink.addEventListener('click', (e) => {
            e.preventDefault();
            handleNavigation('dashboard');
            updateActiveNav(dashboardLink);
        });
    }
}

/*
function updateActiveNav(activeLink) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    activeLink.classList.add('active');
}
*/

function initializeDropdowns() {
    // Ex-Zone dropdown
    const exZoneToggle = document.getElementById('exZoneToggle');
    const exZoneMenu = document.getElementById('exZoneMenu');
    const exZoneDropdown = document.getElementById('exZoneDropdown');
    
    if (exZoneToggle && exZoneMenu && exZoneDropdown) {
        exZoneToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Close other dropdowns
            closeAllDropdowns();
            
            // Toggle this dropdown
            exZoneMenu.classList.toggle('show');
            exZoneDropdown.classList.toggle('open');
        });

        // Handle dropdown item clicks
        const exZoneItems = exZoneMenu.querySelectorAll('.dropdown-item');
        exZoneItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.currentTarget.getAttribute('data-page');
                handleNavigation(page);
                closeAllDropdowns();
            });
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        const dropdowns = document.querySelectorAll('.dropdown');
        let clickedInside = false;
        
        dropdowns.forEach(dropdown => {
            if (dropdown.contains(e.target)) {
                clickedInside = true;
            }
        });
        
        if (!clickedInside) {
            closeAllDropdowns();
        }
    });
}

function closeAllDropdowns() {
    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    dropdownMenus.forEach(menu => menu.classList.remove('show'));
    dropdowns.forEach(dropdown => dropdown.classList.remove('open'));
}

function initializeMobileMenu() {
    const mobileToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on nav links
        const navLinks = navMenu.querySelectorAll('.nav-link:not(.dropdown-toggle)');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });
    }
}

function handleNavigation(page) {
    // Only proceed if the new navigation system is not present
    if (window.vzoneNavigation) {
        // Use the new navigation system
        window.vzoneNavigation.navigateToPage(page);
        return;
    }
    
    showNotification(`Navigating to ${page.replace('-', ' ')}...`, 'info');
    
    // Update active states
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Here you would implement actual page navigation
    // For now, we'll just show a notification
    console.log(`Navigate to: ${page}`);
    
    // Future implementation:
    // window.location.href = `ex-zone/${page}.html`;
}

function initializeActionButtons() {
    // Remove references to deleted action buttons
    // Quick Actions buttons are no longer present
}

function loadDashboardData() {
    // Show loading overlay
    showLoadingOverlay();
    
    // Simulate loading data with reduced time for testing
    setTimeout(() => {
        try {
            // Populate real-time analytics
            populateRealtimeStats();
            
            // Animate the stats cards
            animateStats();
            hideLoadingOverlay();
            
            // Initialize charts after data is loaded
            if (window.initializeCharts) {
                window.initializeCharts();
            }
            console.log('Dashboard data loaded successfully');
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            hideLoadingOverlay();
        }
    }, 500); // Reduced from 1500ms to 500ms for faster loading
}

function animateStats() {
    const stats = [
        { id: 'reVerificationCount', target: 142 },
        { id: 'verificationRequestCount', target: 89 },
        { id: 'newRequestCount', target: 34 }
    ];

    stats.forEach(stat => {
        const element = document.getElementById(stat.id);
        if (element) {
            animateCounter(element, stat.target, '', stat.suffix || '');
        }
    });
}

function animateCounter(element, target, prefix = '', suffix = '') {
    let current = 0;
    const increment = target / 50;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let value = Math.floor(current * 10) / 10;
        if (suffix === 's') {
            element.textContent = `${value}${suffix}`;
        } else {
            value = Math.floor(current);
            element.textContent = `${prefix}${value}${suffix}`;
        }
    }, 30);
}

function populateRealtimeStats() {
    const realtimeStats = document.getElementById('realtimeStats');
    if (!realtimeStats) return;

    const stats = [
        { label: 'Active Verifications', value: '23' },
        { label: 'Pending Reviews', value: '7' },
        { label: 'Success Rate', value: '94.2%' },
        { label: 'Avg. Process Time', value: '2m 15s' },
        { label: 'Auto-Approved', value: '78%' },
        { label: 'Manual Reviews', value: '5' }
    ];

    const html = stats.map(stat => `
        <div class="realtime-item">
            <div class="realtime-label">${stat.label}</div>
            <div class="realtime-value">${stat.value}</div>
        </div>
    `).join('');

    realtimeStats.innerHTML = html;

    // Start real-time updates
    startRealtimeUpdates();
    
    console.log('Real-time analytics populated successfully');
}

function startRealtimeUpdates() {
    // Update real-time stats every 10 seconds
    setInterval(() => {
        updateRealtimeValues();
    }, 10000);
}

function updateRealtimeValues() {
    const realtimeItems = document.querySelectorAll('.realtime-item');
    
    realtimeItems.forEach((item, index) => {
        const valueElement = item.querySelector('.realtime-value');
        if (!valueElement) return;
        
        switch (index) {
            case 0: // Active Verifications
                const currentActive = parseInt(valueElement.textContent) || 23;
                const newActive = Math.max(0, currentActive + Math.floor(Math.random() * 6) - 3);
                valueElement.textContent = newActive.toString();
                break;
            case 1: // Pending Reviews
                const currentPending = parseInt(valueElement.textContent) || 7;
                const newPending = Math.max(0, currentPending + Math.floor(Math.random() * 4) - 2);
                valueElement.textContent = newPending.toString();
                break;
            case 4: // Auto-Approved percentage
                const currentAuto = parseFloat(valueElement.textContent) || 78;
                const newAuto = Math.max(70, Math.min(95, currentAuto + (Math.random() * 2 - 1)));
                valueElement.textContent = `${newAuto.toFixed(1)}%`;
                break;
            case 5: // Manual Reviews
                const currentManual = parseInt(valueElement.textContent) || 5;
                const newManual = Math.max(0, currentManual + Math.floor(Math.random() * 3) - 1);
                valueElement.textContent = newManual.toString();
                break;
        }
    });
}

function updateDashboardPeriod(period) {
    console.log(`Updating dashboard for period: ${period}`);
    showNotification(`Dashboard updated for ${period}`, 'info');
}

function handleLogout() {
    SessionManager.clearSession();
    showNotification('Logged out successfully', 'success');
    setTimeout(() => {
        window.location.href = '../login.html';
    }, 1000);
}

function showLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('show');
    }
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.remove('show');
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
}
