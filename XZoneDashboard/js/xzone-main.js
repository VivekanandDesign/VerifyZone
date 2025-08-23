// XZone Dashboard Main Application
class XZoneDashboard {
    constructor() {
        this.isInitialized = false;
        this.currentUser = null;
        this.refreshInterval = null;
        this.isMaintenanceMode = false;
    }

    async initialize() {
        try {
            // Check authentication
            RouteGuard.requireUserType('xzone');
            
            // Get current user
            this.currentUser = SessionManager.getCurrentUser();
            
            // Initialize UI
            this.initializeUI();
            this.bindEvents();
            this.loadInitialData();
            
            // Start auto-refresh
            this.startAutoRefresh();
            
            this.isInitialized = true;
            console.log('XZone Dashboard initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize XZone Dashboard:', error);
            Utils.showNotification('Failed to initialize dashboard', 'error');
        }
    }

    initializeUI() {
        // Update user display
        if (this.currentUser) {
            const userDisplayName = document.getElementById('userDisplayName');
            const userRole = document.getElementById('userRole');
            
            if (userDisplayName) {
                userDisplayName.textContent = this.currentUser.name || 'Admin User';
            }
            
            if (userRole) {
                userRole.textContent = this.currentUser.role || 'Administrator';
            }
        }

        // Initialize dropdown functionality
        this.initializeDropdowns();
        
        // Initialize search functionality
        this.initializeSearch();
        
        // Hide loading overlay
        setTimeout(() => {
            const loadingOverlay = document.getElementById('loadingOverlay');
            if (loadingOverlay) {
                loadingOverlay.classList.remove('active');
            }
        }, 1000);
    }

    initializeDropdowns() {
        const userAvatar = document.getElementById('userAvatar');
        const userDropdown = document.getElementById('userDropdown');
        const dropdown = userAvatar?.closest('.user-dropdown');

        if (userAvatar && dropdown) {
            userAvatar.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });

            // Close dropdown when clicking outside
            document.addEventListener('click', () => {
                dropdown.classList.remove('active');
            });

