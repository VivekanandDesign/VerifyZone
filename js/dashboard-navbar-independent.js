// Independent Dashboard Navbar Component
class IndependentDashboardNavbar {
    constructor(config = {}) {
        this.config = {
            dashboardType: config.dashboardType || 'v-zone',
            currentPage: config.currentPage || 'dashboard',
            userProfile: config.userProfile || {
                name: 'John Doe',
                email: 'john.doe@verifyzone.com',
                avatar: 'JD'
            },
            ...config
        };
        this.init();
    }

    init() {
        this.createTopNavbar();
        this.createSidebar();
        this.bindMobileToggle();
        this.bindProfileDropdown();
        this.bindNotifications();
        this.bindNavigationLinks();
        this.updateActiveLink();
        this.restoreAccordionStates();
        this.bindSidebarToggle();
    }

    createTopNavbar() {
        const topNavContainer = document.getElementById('top-navbar-container') || this.createTopNavContainer();
        topNavContainer.innerHTML = this.generateTopNavHTML();
    }

    createTopNavContainer() {
        const container = document.createElement('div');
        container.id = 'top-navbar-container';
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }

    generateTopNavHTML() {
        const { dashboardType, userProfile } = this.config;
        const isVZone = dashboardType === 'v-zone';
        const dashboardName = isVZone ? 'V-Zone' : 'X-Zone';
        const otherDashboard = isVZone ? 'X-Zone' : 'V-Zone';
        const otherDashboardPath = isVZone ? '../XZoneDashboard/index.html' : '../VZoneDashboard/index.html';
        
        // Handle relative paths based on current location
        const basePath = this.getBasePath();

        return `
            <nav class="top-navbar" id="dashboardTopNav">
                <div class="top-nav-container">
                    <div class="nav-brand">
                        <a href="${basePath}index.html" class="brand-link">
                            <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect width="40" height="40" rx="8" fill="white"/>
                                <path d="M8 12L20 28L32 12H26L20 20L14 12H8Z" fill="#361968"/>
                                <circle cx="20" cy="10" r="2" fill="#361968"/>
                            </svg>
                            <span class="brand-name">VerifyZone</span>
                        </a>
                        <span class="dashboard-indicator">${dashboardName}</span>
                    </div>
                    
                    <!-- Mobile Menu Toggle -->
                    <button class="mobile-menu-toggle" id="mobileMenuToggle">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>

                    <div class="nav-actions">
                        <a href="${otherDashboardPath}" class="nav-action-btn switch-dashboard" title="Switch to ${otherDashboard}">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 7H21L19 5H5L3 7Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M10 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            <span class="action-text">${otherDashboard}</span>
                        </a>
                        
                        <div class="notifications-dropdown">
                            <button class="nav-action-btn notifications-btn" id="notificationsBtn" title="Notifications">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 8A6 6 0 0 0 6 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                    <path d="M13.73 21A2 2 0 0 1 10.27 21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                                <span class="notification-badge">3</span>
                            </button>
                            
                            <div class="notifications-dropdown-menu" id="notificationsDropdownMenu">
                                <div class="notifications-header">
                                    <h4>Notifications</h4>
                                    <div class="notification-actions">
                                        <button class="mark-all-read" id="markAllRead">Mark all read</button>
                                        <button class="notification-settings" id="notificationSettings" title="Settings">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                                                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div class="notifications-list">
                                    <div class="notification-item unread" data-id="1">
                                        <div class="notification-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2"/>
                                                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </div>
                                        <div class="notification-content">
                                            <h5>New user verification request</h5>
                                            <p>John Smith submitted verification documents</p>
                                            <span class="notification-time">2 minutes ago</span>
                                        </div>
                                        <div class="notification-status">
                                            <div class="unread-dot"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="notification-item unread" data-id="2">
                                        <div class="notification-icon warning">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.29 3.86L1.82 18A2 2 0 0 0 3.55 21H20.45A2 2 0 0 0 22.18 18L13.71 3.86A2 2 0 0 0 10.29 3.86Z" stroke="currentColor" stroke-width="2"/>
                                                <line x1="12" y1="9" x2="12" y2="13" stroke="currentColor" stroke-width="2"/>
                                                <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </div>
                                        <div class="notification-content">
                                            <h5>System maintenance scheduled</h5>
                                            <p>Scheduled maintenance on Aug 15, 2:00 AM - 4:00 AM</p>
                                            <span class="notification-time">1 hour ago</span>
                                        </div>
                                        <div class="notification-status">
                                            <div class="unread-dot"></div>
                                        </div>
                                    </div>
                                    
                                    <div class="notification-item read" data-id="3">
                                        <div class="notification-icon success">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9 12L11 14L15 10" stroke="currentColor" stroke-width="2"/>
                                                <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </div>
                                        <div class="notification-content">
                                            <h5>Backup completed successfully</h5>
                                            <p>Daily backup completed at 12:00 AM</p>
                                            <span class="notification-time">2 hours ago</span>
                                        </div>
                                    </div>
                                    
                                    <div class="notification-item read" data-id="4">
                                        <div class="notification-icon">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 3V21H21" stroke="currentColor" stroke-width="2"/>
                                                <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" stroke-width="2"/>
                                            </svg>
                                        </div>
                                        <div class="notification-content">
                                            <h5>Performance report available</h5>
                                            <p>Weekly performance report is ready for review</p>
                                            <span class="notification-time">5 hours ago</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="notifications-footer">
                                    <a href="#" class="view-all-notifications">View all notifications</a>
                                </div>
                            </div>
                        </div>
                        
                        <div class="profile-dropdown">
                            <button class="profile-btn" id="profileDropdownBtn" title="Profile Menu">
                                <div class="profile-avatar">${userProfile.avatar}</div>
                                <span class="profile-name">${userProfile.name.split(' ')[0]}</span>
                                <svg class="dropdown-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </button>
                            
                            <div class="profile-dropdown-menu" id="profileDropdownMenu">
                                <div class="profile-header">
                                    <div class="profile-avatar-large">${userProfile.avatar}</div>
                                    <div class="profile-info">
                                        <h4>${userProfile.name}</h4>
                                        <p>${dashboardName} Dashboard</p>
                                        <p class="profile-email">${userProfile.email}</p>
                                    </div>
                                </div>
                                <div class="dropdown-divider"></div>
                                <ul class="dropdown-menu-list">
                                    <li><a href="#" class="dropdown-item" id="viewProfile">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        View Profile
                                    </a></li>
                                    <li><a href="#" class="dropdown-item" id="accountSettings">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                                            <path d="M19.4 15A1.65 1.65 0 0 0 20.25 13.5L21.5 12L20.25 10.5A1.65 1.65 0 0 0 19.4 9L18.75 7.5A1.65 1.65 0 0 0 17.25 6.75L15.75 6A1.65 1.65 0 0 0 14.25 6.75L12 8L9.75 6.75A1.65 1.65 0 0 0 8.25 6L6.75 6.75A1.65 1.65 0 0 0 5.25 7.5L4.6 9A1.65 1.65 0 0 0 3.75 10.5L2.5 12L3.75 13.5A1.65 1.65 0 0 0 4.6 15L5.25 16.5A1.65 1.65 0 0 0 6.75 17.25L8.25 18A1.65 1.65 0 0 0 9.75 17.25L12 16L14.25 17.25A1.65 1.65 0 0 0 15.75 18L17.25 17.25A1.65 1.65 0 0 0 18.75 16.5L19.4 15Z" stroke="currentColor" stroke-width="2"/>
                                        </svg>
                                        Account Settings
                                    </a></li>
                                    <li><a href="#" class="dropdown-item" id="securitySettings">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" stroke-width="2"/>
                                            <circle cx="12" cy="16" r="1" stroke="currentColor" stroke-width="2"/>
                                            <path d="M7 11V7A5 5 0 0 1 17 7V11" stroke="currentColor" stroke-width="2"/>
                                        </svg>
                                        Security
                                    </a></li>
                                    <li><a href="#" class="dropdown-item" id="helpSupport">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                                            <path d="M9.09 9A3 3 0 0 1 15 9C15 12 12 13 12 13" stroke="currentColor" stroke-width="2"/>
                                            <path d="M12 17H12.01" stroke="currentColor" stroke-width="2"/>
                                        </svg>
                                        Help & Support
                                    </a></li>
                                    <li class="dropdown-divider"></li>
                                    <li><a href="${basePath}login.html" class="dropdown-item logout" id="logoutBtn">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <polyline points="16,17 21,12 16,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                            <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                        </svg>
                                        Sign Out
                                    </a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Sidebar Overlay for Mobile -->
                <div class="sidebar-overlay" id="sidebarOverlay"></div>
            </nav>
        `;
    }

