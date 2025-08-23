// XZone User Management System
class UserManagement {
    constructor() {
        this.users = [];
        this.filteredUsers = [];
        this.isLoading = false;
    }

    async initialize() {
        try {
            await this.loadUsers();
            this.bindEvents();
            console.log('User Management initialized');
        } catch (error) {
            console.error('Failed to initialize User Management:', error);
        }
    }

    async loadUsers() {
        try {
            this.isLoading = true;
            
            // Simulate API call to load users
            this.users = await this.fetchUsers();
            this.filteredUsers = [...this.users];
            
            this.renderUserList();
            this.isLoading = false;
            
        } catch (error) {
            console.error('Failed to load users:', error);
            this.isLoading = false;
            Utils.showNotification('Failed to load users', 'error');
        }
    }

    async fetchUsers() {
        // Simulate API delay
        await Utils.delay(1000);
        
        // Generate sample user data
        const userTypes = ['vzone', 'xzone'];
        const statuses = ['active', 'inactive'];
        const roles = ['Admin', 'User', 'Manager', 'Viewer'];
        
        const users = [];
        for (let i = 1; i <= 50; i++) {
            users.push({
                id: i,
                name: `User ${i.toString().padStart(2, '0')}`,
                email: `user${i}@example.com`,
                type: userTypes[Math.floor(Math.random() * userTypes.length)],
                role: roles[Math.floor(Math.random() * roles.length)],
                status: statuses[Math.floor(Math.random() * statuses.length)],
                lastLogin: this.generateRandomDate(),
                createdAt: this.generateRandomDate(30)
            });
        }
        
        return users;
    }

    generateRandomDate(daysAgo = 7) {
        const now = new Date();
        const randomDays = Math.floor(Math.random() * daysAgo);
        const date = new Date(now.getTime() - (randomDays * 24 * 60 * 60 * 1000));
        return date.toISOString();
    }

    renderUserList() {
        const userList = document.getElementById('userList');
        if (!userList) return;

        if (this.isLoading) {
            userList.innerHTML = '<div class="loading-state">Loading users...</div>';
            return;
        }

        if (this.filteredUsers.length === 0) {
            userList.innerHTML = '<div class="empty-state">No users found</div>';
            return;
        }

        // Show only first 10 users in the dashboard view
        const displayUsers = this.filteredUsers.slice(0, 10);
        
        userList.innerHTML = displayUsers.map(user => `
            <div class="user-item" data-searchable data-user-id="${user.id}">
                <div class="user-avatar-small">
                    ${user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </div>
                <div class="user-info">
                    <h4>${user.name}</h4>
                    <p>${user.email} • ${user.role}</p>
                </div>
                <div class="user-status ${user.status}">
                    ${user.status}
                </div>
                <div class="user-actions">
                    <button class="btn btn-sm btn-outline edit-user-btn" data-user-id="${user.id}">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="btn btn-sm btn-outline delete-user-btn" data-user-id="${user.id}">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `).join('');

        // Add "View All" button if there are more users
        if (this.filteredUsers.length > 10) {
            userList.innerHTML += `
                <div class="user-item view-all-item">
                    <button class="btn btn-outline view-all-users-btn">
                        View All ${this.filteredUsers.length} Users
                    </button>
                </div>
            `;
        }

        this.bindUserActions();
    }

    bindEvents() {
        // Search functionality
        const searchInput = document.getElementById('dashboardSearch');
        if (searchInput) {
            searchInput.addEventListener('input', Utils.debounce((e) => {
                this.searchUsers(e.target.value);
            }, 300));
        }
    }

