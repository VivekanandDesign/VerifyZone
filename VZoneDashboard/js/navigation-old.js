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
        console.log('Found dropdown elements:', dropdownElements.length);
        
        dropdownElements.forEach(dropdown => {
            const toggle = dropdown.querySelector('.dropdown-toggle');
            const menu = dropdown.querySelector('.dropdown-menu');
            const id = dropdown.id;
            
            console.log('Setting up dropdown:', id, toggle, menu);
            
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
                console.log('Dropdown toggle clicked:', id);
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
        console.log('Found dropdown items:', dropdownItems.length);
        
        dropdownItems.forEach(item => {
            console.log('Setting up dropdown item:', item, 'data-page:', item.dataset.page);
            item.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Dropdown item clicked:', item, 'page:', item.dataset.page);
                const page = item.dataset.page;
                if (page) {
                    console.log('Navigating to page:', page);
                    this.navigateToPage(page);
                    this.closeAllDropdowns();
                } else {
                    console.log('No page attribute found');
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
        
        // Simulate page loading (replace with actual page loading logic)
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
        // Add more page-specific active states as needed
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
        // This method renders different page content
        const mainContent = document.querySelector('.dashboard-container');
        if (!mainContent) return;

        // Handle specific pages that have external HTML files
        if (page === 'profile' || page === 'settings') {
            this.loadExternalPage(page);
        } else if (page === 'ex-zone/add-exit-details') {
            this.loadExternalPage(page);
        } else if (page === 'dashboard') {
            // For dashboard, show the default dashboard content
            this.loadDashboardContent();
        } else {
            // For other pages without external files, show a feature page
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
                
                // Create a temporary div to parse the HTML
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Extract the page content (everything inside the body)
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
                        
                        // Clean up - remove the script after a short delay
                        setTimeout(() => {
                            if (newScript.parentNode) {
                                newScript.parentNode.removeChild(newScript);
                            }
                        }, 100);
                    });
                    
                    // Add styles from the loaded page
                    const styles = tempDiv.querySelectorAll('style');
                    styles.forEach(style => {
                        // Check if this style is already added
                        const existingStyle = document.querySelector(`style[data-page="${page}"]`);
                        if (!existingStyle) {
                            const newStyle = document.createElement('style');
                            newStyle.setAttribute('data-page', page);
                            newStyle.textContent = style.textContent;
                            document.head.appendChild(newStyle);
                        }
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

        // Restore the original dashboard content if it was replaced
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
                                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="card-value">89</div>
                        <div class="card-trend negative">-5% from last month</div>
                    </div>

                    <div class="analytics-card">
                        <div class="card-header">
                            <h3>Completed Today</h3>
                            <div class="card-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="card-value">47</div>
                        <div class="card-trend positive">+8% from yesterday</div>
                    </div>

                    <div class="analytics-card">
                        <div class="card-header">
                            <h3>Active Discrepancies</h3>
                            <div class="card-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                                </svg>
                            </div>
                        </div>
                        <div class="card-value">12</div>
                        <div class="card-trend neutral">No change</div>
                    </div>
                </div>

                <div class="charts-section">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>Exit Request Trends</h3>
                            <div class="chart-filters">
                                <button class="filter-btn active" data-period="7d">7D</button>
                                <button class="filter-btn" data-period="30d">30D</button>
                                <button class="filter-btn" data-period="90d">90D</button>
                            </div>
                        </div>
                        <canvas id="exitTrendsChart" width="800" height="400"></canvas>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h3>Verification Status Distribution</h3>
                        </div>
                        <canvas id="verificationStatusChart" width="400" height="400"></canvas>
                    </div>
                </div>

                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-grid">
                        <div class="action-card" onclick="window.vzoneNavigation.navigateToPage('ex-zone/add-exit-details')">
                            <div class="action-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                                </svg>
                            </div>
                            <h4>Add Exit Details</h4>
                            <p>Create new exit verification request</p>
                        </div>

                        <div class="action-card" onclick="window.vzoneNavigation.navigateToPage('verification/queue')">
                            <div class="action-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                                </svg>
                            </div>
                            <h4>Verification Queue</h4>
                            <p>Process pending verifications</p>
                        </div>

                        <div class="action-card" onclick="window.vzoneNavigation.navigateToPage('discrepancies/active')">
                            <div class="action-icon">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M13,13H11V7H13M13,17H11V15H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/>
                                </svg>
                            </div>
                            <h4>Active Discrepancies</h4>
                            <p>Review and resolve issues</p>
                        </div>
                    </div>
                </div>
            </div>
        `;

        mainContent.innerHTML = dashboardHTML;

        // Reinitialize charts if they exist
        if (window.initializeCharts) {
            setTimeout(() => {
                window.initializeCharts();
            }, 100);
        }
    }
                window.initializeCharts();
            }, 100);
        }
    }

    loadPlaceholderContent(page, pageConfig) {
        const mainContent = document.querySelector('.main-content');
        if (!mainContent) return;

        const placeholderHTML = `
            <div class="page-content">
                <div class="page-header">
                    <div class="breadcrumb">
                        <span>Dashboard</span>
                        <span class="separator">/</span>
                        <span class="current">${pageConfig.title}</span>
                    </div>
                    <h1>${pageConfig.title}</h1>
                    <p>This page is coming soon. Functionality will be implemented in future updates.</p>
                </div>

                <div class="placeholder-content">
                    <div class="placeholder-icon">
                        <svg viewBox="0 0 24 24" width="64" height="64" fill="currentColor">
                            <path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M12,6A6,6 0 0,1 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12A6,6 0 0,1 12,6M12,8A4,4 0 0,0 8,12A4,4 0 0,0 12,16A4,4 0 0,0 16,12A4,4 0 0,0 12,8Z"/>
                        </svg>
                    </div>
                    <h2>Page Under Development</h2>
                    <p>The <strong>${pageConfig.title}</strong> feature is currently being developed and will be available soon.</p>
                    <div class="placeholder-actions">
                        <button onclick="window.vzoneNavigation.navigateToPage('dashboard')" class="btn btn-primary">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>
                            </svg>
                            Return to Dashboard
                        </button>
                        <button onclick="window.vzoneNavigation.navigateToPage('ex-zone/add-exit-details')" class="btn btn-outline">
                            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                                <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"/>
                            </svg>
                            Add Exit Details
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .placeholder-content {
                    text-align: center;
                    padding: 4rem 2rem;
                    max-width: 600px;
                    margin: 0 auto;
                }

                .placeholder-icon {
                    color: #9967d1;
                    margin-bottom: 2rem;
                }

                .placeholder-content h2 {
                    color: #361968;
                    margin-bottom: 1rem;
                    font-size: 1.8rem;
                }

                .placeholder-content p {
                    color: #666;
                    font-size: 1.1rem;
                    margin-bottom: 2rem;
                    line-height: 1.6;
                }

                .placeholder-actions {
                    display: flex;
                    gap: 1rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .btn {
                    padding: 0.75rem 1.5rem;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 0.9rem;
                    text-decoration: none;
                }

                .btn-primary {
                    background: #361968;
                    color: white;
                }

                .btn-primary:hover {
                    background: #2d1556;
                    transform: translateY(-1px);
                }

                .btn-outline {
                    background: transparent;
                    color: #361968;
                    border: 2px solid #361968;
                }

                .btn-outline:hover {
                    background: #361968;
                    color: white;
                }

                @media (max-width: 768px) {
                    .placeholder-content {
                        padding: 2rem 1rem;
                    }

                    .placeholder-actions {
                        flex-direction: column;
                        align-items: center;
                    }

                    .btn {
                        width: 100%;
                        max-width: 250px;
                    }
                }
            </style>
        `;

        mainContent.innerHTML = placeholderHTML;
    }

    getPageConfig(page) {
        const pageConfigs = {
            // Dashboard
            'dashboard': { title: 'VZone Dashboard', section: 'dashboard' },
            'autopilot': { title: 'Active Autopilot', section: 'autopilot' },
            
            // User Profile & Settings
            'profile': { title: 'Profile Management', section: 'profile' },
            'settings': { title: 'System Settings', section: 'settings' },
            
            // Ex-Zone
            'ex-zone/add-exit-details': { title: 'Add Exit Details', section: 'ex-zone' },
            'ex-zone/verification-request': { title: 'Verification Request', section: 'ex-zone' },
            'ex-zone/new-requests': { title: 'New Request Received', section: 'ex-zone' },
            'ex-zone/search-candidate': { title: 'Search Candidate', section: 'ex-zone' },
            'ex-zone/bulk-upload': { title: 'Bulk Upload', section: 'ex-zone' },
            'ex-zone/exit-interview': { title: 'Exit Interview Management', section: 'ex-zone' },
            'ex-zone/exit-status': { title: 'Employee Exit Status', section: 'ex-zone' },
            'ex-zone/exit-archive': { title: 'Exit Document Archive', section: 'ex-zone' },
            
            // Verification Center
            'verification/queue': { title: 'Background Verification Queue', section: 'verification' },
            'verification/documents': { title: 'Document Verification', section: 'verification' },
            'verification/references': { title: 'Reference Check Status', section: 'verification' },
            'verification/timeline': { title: 'Verification Timeline', section: 'verification' },
            'verification/failed-review': { title: 'Failed Verification Review', section: 'verification' },
            'verification/templates': { title: 'Verification Templates', section: 'verification' },
            
            // Discrepancies
            'discrepancies/active': { title: 'Active Discrepancies', section: 'discrepancies' },
            'discrepancies/resolved': { title: 'Resolved Issues', section: 'discrepancies' },
            'discrepancies/escalation': { title: 'Escalation Queue', section: 'discrepancies' },
            'discrepancies/reports': { title: 'Discrepancy Reports', section: 'discrepancies' }
        };

        return pageConfigs[page] || { title: 'Page Not Found', section: 'unknown' };
    }

    // Utility method to get current page info
    getCurrentPage() {
        return {
            page: this.currentPage,
            config: this.getPageConfig(this.currentPage)
        };
    }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.vzoneNavigation = new VZoneNavigation();
});

// Add CSS for loading states
const loaderStyles = `
<style>
.page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(54, 25, 104, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    backdrop-filter: blur(5px);
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

/* Page-specific body classes for future styling */
.page-dashboard .analytics-card {
    display: block;
}

.page-ex-zone-add-exit-details .analytics-card,
.page-verification-queue .analytics-card {
    display: none;
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', loaderStyles);