    createSidebar() {
        const existingSidebar = document.querySelector('.sidebar');
        if (existingSidebar) {
            this.updateSidebarContent(existingSidebar);
        } else {
            const sidebar = document.createElement('aside');
            sidebar.className = 'sidebar';
            sidebar.id = 'dashboardSidebar';
            sidebar.innerHTML = this.generateSidebarHTML();
            
            // Insert after top navbar
            const dashboardContainer = document.querySelector('.dashboard-container');
            if (dashboardContainer) {
                dashboardContainer.insertBefore(sidebar, dashboardContainer.firstChild);
            } else {
                document.body.appendChild(sidebar);
            }
        }
    }

    updateSidebarContent(sidebar) {
        sidebar.innerHTML = this.generateSidebarHTML();
    }

    generateSidebarHTML() {
        const { dashboardType } = this.config;
        const isVZone = dashboardType === 'v-zone';
        const basePath = this.getBasePath();
        
        const menuItems = isVZone ? this.getVZoneMenuItems() : this.getXZoneMenuItems();
        
        return `
            <nav class="sidebar-nav">
                <ul>
                    ${menuItems.map(item => this.generateMenuItem(item)).join('')}
                </ul>
            </nav>
        `;
    }

    getVZoneMenuItems() {
        const basePath = this.getBasePath();
        const dashboardPath = this.getDashboardPath();
        
        return [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: `${dashboardPath}index.html`,
                tooltip: 'Dashboard Overview'
            },
            {
                id: 'verification',
                label: 'Verification',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                submenu: [
                    { label: 'Add Details', href: `${dashboardPath}add-exist-details.html` },
                    { label: 'Simple Add', href: `${dashboardPath}add-exist-details-simple.html` },
                    { label: 'Verification Requests', href: `${dashboardPath}verification-request.html` }
                ],
                tooltip: 'Verification Management'
            },
            {
                id: 'rating',
                label: 'Employee Rating',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>`,
                href: `${dashboardPath}rate-employee.html`,
                tooltip: 'Rate Employees'
            },
            {
                id: 'test',
                label: 'Test Page',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 2V8H2L16 22V16H22L8 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: `${dashboardPath}test-page.html`,
                tooltip: 'Test Features'
            },
            {
                id: 'home',
                label: 'Back to Home',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: `${basePath}index.html`,
                external: true,
                tooltip: 'Return to Homepage'
            }
        ];
    }

    getXZoneMenuItems() {
        const basePath = this.getBasePath();
        const dashboardPath = this.getDashboardPath();
        
        return [
            {
                id: 'overview',
                label: 'Overview',
                icon: '🏠',
                href: `${dashboardPath}index.html`,
                tooltip: 'Dashboard Overview'
            },
            {
                id: 'analytics',
                label: 'Analytics',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3V21H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9 9L12 6L16 10L20 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: '#analytics',
                tooltip: 'Analytics & Reports'
            },
            {
                id: 'users',
                label: 'User Management',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M23 21V19C23 18.1332 22.7361 17.3024 22.2512 16.6193C21.7664 15.9361 21.0872 15.4429 20.3127 15.2134" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M16 3.13A4.001 4.001 0 0 1 16 10.87" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: '#users',
                tooltip: 'Manage Users'
            },
            {
                id: 'reports',
                label: 'Reports',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11H15L17 21H7L9 11Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M12 11V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M3 11H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: '#reports',
                tooltip: 'Generate Reports'
            },
            {
                id: 'settings',
                label: 'Settings',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2"/>
                    <path d="M19.4 15C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.82L19.79 16.88C19.976 17.0657 20.1235 17.2863 20.2241 17.5291C20.3248 17.7719 20.3766 18.0322 20.3766 18.295C20.3766 18.5578 20.3248 18.8181 20.2241 19.0609C20.1235 19.3037 19.976 19.5243 19.79 19.71C19.6043 19.896 19.3837 20.0435 19.1409 20.1441C18.8981 20.2448 18.6378 20.2966 18.375 20.2966C18.1122 20.2966 17.8519 20.2448 17.6091 20.1441C17.3663 20.0435 17.1457 19.896 16.96 19.71L16.9 19.65C16.6643 19.4195 16.365 19.2648 16.0406 19.206C15.7162 19.1472 15.3816 19.1869 15.08 19.32C14.7842 19.4468 14.532 19.6572 14.3543 19.9255C14.1766 20.1938 14.0813 20.5082 14.08 20.83V21C14.08 21.5304 13.8693 22.0391 13.4942 22.4142C13.1191 22.7893 12.6104 23 12.08 23C11.5496 23 11.0409 22.7893 10.6658 22.4142C10.2907 22.0391 10.08 21.5304 10.08 21V20.91C10.0723 20.579 9.96512 20.2583 9.77251 19.9887C9.5799 19.7191 9.31074 19.5124 9 19.39C8.69838 19.2569 8.36381 19.2172 8.03941 19.276C7.71502 19.3348 7.41568 19.4895 7.18 19.72L7.12 19.78C6.93425 19.966 6.71368 20.1135 6.47088 20.2141C6.22808 20.3148 5.96783 20.3666 5.705 20.3666C5.44217 20.3666 5.18192 20.3148 4.93912 20.2141C4.69632 20.1135 4.47575 19.966 4.29 19.78C4.10405 19.5943 3.95653 19.3737 3.85588 19.1309C3.75523 18.8881 3.70343 18.6278 3.70343 18.365C3.70343 18.1022 3.75523 17.8419 3.85588 17.5991C3.95653 17.3563 4.10405 17.1357 4.29 16.95L4.35 16.89C4.58054 16.6543 4.73519 16.355 4.794 16.0306C4.85282 15.7062 4.81312 15.3716 4.68 15.07C4.55324 14.7742 4.34276 14.522 4.07447 14.3443C3.80618 14.1666 3.49179 14.0713 3.17 14.07H3C2.46957 14.07 1.96086 13.8593 1.58579 13.4842C1.21071 13.1091 1 12.6004 1 12.07C1 11.5396 1.21071 11.0309 1.58579 10.6558C1.96086 10.2807 2.46957 10.07 3 10.07H3.09C3.42099 10.0623 3.742 9.95512 4.01165 9.76251C4.28131 9.5699 4.48758 9.30074 4.61 8.99C4.74312 8.68838 4.78282 8.35381 4.724 8.02941C4.66519 7.70502 4.51054 7.40568 4.28 7.17L4.22 7.11C4.03405 6.92425 3.88653 6.70368 3.78588 6.46088C3.68523 6.21808 3.63343 5.95783 3.63343 5.695C3.63343 5.43217 3.68523 5.17192 3.78588 4.92912C3.88653 4.68632 4.03405 4.46575 4.22 4.28C4.40575 4.09405 4.62632 3.94653 4.86912 3.84588C5.11192 3.74523 5.37217 3.69343 5.635 3.69343C5.89783 3.69343 6.15808 3.74523 6.40088 3.84588C6.64368 3.94653 6.86425 4.09405 7.05 4.28L7.11 4.34C7.34568 4.57054 7.64502 4.72519 7.96941 4.784C8.29381 4.84282 8.62838 4.80312 8.93 4.67H9C9.29577 4.54324 9.54802 4.33276 9.72569 4.06447C9.90337 3.79618 9.99872 3.48179 10 3.16V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0013 3.41179 14.0966 3.72618 14.2743 3.99447C14.452 4.26276 14.7042 4.47324 15 4.6C15.3016 4.73312 15.6362 4.77282 15.9606 4.714C16.285 4.65519 16.5843 4.50054 16.82 4.27L16.88 4.21C17.0657 4.02405 17.2863 3.87653 17.5291 3.77588C17.7719 3.67523 18.0322 3.62343 18.295 3.62343C18.5578 3.62343 18.8181 3.67523 19.0609 3.77588C19.3037 3.87653 19.5243 4.02405 19.71 4.21C19.896 4.39575 20.0435 4.61632 20.1441 4.85912C20.2448 5.10192 20.2966 5.36217 20.2966 5.625C20.2966 5.88783 20.2448 6.14808 20.1441 6.39088C20.0435 6.63368 19.896 6.85425 19.71 7.04L19.65 7.1C19.4195 7.33568 19.2648 7.63502 19.206 7.95941C19.1472 8.28381 19.1869 8.61838 19.32 8.92V9C19.4468 9.29577 19.6572 9.54802 19.9255 9.72569C20.1938 9.90337 20.5082 9.99872 20.83 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.5882 14.0013 20.2738 14.0966 20.0055 14.2743C19.7372 14.452 19.5268 14.7042 19.4 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: '#settings',
                tooltip: 'System Settings'
            },
            {
                id: 'home',
                label: 'Back to Home',
                icon: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>`,
                href: `${basePath}index.html`,
                external: true,
                tooltip: 'Return to Homepage'
            }
        ];
    }

    generateMenuItem(item) {
        const isActive = this.config.currentPage === item.id;
        const activeClass = isActive ? 'active' : '';
        
        if (item.submenu) {
            return `
                <li class="nav-accordion ${activeClass}">
                    <a href="#" class="nav-link accordion-toggle" data-tooltip="${item.tooltip}">
                        <span class="nav-icon">${item.icon}</span>
                        <span class="nav-text">${item.label}</span>
                        <svg class="accordion-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <polyline points="6,9 12,15 18,9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </a>
                    <ul class="accordion-submenu">
                        ${item.submenu.map(subItem => `
                            <li><a href="${subItem.href}" class="nav-link submenu-link">
                                <span class="nav-text">${subItem.label}</span>
                            </a></li>
                        `).join('')}
                    </ul>
                </li>
            `;
        }
        
        return `
            <li>
                <a href="${item.href}" class="nav-link ${activeClass} ${item.external ? 'external' : ''}" data-tooltip="${item.tooltip}">
                    <span class="nav-icon">${item.icon}</span>
                    <span class="nav-text">${item.label}</span>
                </a>
            </li>
        `;
    }

    getBasePath() {
        // Determine if we're in a subdirectory (VZoneDashboard or XZoneDashboard)
        const currentPath = window.location.pathname;
        if (currentPath.includes('/VZoneDashboard/') || currentPath.includes('/XZoneDashboard/')) {
            return '../';
        }
        return './';
    }

    getDashboardPath() {
        const { dashboardType } = this.config;
        const currentPath = window.location.pathname;
        
        if (currentPath.includes('/VZoneDashboard/') || currentPath.includes('/XZoneDashboard/')) {
            return './';
        }
        
        return dashboardType === 'v-zone' ? './VZoneDashboard/' : './XZoneDashboard/';
    }

    bindEvents() {
        this.bindProfileDropdown();
        this.bindMobileMenu();
        this.bindSidebarAccordion();
        this.bindNotifications();
        this.bindScrollEffects();
    }

    bindProfileDropdown() {
        const profileBtn = document.getElementById('profileDropdownBtn');
        const profileMenu = document.getElementById('profileDropdownMenu');
        
        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                profileBtn.classList.toggle('active');
                profileMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileBtn.classList.remove('active');
                    profileMenu.classList.remove('show');
                }
            });
        }
    }

    bindMobileMenu() {
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('show');
                sidebarOverlay.classList.toggle('show');
                document.body.classList.toggle('sidebar-open');
            });
            
            if (sidebarOverlay) {
                sidebarOverlay.addEventListener('click', () => {
                    sidebar.classList.remove('show');
                    sidebarOverlay.classList.remove('show');
                    document.body.classList.remove('sidebar-open');
                });
            }
        }
    }

    bindSidebarAccordion() {
        const accordionToggles = document.querySelectorAll('.accordion-toggle');
        
        accordionToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const accordion = toggle.closest('.nav-accordion');
                const isActive = accordion.classList.contains('active');
                
                // Close all other accordions
                document.querySelectorAll('.nav-accordion').forEach(acc => {
                    acc.classList.remove('active');
                });
                
                // Toggle current accordion
                if (!isActive) {
                    accordion.classList.add('active');
                }
            });
        });
    }

    bindNotifications() {
        const notificationsBtn = document.getElementById('notificationsBtn');
        const notificationsMenu = document.getElementById('notificationsDropdownMenu');
        const markAllReadBtn = document.getElementById('markAllRead');
        
        if (notificationsBtn && notificationsMenu) {
            notificationsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Close profile dropdown if open
                const profileBtn = document.getElementById('profileDropdownBtn');
                const profileMenu = document.getElementById('profileDropdownMenu');
                if (profileBtn && profileMenu) {
                    profileBtn.classList.remove('active');
                    profileMenu.classList.remove('show');
                }
                
                notificationsBtn.classList.toggle('active');
                notificationsMenu.classList.toggle('show');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!notificationsBtn.contains(e.target) && !notificationsMenu.contains(e.target)) {
                    notificationsBtn.classList.remove('active');
                    notificationsMenu.classList.remove('show');
                }
            });
            
            // Mark all as read functionality
            if (markAllReadBtn) {
                markAllReadBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    const unreadItems = notificationsMenu.querySelectorAll('.notification-item.unread');
                    unreadItems.forEach(item => {
                        item.classList.remove('unread');
                        item.classList.add('read');
                    });
                    
                    // Update notification badge
                    const badge = notificationsBtn.querySelector('.notification-badge');
                    if (badge) {
                        badge.textContent = '0';
                        badge.style.display = 'none';
                    }
                    
                    markAllReadBtn.style.display = 'none';
                });
            }
            
            // Individual notification click handlers
            const notificationItems = notificationsMenu.querySelectorAll('.notification-item');
            notificationItems.forEach(item => {
                item.addEventListener('click', (e) => {
                    if (item.classList.contains('unread')) {
                        item.classList.remove('unread');
                        item.classList.add('read');
                        
                        // Update notification count
                        const badge = notificationsBtn.querySelector('.notification-badge');
                        if (badge) {
                            let count = parseInt(badge.textContent) - 1;
                            badge.textContent = count.toString();
                            if (count === 0) {
                                badge.style.display = 'none';
                                if (markAllReadBtn) markAllReadBtn.style.display = 'none';
                            }
                        }
                    }
                });
            });
        }
    }

    bindScrollEffects() {
        const navbar = document.getElementById('dashboardTopNav');
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Hide navbar on scroll down, show on scroll up
            if (scrollTop > lastScrollTop && scrollTop > 200) {
                navbar.classList.add('hidden');
            } else {
                navbar.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    bindMobileToggle() {
        // Mobile sidebar toggle functionality is handled in the separate dashboard files
        // This method exists for consistency but functionality is in dashboard.js
    }

    bindNavigationLinks() {
        // Bind accordion functionality
        document.addEventListener('click', (e) => {
            const accordionToggle = e.target.closest('.accordion-toggle');
            if (accordionToggle) {
                e.preventDefault();
                const accordionItem = accordionToggle.closest('.nav-accordion');
                if (accordionItem) {
                    this.toggleAccordion(accordionItem);
                }
            }
        });
    }

    toggleAccordion(accordionItem) {
        const isExpanded = accordionItem.classList.contains('expanded');
        
        // Close all other accordions
        document.querySelectorAll('.nav-accordion.expanded').forEach(item => {
            if (item !== accordionItem) {
                item.classList.remove('expanded');
            }
        });
        
        // Toggle current accordion
        accordionItem.classList.toggle('expanded', !isExpanded);
        
        // Save accordion state
        const accordionId = accordionItem.querySelector('.accordion-toggle').closest('li').id || 
                           accordionItem.querySelector('.accordion-toggle').getAttribute('data-id');
        if (accordionId) {
            localStorage.setItem(`accordion-${accordionId}`, !isExpanded);
        }
    }

    restoreAccordionStates() {
        document.querySelectorAll('.nav-accordion').forEach(accordion => {
            const accordionId = accordion.id || accordion.getAttribute('data-id');
            if (accordionId) {
                const isExpanded = localStorage.getItem(`accordion-${accordionId}`) === 'true';
                if (isExpanded) {
                    accordion.classList.add('expanded');
                }
            }
        });
    }

    bindProfileDropdown() {
        const profileBtn = document.getElementById('profileDropdownBtn');
        const profileMenu = document.getElementById('profileDropdownMenu');
        
        if (profileBtn && profileMenu) {
            profileBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                profileMenu.classList.toggle('show');
                
                // Close notifications if open
                const notificationMenu = document.getElementById('notificationDropdownMenu');
                if (notificationMenu) {
                    notificationMenu.classList.remove('show');
                }
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!profileBtn.contains(e.target) && !profileMenu.contains(e.target)) {
                    profileMenu.classList.remove('show');
                }
            });
        }
    }

    bindSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const sidebar = document.getElementById('dashboardSidebar');
        
        if (sidebarToggle && sidebar) {
            // Load saved sidebar state
            const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
            if (isCollapsed) {
                sidebar.classList.add('collapsed');
            }
            
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                sidebar.classList.toggle('collapsed');
                
                // Save state
                const collapsed = sidebar.classList.contains('collapsed');
                localStorage.setItem('sidebarCollapsed', collapsed);
                
                // Close all accordions when collapsing
                if (collapsed) {
                    document.querySelectorAll('.nav-accordion.expanded').forEach(accordion => {
                        accordion.classList.remove('expanded');
                    });
                } else {
                    // Restore accordion states when expanding
                    this.restoreAccordionStates();
                }
            });
        }
    }

    updateActiveStates() {
        // Update active states based on current page
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link:not(.accordion-toggle)');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.split('/').pop())) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Public methods for external use
    setCurrentPage(pageId) {
        this.config.currentPage = pageId;
        this.updateActiveStates();
    }

    updateUserProfile(userProfile) {
        this.config.userProfile = { ...this.config.userProfile, ...userProfile };
        this.createTopNavbar();
    }

    toggleSidebar() {
        const sidebar = document.getElementById('dashboardSidebar');
        if (sidebar) {
            sidebar.classList.toggle('collapsed');
        }
    }
}

// Auto-initialize based on page context
document.addEventListener('DOMContentLoaded', () => {
    // Don't auto-initialize if already initialized
    if (window.dashboardNavbar) return;
    
    // Determine dashboard type from URL or data attribute
    const currentPath = window.location.pathname;
    let dashboardType = 'v-zone';
    let currentPage = 'dashboard';
    
    if (currentPath.includes('/XZoneDashboard/')) {
        dashboardType = 'x-zone';
    }
    
    // Extract current page from filename
    const filename = currentPath.split('/').pop().replace('.html', '');
    if (filename && filename !== 'index') {
        currentPage = filename;
    }
    
    // Initialize the navbar
    window.dashboardNavbar = new IndependentDashboardNavbar({
        dashboardType,
        currentPage,
        userProfile: {
            name: 'John Doe',
            email: 'john.doe@verifyzone.com',
            avatar: 'JD'
        }
    });
});

// Export for manual initialization
if (typeof module !== 'undefined' && module.exports) {
    module.exports = IndependentDashboardNavbar;
}
