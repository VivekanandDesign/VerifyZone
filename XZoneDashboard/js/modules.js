// XZone Module Management System
class ModuleManager {
    constructor() {
        this.modules = [];
        this.filteredModules = [];
        this.isLoading = false;
    }

    async initialize() {
        try {
            await this.loadModules();
            this.bindEvents();
            console.log('Module Manager initialized');
        } catch (error) {
            console.error('Failed to initialize Module Manager:', error);
        }
    }

    async loadModules() {
        try {
            this.isLoading = true;
            
            // Simulate API call to load modules
            this.modules = await this.fetchModules();
            this.filteredModules = [...this.modules];
            
            this.renderModuleGrid();
            this.isLoading = false;
            
        } catch (error) {
            console.error('Failed to load modules:', error);
            this.isLoading = false;
            Utils.showNotification('Failed to load modules', 'error');
        }
    }

    async fetchModules() {
        // Simulate API delay
        await Utils.delay(800);
        
        // Generate sample module data
        const moduleTypes = [
            { name: 'Authentication', icon: 'lock', category: 'security' },
            { name: 'Analytics', icon: 'chart', category: 'data' },
            { name: 'User Management', icon: 'users', category: 'admin' },
            { name: 'File Storage', icon: 'storage', category: 'storage' },
            { name: 'Email Service', icon: 'mail', category: 'communication' },
            { name: 'API Gateway', icon: 'gateway', category: 'infrastructure' },
            { name: 'Database', icon: 'database', category: 'storage' },
            { name: 'Backup System', icon: 'backup', category: 'utility' },
            { name: 'Monitoring', icon: 'monitor', category: 'admin' },
            { name: 'Load Balancer', icon: 'balance', category: 'infrastructure' },
            { name: 'Cache Manager', icon: 'cache', category: 'performance' },
            { name: 'Search Engine', icon: 'search', category: 'data' },
            { name: 'Notification Hub', icon: 'bell', category: 'communication' },
            { name: 'Security Scanner', icon: 'shield', category: 'security' },
            { name: 'Task Scheduler', icon: 'clock', category: 'utility' },
            { name: 'Log Aggregator', icon: 'logs', category: 'admin' },
            { name: 'CDN Manager', icon: 'globe', category: 'infrastructure' },
            { name: 'Payment Gateway', icon: 'payment', category: 'business' },
            { name: 'Report Generator', icon: 'report', category: 'data' },
            { name: 'Health Checker', icon: 'health', category: 'monitoring' }
        ];
        
        const statuses = ['running', 'stopped', 'warning'];
        const versions = ['1.0.0', '1.2.3', '2.1.0', '3.0.1', '1.5.2'];
        
        const modules = [];
        for (let i = 0; i < moduleTypes.length; i++) {
            const moduleType = moduleTypes[i];
            modules.push({
                id: i + 1,
                name: moduleType.name,
                icon: moduleType.icon,
                category: moduleType.category,
                status: statuses[Math.floor(Math.random() * statuses.length)],
                version: versions[Math.floor(Math.random() * versions.length)],
                uptime: this.generateUptime(),
                memoryUsage: Math.floor(Math.random() * 512) + 64, // 64-576 MB
                cpuUsage: Math.floor(Math.random() * 80) + 5, // 5-85%
                lastUpdated: this.generateRandomDate(30),
                description: `${moduleType.name} module for system management`
            });
        }
        
        return modules;
    }

    generateUptime() {
        const days = Math.floor(Math.random() * 30);
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        
        if (days > 0) {
            return `${days}d ${hours}h`;
        } else if (hours > 0) {
            return `${hours}h ${minutes}m`;
        } else {
            return `${minutes}m`;
        }
    }

    generateRandomDate(daysAgo = 7) {
        const now = new Date();
        const randomDays = Math.floor(Math.random() * daysAgo);
        const date = new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
        return date.toISOString();
    }

