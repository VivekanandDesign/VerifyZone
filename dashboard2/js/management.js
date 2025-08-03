// Management Dashboard functionality
document.addEventListener('DOMContentLoaded', function() {
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
        });
    });

    // Quick Actions functionality
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleQuickAction(action);
        });
    });

    // Search functionality
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const tableRows = document.querySelectorAll('.users-table tbody tr');
            
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

    // Filter functionality
    const filterSelects = document.querySelectorAll('.filter-select');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            filterUsers();
        });
    });

    // User action buttons
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const action = this.getAttribute('title').toLowerCase();
            const row = this.closest('tr');
            const userName = row.querySelector('.user-info span').textContent;
            
            if (action === 'edit') {
                handleEditUser(userName);
            } else if (action === 'delete') {
                handleDeleteUser(userName);
            }
        });
    });

    // System status refresh
    const systemStatusBtn = document.querySelector('.btn-outline');
    if (systemStatusBtn && systemStatusBtn.textContent.includes('System Status')) {
        systemStatusBtn.addEventListener('click', function() {
            refreshSystemStatus();
        });
    }

    // Add new button functionality
    const addNewBtn = document.querySelector('.btn-primary');
    if (addNewBtn && addNewBtn.textContent.includes('Add New')) {
        addNewBtn.addEventListener('click', function() {
            const activeSection = document.querySelector('.section.active');
            const sectionId = activeSection.id;
            
            if (sectionId === 'users') {
                handleAddUser();
            } else {
                showNotification('Add new functionality for ' + sectionId, 'info');
            }
        });
    }

    // Mobile sidebar toggle
    createMobileSidebarToggle();

    // Initialize real-time updates
    startRealTimeUpdates();
});

// Quick action handlers
function handleQuickAction(action) {
    switch (action) {
        case 'add-user':
            handleAddUser();
            break;
        case 'backup':
            handleBackup();
            break;
        case 'update':
            handleSystemUpdate();
            break;
        case 'maintenance':
            handleMaintenance();
            break;
        case 'security':
            handleSecurityScan();
            break;
        case 'reports':
            handleGenerateReport();
            break;
        default:
            showNotification('Action not implemented yet', 'info');
    }
}

function handleAddUser() {
    showNotification('Opening user creation form...', 'info');
    
    // Simulate form opening
    setTimeout(() => {
        showNotification('User creation form would open here', 'success');
    }, 1000);
}

function handleBackup() {
    showNotification('Starting system backup...', 'info');
    
    // Simulate backup process
    setTimeout(() => {
        showNotification('System backup completed successfully!', 'success');
        addActivityItem('🔄', 'System backup completed successfully', 'Just now');
    }, 3000);
}

function handleSystemUpdate() {
    showNotification('Checking for system updates...', 'info');
    
    setTimeout(() => {
        showNotification('System is up to date!', 'success');
    }, 2000);
}

function handleMaintenance() {
    showNotification('Initiating maintenance mode...', 'warning');
    
    setTimeout(() => {
        showNotification('Maintenance mode activated', 'success');
        addActivityItem('🔧', 'System entered maintenance mode', 'Just now');
    }, 2000);
}

function handleSecurityScan() {
    showNotification('Starting security scan...', 'info');
    
    setTimeout(() => {
        showNotification('Security scan completed - No threats detected', 'success');
        addActivityItem('🛡️', 'Security scan completed: No threats detected', 'Just now');
    }, 4000);
}

function handleGenerateReport() {
    showNotification('Generating management report...', 'info');
    
    setTimeout(() => {
        showNotification('Report generated and ready for download', 'success');
        addActivityItem('📊', 'Management report generated', 'Just now');
    }, 3000);
}

// User management functions
function handleEditUser(userName) {
    showNotification(`Opening edit form for ${userName}`, 'info');
}

function handleDeleteUser(userName) {
    if (confirm(`Are you sure you want to delete ${userName}?`)) {
        showNotification(`User ${userName} deleted successfully`, 'success');
        // In a real app, this would remove the row from the table
    }
}

// Filter users function
function filterUsers() {
    const statusFilter = document.querySelector('.filter-select:first-child').value;
    const roleFilter = document.querySelector('.filter-select:last-child').value;
    const rows = document.querySelectorAll('.users-table tbody tr');
    
    rows.forEach(row => {
        const status = row.querySelector('.status-badge').textContent.trim();
        const role = row.querySelector('.role-badge').textContent.trim();
        
        let showRow = true;
        
        if (statusFilter !== 'All Users' && statusFilter !== status) {
            showRow = false;
        }
        
        if (roleFilter !== 'All Roles' && roleFilter !== role) {
            showRow = false;
        }
        
        row.style.display = showRow ? '' : 'none';
    });
}