            // Prevent dropdown from closing when clicking inside
            userDropdown?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    initializeSearch() {
        const searchInput = document.getElementById('dashboardSearch');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.performSearch(e.target.value);
            }, 300));
        }
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // Search through dashboard content
        const searchableElements = document.querySelectorAll('[data-searchable]');
        searchableElements.forEach(element => {
            const text = element.textContent.toLowerCase();
            const matches = text.includes(query.toLowerCase());
            element.style.display = matches ? '' : 'none';
        });
        
        console.log(`Searching for: ${query}`);
    }

    bindEvents() {
        // Logout functionality
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLogout();
            });
        }

        // Refresh data button
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshDashboardData();
            });
        }

        // Time period selector
        const timePeriod = document.getElementById('timePeriod');
        if (timePeriod) {
            timePeriod.addEventListener('change', (e) => {
                this.updateDataForPeriod(e.target.value);
            });
        }

        // Quick action buttons
        this.bindQuickActions();
        
        // User management actions
        this.bindUserManagementActions();
        
        // Module filter
        const moduleFilter = document.getElementById('moduleFilter');
        if (moduleFilter) {
            moduleFilter.addEventListener('change', (e) => {
                this.filterModules(e.target.value);
            });
        }
    }

    bindQuickActions() {
        // System Backup
        const backupBtn = document.getElementById('backupSystemBtn');
        if (backupBtn) {
            backupBtn.addEventListener('click', () => {
                this.performSystemBackup();
            });
        }

        // Generate Report
        const reportBtn = document.getElementById('generateReportBtn');
        if (reportBtn) {
            reportBtn.addEventListener('click', () => {
                this.generateSystemReport();
            });
        }

        // Maintenance Mode
        const maintenanceBtn = document.getElementById('maintenanceModeBtn');
        if (maintenanceBtn) {
            maintenanceBtn.addEventListener('click', () => {
                this.toggleMaintenanceMode();
            });
        }

        // Export Data
        const exportBtn = document.getElementById('exportDataBtn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                this.exportSystemData();
            });
        }
    }

    bindUserManagementActions() {
        // Add User button
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showAddUserModal();
            });
        }

        // Clear Activities button
        const clearActivitiesBtn = document.getElementById('clearActivitiesBtn');
        if (clearActivitiesBtn) {
            clearActivitiesBtn.addEventListener('click', () => {
                this.clearAllActivities();
            });
        }
    }

    async loadInitialData() {
        try {
            // Show loading
            this.showLoading();
            
            // Load dashboard stats
            await this.loadDashboardStats();
            
            // Load user list
            await this.loadUserList();
            
            // Load system modules
            await this.loadSystemModules();
            
            // Load recent activities
            await this.loadRecentActivities();
            
            // Hide loading
            this.hideLoading();
            
            console.log('Initial data loaded successfully');
            
        } catch (error) {
            console.error('Failed to load initial data:', error);
            Utils.showNotification('Failed to load dashboard data', 'error');
            this.hideLoading();
        }
    }

    async loadDashboardStats() {
        // Simulate API call
        const stats = {
            totalUsers: 12457,
            systemHealth: 98.5,
            activeModules: 47,
            dataTransfer: '2.4TB'
        };

        // Update stats in UI
        const totalUsersEl = document.getElementById('totalUsers');
        const systemHealthEl = document.getElementById('systemHealth');
        const activeModulesEl = document.getElementById('activeModules');
        const dataTransferEl = document.getElementById('dataTransfer');

        if (totalUsersEl) totalUsersEl.textContent = stats.totalUsers.toLocaleString();
        if (systemHealthEl) systemHealthEl.textContent = `${stats.systemHealth}%`;
        if (activeModulesEl) activeModulesEl.textContent = stats.activeModules;
        if (dataTransferEl) dataTransferEl.textContent = stats.dataTransfer;
    }

    async loadUserList() {
        // This will be handled by user-management.js
        if (window.userManagement && window.userManagement.loadUsers) {
            await window.userManagement.loadUsers();
        }
    }

    async loadSystemModules() {
        // This will be handled by modules.js
        if (window.moduleManager && window.moduleManager.loadModules) {
            await window.moduleManager.loadModules();
        }
    }

    async loadRecentActivities() {
        const activities = [
            {
                id: 1,
                title: 'System Backup Completed',
                description: 'Daily backup process finished successfully',
                time: '2 minutes ago',
                type: 'backup'
            },
            {
                id: 2,
                title: 'New User Registration',
                description: 'John Doe registered as VZone user',
                time: '15 minutes ago',
                type: 'user'
            },
            {
                id: 3,
                title: 'Module Update',
                description: 'Analytics module updated to v2.1.3',
                time: '1 hour ago',
                type: 'update'
            },
            {
                id: 4,
                title: 'Performance Alert',
                description: 'CPU usage exceeded 80% threshold',
                time: '2 hours ago',
                type: 'alert'
            }
        ];

        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = activities.map(activity => `
                <div class="activity-item" data-searchable>
                    <div class="activity-icon">
                        ${this.getActivityIcon(activity.type)}
                    </div>
                    <div class="activity-content">
                        <h4>${activity.title}</h4>
                        <p>${activity.description}</p>
                        <span class="activity-time">${activity.time}</span>
                    </div>
                </div>
            `).join('');
        }
    }

    getActivityIcon(type) {
        const icons = {
            backup: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>',
            user: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            update: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
            alert: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>'
        };
        return icons[type] || icons.alert;
    }

    startAutoRefresh() {
        // Refresh every 5 minutes
        this.refreshInterval = setInterval(() => {
            this.refreshDashboardData();
        }, 300000);
    }

    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    async refreshDashboardData() {
        try {
            Utils.showNotification('Refreshing dashboard data...', 'info');
            
            // Reload all data
            await this.loadDashboardStats();
            await this.loadUserList();
            await this.loadSystemModules();
            await this.loadRecentActivities();
            
            // Update charts if available
            if (window.systemCharts && window.systemCharts.refreshCharts) {
                window.systemCharts.refreshCharts();
            }
            
            Utils.showNotification('Dashboard data refreshed successfully', 'success');
            
        } catch (error) {
            console.error('Failed to refresh dashboard data:', error);
            Utils.showNotification('Failed to refresh dashboard data', 'error');
        }
    }

    updateDataForPeriod(period) {
        console.log(`Updating data for period: ${period}`);
        
        // Update charts for new period
        if (window.systemCharts && window.systemCharts.updateChartsForPeriod) {
            window.systemCharts.updateChartsForPeriod(period);
        }
        
        // Reload stats for new period
        this.loadDashboardStats();
        
        const periodText = {
            '7d': '7 days',
            '30d': '30 days',
            '90d': '90 days'
        };
        
        Utils.showNotification(`Data updated for ${periodText[period]}`, 'info');
    }

    filterModules(filterType) {
        if (window.moduleManager && window.moduleManager.filterModules) {
            window.moduleManager.filterModules(filterType);
        }
    }

    // Quick Actions
    async performSystemBackup() {
        try {
            Utils.showNotification('Starting system backup...', 'info');
            this.showLoading();
            
            // Simulate backup process
            await Utils.delay(3000);
            
            this.hideLoading();
            Utils.showNotification('System backup completed successfully', 'success');
            
            // Add to activities
            this.addActivity('System Backup', 'Manual backup completed successfully', 'backup');
            
        } catch (error) {
            console.error('Backup failed:', error);
            this.hideLoading();
            Utils.showNotification('System backup failed', 'error');
        }
    }

    async generateSystemReport() {
        try {
            Utils.showNotification('Generating system report...', 'info');
            this.showLoading();
            
            // Simulate report generation
            await Utils.delay(2000);
            
            // Create and download report
            const reportData = {
                generated: new Date().toISOString(),
                stats: {
                    totalUsers: 12457,
                    systemHealth: 98.5,
                    activeModules: 47,
                    dataTransfer: '2.4TB'
                },
                period: document.getElementById('timePeriod')?.value || '30d'
            };
            
            const blob = new Blob([JSON.stringify(reportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `xzone-report-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.hideLoading();
            Utils.showNotification('System report generated and downloaded', 'success');
            
        } catch (error) {
            console.error('Report generation failed:', error);
            this.hideLoading();
            Utils.showNotification('Failed to generate report', 'error');
        }
    }

    toggleMaintenanceMode() {
        this.isMaintenanceMode = !this.isMaintenanceMode;
        
        const maintenanceBtn = document.getElementById('maintenanceModeBtn');
        if (maintenanceBtn) {
            maintenanceBtn.textContent = this.isMaintenanceMode ? 'Exit Maintenance' : 'Maintenance Mode';
            maintenanceBtn.style.background = this.isMaintenanceMode ? 'var(--error-color)' : '';
        }
        
        const message = this.isMaintenanceMode ? 
            'Maintenance mode enabled' : 
            'Maintenance mode disabled';
            
        Utils.showNotification(message, this.isMaintenanceMode ? 'warning' : 'success');
        
        // Add to activities
        this.addActivity('Maintenance Mode', message, 'alert');
    }

    async exportSystemData() {
        try {
            Utils.showNotification('Exporting system data...', 'info');
            this.showLoading();
            
            // Simulate data export
            await Utils.delay(2000);
            
            // Create export data
            const exportData = {
                exported: new Date().toISOString(),
                users: await this.getUserExportData(),
                modules: await this.getModuleExportData(),
                activities: await this.getActivityExportData()
            };
            
            const blob = new Blob([JSON.stringify(exportData, null, 2)], {
                type: 'application/json'
            });
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `xzone-data-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.hideLoading();
            Utils.showNotification('System data exported successfully', 'success');
            
        } catch (error) {
            console.error('Data export failed:', error);
            this.hideLoading();
            Utils.showNotification('Failed to export data', 'error');
        }
    }

    async getUserExportData() {
        // Get user data from user management
        return window.userManagement?.getExportData() || [];
    }

    async getModuleExportData() {
        // Get module data from module manager
        return window.moduleManager?.getExportData() || [];
    }

    async getActivityExportData() {
        // Get activity data
        return this.getRecentActivitiesData();
    }

    showAddUserModal() {
        if (window.userManagement && window.userManagement.showAddUserModal) {
            window.userManagement.showAddUserModal();
        }
    }

    clearAllActivities() {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            activityList.innerHTML = '<div class="activity-item"><div class="activity-content"><p>No recent activities</p></div></div>';
        }
        
        Utils.showNotification('All activities cleared', 'info');
    }

    addActivity(title, description, type) {
        const activityList = document.getElementById('activityList');
        if (activityList) {
            const activityHTML = `
                <div class="activity-item" data-searchable>
                    <div class="activity-icon">
                        ${this.getActivityIcon(type)}
                    </div>
                    <div class="activity-content">
                        <h4>${title}</h4>
                        <p>${description}</p>
                        <span class="activity-time">Just now</span>
                    </div>
                </div>
            `;
            
            activityList.insertAdjacentHTML('afterbegin', activityHTML);
        }
    }

    getRecentActivitiesData() {
        const activityItems = document.querySelectorAll('.activity-item');
        return Array.from(activityItems).map(item => {
            const title = item.querySelector('h4')?.textContent || '';
            const description = item.querySelector('p')?.textContent || '';
            const time = item.querySelector('.activity-time')?.textContent || '';
            return { title, description, time };
        });
    }

    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.add('active');
        }
    }

    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.classList.remove('active');
        }
    }

    handleLogout() {
        SessionManager.logout();
        window.location.href = '../login.html';
    }

    destroy() {
        this.stopAutoRefresh();
        this.isInitialized = false;
        console.log('XZone Dashboard destroyed');
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const xzoneDashboard = new XZoneDashboard();
    xzoneDashboard.initialize();
    
    // Make dashboard available globally
    window.xzoneDashboard = xzoneDashboard;
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.xzoneDashboard) {
        window.xzoneDashboard.destroy();
    }
});