    renderModuleGrid() {
        const moduleGrid = document.getElementById('moduleGrid');
        if (!moduleGrid) return;

        if (this.isLoading) {
            moduleGrid.innerHTML = '<div class="loading-state">Loading modules...</div>';
            return;
        }

        if (this.filteredModules.length === 0) {
            moduleGrid.innerHTML = '<div class="empty-state">No modules found</div>';
            return;
        }

        moduleGrid.innerHTML = this.filteredModules.map(module => `
            <div class="module-item" data-searchable data-module-id="${module.id}" data-status="${module.status}">
                <div class="module-icon">
                    ${this.getModuleIcon(module.icon)}
                </div>
                <h4>${module.name}</h4>
                <div class="module-status ${module.status}">
                    ${module.status}
                </div>
                <div class="module-details">
                    <small>v${module.version}</small>
                    <small>${module.uptime}</small>
                </div>
                <div class="module-actions">
                    <button class="module-action-btn" onclick="moduleManager.toggleModule(${module.id})" title="Toggle Module">
                        ${module.status === 'running' ? this.getStopIcon() : this.getStartIcon()}
                    </button>
                    <button class="module-action-btn" onclick="moduleManager.configureModule(${module.id})" title="Configure">
                        ${this.getConfigIcon()}
                    </button>
                </div>
            </div>
        `).join('');
    }

    getModuleIcon(iconType) {
        const icons = {
            lock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>',
            chart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>',
            users: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zM4 18v-6h2.5l6 8h2L7 14h1.5c.83 0 1.5-.67 1.5-1.5S9.33 11 8.5 11H4V7h1l7 4h1.5c.83 0 1.5-.67 1.5-1.5S14.33 8 13.5 8H13l-2.42-1.45c-.54-.32-1.23-.32-1.77 0L4 9.5V18z"/></svg>',
            storage: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z"/></svg>',
            mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
            gateway: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>',
            database: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4zM4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4zM4 16v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z"/></svg>',
            backup: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>',
            monitor: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v1h12v-1l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z"/></svg>',
            balance: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
            cache: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>',
            search: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>',
            bell: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>',
            shield: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/></svg>',
            clock: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z"/></svg>',
            logs: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/></svg>',
            globe: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16.36,14C16.44,13.34 16.5,12.68 16.5,12C16.5,11.32 16.44,10.66 16.36,10H19.74C19.9,10.64 20,11.31 20,12C20,12.69 19.9,13.36 19.74,14M14.59,19.56C15.19,18.45 15.65,17.25 15.97,16H18.92C17.96,17.65 16.43,18.93 14.59,19.56M14.34,14H9.66C9.56,13.34 9.5,12.68 9.5,12C9.5,11.32 9.56,10.65 9.66,10H14.34C14.43,10.65 14.5,11.32 14.5,12C14.5,12.68 14.43,13.34 14.34,14M12,19.96C11.17,18.76 10.5,17.43 10.09,16H13.91C13.5,17.43 12.83,18.76 12,19.96M8,8H5.08C6.03,6.34 7.57,5.06 9.4,4.44C8.8,5.55 8.35,6.75 8,8M5.08,16H8C8.35,17.25 8.8,18.45 9.4,19.56C7.57,18.93 6.03,17.65 5.08,16M4.26,14C4.1,13.36 4,12.69 4,12C4,11.31 4.1,10.64 4.26,10H7.64C7.56,10.66 7.5,11.32 7.5,12C7.5,12.68 7.56,13.34 7.64,14M12,4.03C12.83,5.23 13.5,6.57 13.91,8H10.09C10.5,6.57 11.17,5.23 12,4.03M18.92,8H15.97C15.65,6.75 15.19,5.55 14.59,4.44C16.43,5.07 17.96,6.34 18.92,8M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>',
            payment: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>',
            report: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>',
            health: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>'
        };
        
        return icons[iconType] || icons.monitor;
    }

    getStartIcon() {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>';
    }

    getStopIcon() {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 6h12v12H6z"/></svg>';
    }

    getConfigIcon() {
        return '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.22,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.22,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.68 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z"/></svg>';
    }

    bindEvents() {
        // Module filter
        const moduleFilter = document.getElementById('moduleFilter');
        if (moduleFilter) {
            moduleFilter.addEventListener('change', (e) => {
                this.filterModules(e.target.value);
            });
        }
    }