// System status refresh
function refreshSystemStatus() {
    showNotification('Refreshing system status...', 'info');
    
    // Simulate status refresh
    setTimeout(() => {
        const statusCards = document.querySelectorAll('.status-card');
        statusCards.forEach(card => {
            const indicator = card.querySelector('.status-indicator');
            // Randomly change some statuses for demo
            if (Math.random() > 0.7) {
                indicator.className = 'status-indicator good';
            }
        });
        
        showNotification('System status refreshed', 'success');
    }, 1500);
}

// Add activity item
function addActivityItem(icon, text, time) {
    const activityFeed = document.querySelector('.activity-feed');
    const newItem = document.createElement('div');
    newItem.className = 'activity-item';
    newItem.innerHTML = `
        <div class="activity-icon">${icon}</div>
        <div class="activity-content">
            <p><strong>${text}</strong></p>
            <small>${time}</small>
        </div>
    `;
    
    // Add to the top of the feed
    activityFeed.insertBefore(newItem, activityFeed.firstChild);
    
    // Remove last item if too many
    const items = activityFeed.querySelectorAll('.activity-item');
    if (items.length > 10) {
        activityFeed.removeChild(items[items.length - 1]);
    }
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
        
        // Adjust table responsiveness
        adjustTableResponsiveness();
    }

    window.addEventListener('resize', handleResize);
    handleResize();
}

// Adjust table responsiveness
function adjustTableResponsiveness() {
    const tables = document.querySelectorAll('.users-table');
    const screenWidth = window.innerWidth;
    
    tables.forEach(table => {
        const headers = table.querySelectorAll('th');
        const cells = table.querySelectorAll('td');
        
        // Show/hide columns based on screen size
        if (screenWidth <= 480) {
            // Hide less important columns on mobile
            hideTableColumns(table, [4, 5]); // Hide "Last Login" and keep essential columns
        } else if (screenWidth <= 320) {
            // Hide even more columns on very small screens
            hideTableColumns(table, [3, 4, 5]); // Hide "Role", "Last Login"
        } else {
            // Show all columns on larger screens
            showAllTableColumns(table);
        }
    });
}

function hideTableColumns(table, columnIndices) {
    columnIndices.forEach(index => {
        const headers = table.querySelectorAll(`th:nth-child(${index + 1})`);
        const cells = table.querySelectorAll(`td:nth-child(${index + 1})`);
        
        headers.forEach(header => header.style.display = 'none');
        cells.forEach(cell => cell.style.display = 'none');
    });
}

function showAllTableColumns(table) {
    const allCells = table.querySelectorAll('th, td');
    allCells.forEach(cell => cell.style.display = '');
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
        max-width: 300px;
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

// Real-time updates simulation
function startRealTimeUpdates() {
    // Update activity feed periodically
    setInterval(() => {
        const activities = [
            { icon: '👤', text: 'New user registered', time: 'Just now' },
            { icon: '📧', text: 'Email notification sent', time: 'Just now' },
            { icon: '🔄', text: 'Data synchronization completed', time: 'Just now' },
            { icon: '⚙️', text: 'System configuration updated', time: 'Just now' },
            { icon: '🔒', text: 'Security policy enforced', time: 'Just now' }
        ];
        
        const randomActivity = activities[Math.floor(Math.random() * activities.length)];
        
        // Only add if we're on the overview section
        const overviewSection = document.querySelector('#overview');
        if (overviewSection && overviewSection.classList.contains('active')) {
            addActivityItem(randomActivity.icon, randomActivity.text, randomActivity.time);
        }
    }, 45000); // Add new activity every 45 seconds

    // Update status indicators occasionally
    setInterval(() => {
        const indicators = document.querySelectorAll('.status-indicator');
        indicators.forEach(indicator => {
            // Randomly change status for demo (mostly keep good status)
            if (Math.random() > 0.9) {
                const statuses = ['good', 'warning', 'danger'];
                const currentStatus = indicator.classList.contains('good') ? 'good' : 
                                   indicator.classList.contains('warning') ? 'warning' : 'danger';
                
                // Remove current status
                indicator.classList.remove('good', 'warning', 'danger');
                
                // Add new status (bias towards good)
                const newStatus = Math.random() > 0.8 ? statuses[Math.floor(Math.random() * statuses.length)] : 'good';
                indicator.classList.add(newStatus);
            }
        });
    }, 60000); // Update status every minute
}
