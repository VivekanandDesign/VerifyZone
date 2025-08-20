// Dashboard Navbar Component
class DashboardNavbar {
    constructor(dashboardType = 'v-zone') {
        this.dashboardType = dashboardType;
        this.init();
    }

    generateTopNavHTML() {
        const isVZone = this.dashboardType === 'v-zone';
        const dashboardName = isVZone ? 'V-Zone' : 'X-Zone';
        const otherDashboard = isVZone ? 'X-Zone' : 'V-Zone';
        const otherDashboardPath = isVZone ? '../XZoneDashboard/index.html' : '../VZoneDashboard/index.html';

        return `
            <nav class="top-navbar sticky" id="dashboardTopNav">
                <div class="top-nav-container">
                    <div class="nav-brand">
                        <a href="../index.html" class="brand-link">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="white"/>
                                <path d="M8 12L20 28L32 12H26L20 20L14 12H8Z" fill="#361968"/>
                                <circle cx="20" cy="10" r="2" fill="#361968"/>
                            </svg>
                            <span class="brand-name">VerifyZone</span>
                        </a>
                        <span class="dashboard-indicator">${dashboardName} Dashboard</span>
                    </div>
                    <div class="nav-actions">
                        <a href="${otherDashboardPath}" class="nav-action-btn switch-dashboard" title="Switch to ${otherDashboard}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7H21L19 5H5L3 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="action-text">${otherDashboard}</span>
                        </a>
                        <button class="nav-action-btn notifications-btn" title="Notifications">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <circle cx="17" cy="7" r="3" fill="#ff4757"/>
                            </svg>
                            <span class="notification-badge">3</span>
                        </button>
                        <div class="profile-dropdown">
                            <button class="profile-btn" id="profileDropdownBtn" title="Profile Menu">
                                <div class="profile-avatar">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                                <span class="profile-name">John Doe</span>
                                <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            <div class="profile-dropdown-menu" id="profileDropdownMenu">
                                <div class="profile-header">
                                    <div class="profile-avatar-large">
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                    </div>
                                    <div class="profile-info">
                                        <h4>John Doe</h4>
                                        <p>Administrator</p>
                                        <span class="profile-email">john.doe@verifyzone.com</span>
                                    </div>
                                </div>
                                <div class="dropdown-divider"></div>
                                <ul class="dropdown-menu-list">
                                    <li>
                                        <a href="#profile" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>My Profile</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#account-settings" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                            <span>Account Settings</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#billing" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                                                <line x1="8" y1="21" x2="16" y2="21" stroke="currentColor" stroke-width="2"/>
                                                <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                            <span>Billing & Plans</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#security" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12V5L12 2L21 5V12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Security</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#help" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                                <path d="M9.09 9A3 3 0 0 1 12 6C13.6569 6 15 7.34315 15 9C15 10.6569 13.6569 12 12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                                                <circle cx="12" cy="17" r="1" fill="currentColor"/>
                                            </svg>
                                            <span>Help & Support</span>
                                        </a>
                                    </li>
                                </ul>
                                <div class="dropdown-divider"></div>
                                <ul class="dropdown-menu-list">
                                    <li>
                                        <a href="../index.html" class="dropdown-item">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Back to Home</span>
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#logout" class="dropdown-item logout">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            </svg>
                                            <span>Sign Out</span>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add top navbar to dashboard pages
            const navContainer = document.getElementById('top-navbar-container');
            if (navContainer) {
                navContainer.innerHTML = this.generateTopNavHTML();
                this.initializeNavbarFeatures();
            }
        });
    }

    initializeNavbarFeatures() {
        const topNav = document.getElementById('dashboardTopNav');
        if (!topNav) return;

        // Initialize profile dropdown
        this.initializeProfileDropdown();

        // Initialize notifications
        this.initializeNotifications();

        // Sticky navbar on scroll
        this.initializeStickyNavbar();
    }

    initializeProfileDropdown() {
        const profileBtn = document.getElementById('profileDropdownBtn');
        const profileMenu = document.getElementById('profileDropdownMenu');
        
        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('show');
                profileBtn.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.remove('show');
                    profileBtn.classList.remove('active');
                }
            });

            // Handle dropdown item clicks
            const dropdownItems = profileMenu.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    const href = item.getAttribute('href');
                    
                    if (href === '#logout') {
                        e.preventDefault();
                        this.handleLogout();
                    } else if (href.startsWith('#')) {
                        e.preventDefault();
                        this.handleProfileAction(href.substring(1));
                    }
                    
                    // Close dropdown after action
                    profileMenu.classList.remove('show');
                    profileBtn.classList.remove('active');
                });
            });
        }
    }

    initializeNotifications() {
        const notificationsBtn = document.querySelector('.notifications-btn');
        if (notificationsBtn) {
            notificationsBtn.addEventListener('click', () => {
                // Handle notifications click
                this.showNotifications();
            });
        }
    }

    initializeStickyNavbar() {
        const navbar = document.getElementById('dashboardTopNav');
        if (!navbar) return;

        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            
            lastScrollY = currentScrollY;
        });
    }

    handleProfileAction(action) {
        console.log(`Profile action: ${action}`);
        // Handle different profile actions
        switch(action) {
            case 'profile':
                this.showProfileModal();
                break;
            case 'account-settings':
                this.showAccountSettings();
                break;
            case 'billing':
                this.showBilling();
                break;
            case 'security':
                this.showSecurity();
                break;
            case 'help':
                this.showHelp();
                break;
        }
    }

    handleLogout() {
        if (confirm('Are you sure you want to sign out?')) {
            // Simulate logout
            console.log('Logging out...');
            // Redirect to login page or home
            window.location.href = '../index.html';
        }
    }

    showNotifications() {
        // Show notifications dropdown or modal
        console.log('Show notifications');
    }

    showProfileModal() {
        // Show profile modal
        console.log('Show profile modal');
    }

    showAccountSettings() {
        // Show account settings
        console.log('Show account settings');
    }

    showBilling() {
        // Show billing information
        console.log('Show billing');
    }

    showSecurity() {
        // Show security settings
        console.log('Show security settings');
    }

    showHelp() {
        // Show help and support
        console.log('Show help');
    }
}