    filterModules(filterType) {
        switch (filterType) {
            case 'active':
            case 'running':
                this.filteredModules = this.modules.filter(module => module.status === 'running');
                break;
            case 'inactive':
            case 'stopped':
                this.filteredModules = this.modules.filter(module => module.status === 'stopped');
                break;
            case 'error':
            case 'warning':
                this.filteredModules = this.modules.filter(module => module.status === 'warning');
                break;
            default:
                this.filteredModules = [...this.modules];
        }
        
        this.renderModuleGrid();
    }

    async toggleModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        try {
            // Show loading state
            const moduleItem = document.querySelector(`[data-module-id="${moduleId}"]`);
            if (moduleItem) {
                moduleItem.style.opacity = '0.5';
            }

            // Simulate API call
            await Utils.delay(1000);

            // Toggle status
            if (module.status === 'running') {
                module.status = 'stopped';
            } else if (module.status === 'stopped') {
                module.status = 'running';
            }

            // Update display
            this.renderModuleGrid();

            const action = module.status === 'running' ? 'started' : 'stopped';
            Utils.showNotification(`${module.name} ${action} successfully`, 'success');

            // Add activity
            if (window.xzoneDashboard) {
                window.xzoneDashboard.addActivity(
                    'Module Updated',
                    `${module.name} was ${action}`,
                    'update'
                );
            }

        } catch (error) {
            console.error('Failed to toggle module:', error);
            Utils.showNotification('Failed to update module', 'error');
            
            // Reset loading state
            const moduleItem = document.querySelector(`[data-module-id="${moduleId}"]`);
            if (moduleItem) {
                moduleItem.style.opacity = '1';
            }
        }
    }

    configureModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        // Simple configuration dialog
        const config = prompt(`Configure ${module.name}:\nEnter new configuration (JSON format):`);
        
        if (config) {
            try {
                JSON.parse(config); // Validate JSON
                Utils.showNotification(`${module.name} configured successfully`, 'success');
                
                // Add activity
                if (window.xzoneDashboard) {
                    window.xzoneDashboard.addActivity(
                        'Module Configured',
                        `${module.name} configuration was updated`,
                        'update'
                    );
                }
            } catch (error) {
                Utils.showNotification('Invalid configuration format', 'error');
            }
        }
    }

    restartModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        // Set to stopped, then back to running
        module.status = 'stopped';
        this.renderModuleGrid();
        
        setTimeout(() => {
            module.status = 'running';
            this.renderModuleGrid();
            Utils.showNotification(`${module.name} restarted successfully`, 'success');
            
            // Add activity
            if (window.xzoneDashboard) {
                window.xzoneDashboard.addActivity(
                    'Module Restarted',
                    `${module.name} was restarted`,
                    'update'
                );
            }
        }, 2000);
    }

    getExportData() {
        return this.modules.map(module => ({
            id: module.id,
            name: module.name,
            category: module.category,
            status: module.status,
            version: module.version,
            uptime: module.uptime,
            memoryUsage: module.memoryUsage,
            cpuUsage: module.cpuUsage,
            lastUpdated: module.lastUpdated,
            description: module.description
        }));
    }

    getModuleStats() {
        return {
            total: this.modules.length,
            running: this.modules.filter(m => m.status === 'running').length,
            stopped: this.modules.filter(m => m.status === 'stopped').length,
            warning: this.modules.filter(m => m.status === 'warning').length,
            categories: [...new Set(this.modules.map(m => m.category))].length
        };
    }

    searchModules(query) {
        if (!query.trim()) {
            this.filteredModules = [...this.modules];
        } else {
            const lowercaseQuery = query.toLowerCase();
            this.filteredModules = this.modules.filter(module => 
                module.name.toLowerCase().includes(lowercaseQuery) ||
                module.category.toLowerCase().includes(lowercaseQuery) ||
                module.description.toLowerCase().includes(lowercaseQuery)
            );
        }
        
        this.renderModuleGrid();
    }
}

// Initialize Module Manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const moduleManager = new ModuleManager();
    moduleManager.initialize();
    
    // Make module manager available globally
    window.moduleManager = moduleManager;
});
