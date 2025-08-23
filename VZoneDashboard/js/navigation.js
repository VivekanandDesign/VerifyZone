/**
 * Enhanced Navigation System for VZone Dashboard
 * Handles dropdown menus, page routing, and navigation state
 */

class VZoneNavigation {
    constructor() {
        this.currentPage = 'dashboard';
        this.dropdowns = new Map();
        this.init();
    }

    init() {
        this.setupDropdowns();
        this.setupNavigation();
        this.setupPageRouting();
        this.loadCurrentPage();
    }

    setupDropdowns() {
        // Initialize all dropdown elements
        const dropdownElements = document.querySelectorAll('.nav-item.dropdown');
        
        dropdownElements.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            const id = dropdown.id;
            
            this.dropdowns.set(id, {
                element: dropdown,
                toggle: toggle,
                menu: menu,
                isOpen: false
            });

            // Add click event for dropdown toggle
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleDropdown(id);
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });

        // Handle dropdown item clicks
        const dropdownItems = document.querySelectorAll('.dropdown-item');
        
        dropdownItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                if (page) {
                    this.navigateToPage(page);
                    this.closeAllDropdowns();
                }
            });
        });
    }

    setupNavigation() {
        // Handle main navigation links
        document.querySelectorAll('.nav-link:not(.dropdown-toggle)').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const linkId = link.id;
                
                switch(linkId) {
                    case 'dashboardLink':
                        this.navigateToPage('dashboard');
                        break;
                    case 'autopilotLink':
                        this.navigateToPage('autopilot');
                        break;
                    default:
                        console.log(`Navigation to ${linkId} not implemented yet`);
                }
            });
        });
    }

    setupPageRouting() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.page) {
                this.loadPage(e.state.page, false);
            }
        });
    }

    toggleDropdown(dropdownId) {
        const dropdown = this.dropdowns.get(dropdownId);
        if (!dropdown) return;

        // Close other dropdowns first
        this.dropdowns.forEach((otherDropdown, otherId) => {
            if (otherId !== dropdownId && otherDropdown.isOpen) {
                this.closeDropdown(otherId);
            }
        });

        // Toggle current dropdown
        if (dropdown.isOpen) {
            this.closeDropdown(dropdownId);
        } else {
            this.openDropdown(dropdownId);
        }
    }

    openDropdown(dropdownId) {
        const dropdown = this.dropdowns.get(dropdownId);
        if (!dropdown) return;

        dropdown.element.classList.add('active');
        dropdown.isOpen = true;
        
        // Add animation class
        setTimeout(() => {
            dropdown.menu.style.maxHeight = dropdown.menu.scrollHeight + 'px';
        }, 10);
    }

    closeDropdown(dropdownId) {
        const dropdown = this.dropdowns.get(dropdownId);
        if (!dropdown) return;

        dropdown.element.classList.remove('active');
        dropdown.isOpen = false;
        dropdown.menu.style.maxHeight = '';
    }

    closeAllDropdowns() {
        this.dropdowns.forEach((dropdown, id) => {
            if (dropdown.isOpen) {
                this.closeDropdown(id);
            }
        });
    }

    navigateToPage(page) {
        // Update URL without page reload
        const url = new URL(window.location);
        url.searchParams.set('page', page);
        window.history.pushState({ page: page }, '', url);
        
        // Load the page content
        this.loadPage(page);
        
        // Update navigation state
        this.updateNavigationState(page);
    }

    loadPage(page, updateHistory = true) {
        this.currentPage = page;
        
        // Show loading state
        this.showLoadingState();
        
        // Simulate page loading
        setTimeout(() => {
            this.renderPageContent(page);
            this.hideLoadingState();
        }, 300);
    }

    loadCurrentPage() {
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 'dashboard';
        this.loadPage(page, false);
    }

    updateNavigationState(page) {
        // Update active states
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        // Set active state based on current page
        if (page === 'dashboard') {
            document.getElementById('dashboardLink').classList.add('active');
        } else if (page === 'autopilot') {
            document.getElementById('autopilotLink').classList.add('active');
        }
    }

    showLoadingState() {
        // Create or show loading overlay
        let loader = document.getElementById('page-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'page-loader';
            loader.className = 'page-loader';
            loader.innerHTML = `
                <div class="loader-content">
                    <div class="loader-spinner"></div>
                    <div class="loader-text">Loading...</div>
                </div>
            `;
            document.body.appendChild(loader);
        }
        loader.style.display = 'flex';
    }

    hideLoadingState() {
        const loader = document.getElementById('page-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }

    renderPageContent(page) {
        const mainContent = document.querySelector('.dashboard-container');
        if (!mainContent) return;

        // Handle specific pages that have external HTML files
        if (page === 'profile' || page === 'settings') {
            this.loadExternalPage(page);
        } else if (page === 'ex-zone/add-exit-details') {
            this.loadExternalPage(page);
        } else if (page === 'dashboard') {
            this.loadDashboardContent();
        } else {
            this.loadFeaturePage(page);
        }
        
        // Add page-specific body class for styling
        document.body.className = document.body.className.replace(/page-\S+/g, '');
        document.body.classList.add(`page-${page.replace('/', '-')}`);
    }

    async loadExternalPage(page) {
        const mainContent = document.querySelector('.dashboard-container');
        if (!mainContent) return;

        try {
            const response = await fetch(`pages/${page}.html`);
            if (response.ok) {
                const html = await response.text();
                
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                const pageContent = tempDiv.querySelector('.page-content');
                if (pageContent) {
                    mainContent.innerHTML = pageContent.outerHTML;
                    
                    // Execute any scripts in the loaded content
                    const scripts = tempDiv.querySelectorAll('script');
                    scripts.forEach(script => {
                        const newScript = document.createElement('script');
                        if (script.src) {
                            newScript.src = script.src;
                        } else {
                            newScript.textContent = script.textContent;
                        }
                        document.head.appendChild(newScript);
                        
                        setTimeout(() => {
                            if (newScript.parentNode) {
                                newScript.parentNode.removeChild(newScript);
                            }
                        }, 100);
                    });
                }
            } else {
                throw new Error(`Failed to load page: ${response.status}`);
            }
        } catch (error) {
            console.error(`Error loading page ${page}:`, error);
            this.loadFeaturePage(page);
        }
    }

    loadFeaturePage(page) {
        const mainContent = document.querySelector('.dashboard-container');
        if (!mainContent) return;

        const pageConfig = this.getPageConfig(page);
        
        mainContent.innerHTML = `
            <div class="page-content">
                <div class="page-header">
                    <div class="breadcrumb">
                        <span>Dashboard</span>
                        <span class="separator">/</span>
                        <span class="current">${pageConfig.title}</span>
                    </div>
                    <h1>${pageConfig.title}</h1>
                    <p>${pageConfig.description}</p>
                </div>
                
                <div class="feature-coming-soon">
                    <div class="coming-soon-content">
                        <div class="coming-soon-icon">
                            <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                        </div>
                        <h2>Feature Coming Soon</h2>
                        <p>This ${pageConfig.title.toLowerCase()} feature is currently under development and will be available in a future update.</p>
                        <div class="feature-actions">
                            <button onclick="window.vzoneNavigation.navigateToPage('dashboard')" class="btn btn-primary">
                                Return to Dashboard
                            </button>
                            <button onclick="window.vzoneNavigation.navigateToPage('profile')" class="btn btn-outline">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    loadDashboardContent() {
        const mainContent = document.querySelector('.dashboard-container');
        if (!mainContent) return;

        const dashboardHTML = `
            <!-- Dashboard Header -->
            <header class="dashboard-header">
                <div class="header-content">
                    <h1>VZone Analytics</h1>
                    <p>Real-time insights and performance metrics</p>
                </div>
                <div class="header-actions">
                    <div class="period-selector">
                        <select id="timePeriod">
                            <option value="7d">Last 7 days</option>
                            <option value="30d" selected>Last 30 days</option>
                            <option value="90d">Last 90 days</option>
                        </select>
                    </div>
                </div>
            </header>

            <!-- Quick Stats -->
            <section class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 id="reVerificationCount">142</h3>
                        <p>Re-verification completed</p>
                        <small class="stat-date">Last updated: Aug 23, 2025</small>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 id="verificationRequestCount">89</h3>
                        <p>Verification request received</p>
                        <small class="stat-date">Last received: Aug 23, 2025</small>
                    </div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                        </svg>
                    </div>
                    <div class="stat-content">
                        <h3 id="newRequestCount">34</h3>
                        <p>New request received</p>
                        <small class="stat-date">Last received: Aug 23, 2025</small>
                    </div>
                </div>
            </section>

            <!-- Dashboard Content Grid -->
            <section class="dashboard-grid">
                <!-- Analytics Chart - Full Width -->
                <div class="dashboard-card chart-card full-width">
                    <div class="card-header">
                        <h3>Analytics</h3>
                        <div class="chart-legend">
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #361968;"></span>
                                <span class="legend-label">Verifications</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #9967d1;"></span>
                                <span class="legend-label">Re-verifications</span>
                            </div>
                            <div class="legend-item">
                                <span class="legend-color" style="background-color: #4caf50;"></span>
                                <span class="legend-label">Approvals</span>
                            </div>
                        </div>
                        <div class="chart-controls">
                            <button class="btn btn-sm btn-outline active" onclick="updateChartsForPeriod('7d')">7 Days</button>
                            <button class="btn btn-sm btn-outline" onclick="updateChartsForPeriod('30d')">30 Days</button>
                            <button class="btn btn-sm btn-outline" onclick="updateChartsForPeriod('90d')">90 Days</button>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="userGrowthChart"></canvas>
                    </div>
                </div>

                <!-- Real-time Analytics - Half Width -->
                <div class="dashboard-card half-width">
                    <div class="card-header">
                        <h3>Real-time Analytics</h3>
                        <div class="status-indicator">
                            <span class="status-dot active"></span>
                            <span>Live</span>
                        </div>
                    </div>
                    <div class="realtime-stats" id="realtimeStats">
                        <!-- Real-time stats will be populated by JavaScript -->
                    </div>
                </div>

                <!-- Performance Metrics - Half Width -->
                <div class="dashboard-card half-width">
                    <div class="card-header">
                        <h3>Data Metrics</h3>
                    </div>
                    <div class="metrics-grid">
                        <div class="metric-item">
                            <div class="metric-label">Page Load Time</div>
                            <div class="metric-value">1.2s</div>
                            <div class="metric-progress">
                                <div class="progress-bar" style="width: 85%;"></div>
                            </div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Bounce Rate</div>
                            <div class="metric-value">23.5%</div>
                            <div class="metric-progress">
                                <div class="progress-bar" style="width: 76%;"></div>
                            </div>
                        </div>
                        <div class="metric-item">
                            <div class="metric-label">Conversion Rate</div>
                            <div class="metric-value">4.2%</div>
                            <div class="metric-progress">
                                <div class="progress-bar" style="width: 68%;"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        `;
        
        mainContent.innerHTML = dashboardHTML;

        // Reinitialize charts if they exist
        if (window.initializeCharts) {
            setTimeout(() => {
                window.initializeCharts();
            }, 100);
        }
    }

    getPageConfig(page) {
        const configs = {
            'dashboard': {
                title: 'Dashboard',
                description: 'Analytics and overview of all activities'
            },
            'profile': {
                title: 'Profile',
                description: 'Manage your personal information and account settings'
            },
            'settings': {
                title: 'Settings',
                description: 'Configure your dashboard preferences and system settings'
            },
            'ex-zone/add-exit-details': {
                title: 'Add Exit Details',
                description: 'Add new employee exit information and documentation'
            },
            'ex-zone/verification-request': {
                title: 'Verification Request',
                description: 'Manage verification requests for exit processes'
            },
            'ex-zone/new-requests': {
                title: 'New Request Received',
                description: 'View and process newly received exit requests'
            },
            'ex-zone/search-candidate': {
                title: 'Search Candidate',
                description: 'Search for employee candidates and their exit information'
            },
            'ex-zone/bulk-upload': {
                title: 'Bulk Upload',
                description: 'Upload multiple exit records in batch format'
            },
            'ex-zone/exit-interview': {
                title: 'Exit Interview Management',
                description: 'Manage and schedule exit interviews with departing employees'
            },
            'ex-zone/exit-status': {
                title: 'Employee Exit Status',
                description: 'Track and monitor the status of employee exits'
            },
            'ex-zone/exit-archive': {
                title: 'Exit Document Archive',
                description: 'Access archived exit documents and records'
            },
            'verification/queue': {
                title: 'Background Verification Queue',
                description: 'View and manage pending background verification requests'
            },
            'verification/documents': {
                title: 'Document Verification',
                description: 'Verify and validate employee documents'
            },
            'verification/references': {
                title: 'Reference Check Status',
                description: 'Track the status of reference checks and approvals'
            },
            'verification/timeline': {
                title: 'Verification Timeline',
                description: 'View timeline and progress of verification processes'
            },
            'verification/failed-review': {
                title: 'Failed Verification Review',
                description: 'Review and reprocess failed verification attempts'
            },
            'verification/templates': {
                title: 'Verification Templates',
                description: 'Manage templates for verification processes'
            },
            'discrepancies/active': {
                title: 'Active Discrepancies',
                description: 'View and resolve active discrepancies in the system'
            },
            'discrepancies/resolved': {
                title: 'Resolved Issues',
                description: 'Review previously resolved discrepancies and issues'
            },
            'discrepancies/escalation': {
                title: 'Escalation Queue',
                description: 'Manage escalated issues requiring attention'
            },
            'discrepancies/reports': {
                title: 'Discrepancy Reports',
                description: 'Generate and view discrepancy analysis reports'
            },
            'autopilot': {
                title: 'Active Autopilot',
                description: 'Automated system monitoring and management'
            }
        };

        return configs[page] || {
            title: 'Page',
            description: 'This page is under development'
        };
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.vzoneNavigation = new VZoneNavigation();
});

// Add CSS for loading states and coming soon pages
const style = document.createElement('style');
style.textContent = `
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(54, 25, 104, 0.95);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loader-content {
    text-align: center;
    color: white;
}

.loader-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #9967d1;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto 16px;
}

.loader-text {
    font-size: 16px;
    font-weight: 500;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.feature-coming-soon {
    text-align: center;
    padding: 60px 20px;
    max-width: 600px;
    margin: 0 auto;
}

.coming-soon-icon {
    color: #9967d1;
    margin-bottom: 24px;
}

.feature-coming-soon h2 {
    color: #361968;
    margin-bottom: 16px;
    font-size: 28px;
}

.feature-coming-soon p {
    color: #666;
    margin-bottom: 32px;
    font-size: 16px;
    line-height: 1.6;
}

.feature-actions {
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

.feature-actions .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    border: 2px solid;
    cursor: pointer;
}

.feature-actions .btn-primary {
    background: #361968;
    color: white;
    border-color: #361968;
}

.feature-actions .btn-primary:hover {
    background: #2d1556;
    border-color: #2d1556;
}

.feature-actions .btn-outline {
    background: transparent;
    color: #361968;
    border-color: #361968;
}

.feature-actions .btn-outline:hover {
    background: #361968;
    color: white;
}
`;
document.head.appendChild(style);