    bindUserActions() {
        // Edit user buttons
        const editButtons = document.querySelectorAll('.edit-user-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const userId = parseInt(btn.dataset.userId);
                this.editUser(userId);
            });
        });

        // Delete user buttons
        const deleteButtons = document.querySelectorAll('.delete-user-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const userId = parseInt(btn.dataset.userId);
                this.deleteUser(userId);
            });
        });

        // View all users button
        const viewAllBtn = document.querySelector('.view-all-users-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                this.showAllUsersModal();
            });
        }
    }

    searchUsers(query) {
        if (!query.trim()) {
            this.filteredUsers = [...this.users];
        } else {
            const lowercaseQuery = query.toLowerCase();
            this.filteredUsers = this.users.filter(user => 
                user.name.toLowerCase().includes(lowercaseQuery) ||
                user.email.toLowerCase().includes(lowercaseQuery) ||
                user.role.toLowerCase().includes(lowercaseQuery)
            );
        }
        
        this.renderUserList();
    }

    filterUsers(filterType) {
        switch (filterType) {
            case 'active':
                this.filteredUsers = this.users.filter(user => user.status === 'active');
                break;
            case 'inactive':
                this.filteredUsers = this.users.filter(user => user.status === 'inactive');
                break;
            case 'vzone':
                this.filteredUsers = this.users.filter(user => user.type === 'vzone');
                break;
            case 'xzone':
                this.filteredUsers = this.users.filter(user => user.type === 'xzone');
                break;
            default:
                this.filteredUsers = [...this.users];
        }
        
        this.renderUserList();
    }

    async addUser(userData) {
        try {
            // Simulate API call
            await Utils.delay(1000);
            
            const newUser = {
                id: Math.max(...this.users.map(u => u.id)) + 1,
                ...userData,
                createdAt: new Date().toISOString(),
                lastLogin: null,
                status: 'active'
            };
            
            this.users.push(newUser);
            this.filteredUsers = [...this.users];
            this.renderUserList();
            
            Utils.showNotification('User added successfully', 'success');
            
            // Add activity
            if (window.xzoneDashboard) {
                window.xzoneDashboard.addActivity(
                    'User Added',
                    `${newUser.name} was added to the system`,
                    'user'
                );
            }
            
        } catch (error) {
            console.error('Failed to add user:', error);
            Utils.showNotification('Failed to add user', 'error');
        }
    }

    async editUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        // For now, just show a simple prompt
        const newName = prompt('Enter new name:', user.name);
        const newEmail = prompt('Enter new email:', user.email);
        
        if (newName && newEmail) {
            try {
                // Simulate API call
                await Utils.delay(500);
                
                user.name = newName;
                user.email = newEmail;
                
                this.renderUserList();
                Utils.showNotification('User updated successfully', 'success');
                
                // Add activity
                if (window.xzoneDashboard) {
                    window.xzoneDashboard.addActivity(
                        'User Updated',
                        `${user.name} profile was updated`,
                        'user'
                    );
                }
                
            } catch (error) {
                console.error('Failed to update user:', error);
                Utils.showNotification('Failed to update user', 'error');
            }
        }
    }

    async deleteUser(userId) {
        const user = this.users.find(u => u.id === userId);
        if (!user) return;

        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            try {
                // Simulate API call
                await Utils.delay(500);
                
                this.users = this.users.filter(u => u.id !== userId);
                this.filteredUsers = this.filteredUsers.filter(u => u.id !== userId);
                
                this.renderUserList();
                Utils.showNotification('User deleted successfully', 'success');
                
                // Add activity
                if (window.xzoneDashboard) {
                    window.xzoneDashboard.addActivity(
                        'User Deleted',
                        `${user.name} was removed from the system`,
                        'user'
                    );
                }
                
            } catch (error) {
                console.error('Failed to delete user:', error);
                Utils.showNotification('Failed to delete user', 'error');
            }
        }
    }

    showAddUserModal() {
        // Simple prompt-based add user for now
        const name = prompt('Enter user name:');
        const email = prompt('Enter user email:');
        const type = prompt('Enter user type (vzone/xzone):');
        const role = prompt('Enter user role:');
        
        if (name && email && type && role) {
            this.addUser({ name, email, type, role });
        }
    }

    showAllUsersModal() {
        // For now, just show an alert
        alert(`Total users: ${this.users.length}\nActive: ${this.users.filter(u => u.status === 'active').length}\nInactive: ${this.users.filter(u => u.status === 'inactive').length}`);
    }

    getExportData() {
        return this.users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            type: user.type,
            role: user.role,
            status: user.status,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        }));
    }

    getUserStats() {
        return {
            total: this.users.length,
            active: this.users.filter(u => u.status === 'active').length,
            inactive: this.users.filter(u => u.status === 'inactive').length,
            vzone: this.users.filter(u => u.type === 'vzone').length,
            xzone: this.users.filter(u => u.type === 'xzone').length
        };
    }
}

// Initialize User Management when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const userManagement = new UserManagement();
    userManagement.initialize();
    
    // Make user management available globally
    window.userManagement = userManagement;
});
