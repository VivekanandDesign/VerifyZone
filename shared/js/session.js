// Session Management Utilities
class SessionManager {
    static SESSION_KEY = 'vzone_session';
    static SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

    static setSession(user) {
        const session = {
            user: user,
            timestamp: Date.now(),
            expiresAt: Date.now() + this.SESSION_DURATION
        };
        localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }

    // Alias for backward compatibility
    static createSession(user) {
        return this.setSession(user);
    }

    // Alias for backward compatibility
    static getCurrentUser() {
        return this.getUser();
    }

    static getSession() {
        try {
            const sessionData = localStorage.getItem(this.SESSION_KEY);
            if (!sessionData) return null;

            const session = JSON.parse(sessionData);
            
            // Check if session is expired
            if (Date.now() > session.expiresAt) {
                this.clearSession();
                return null;
            }

            return session;
        } catch (error) {
            console.error('Error parsing session data:', error);
            this.clearSession();
            return null;
        }
    }

    static clearSession() {
        localStorage.removeItem(this.SESSION_KEY);
    }

    static isAuthenticated() {
        return this.getSession() !== null;
    }

    static getUserType() {
        const session = this.getSession();
        return session ? session.user.type : null;
    }

    static getUser() {
        const session = this.getSession();
        return session ? session.user : null;
    }

    static hasAccess(requiredType) {
        const userType = this.getUserType();
        if (!userType) return false;
        
        // Admin has access to everything
        if (userType === 'admin') return true;
        
        // Check specific access
        return userType === requiredType;
    }
}

// Route Protection
class RouteGuard {
    static requireAuth(redirectUrl = '../login.html') {
        if (!SessionManager.isAuthenticated()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    static requireUserType(requiredType, redirectUrl = '../login.html') {
        if (!SessionManager.hasAccess(requiredType)) {
            if (SessionManager.isAuthenticated()) {
                this.showAccessDenied();
            } else {
                window.location.href = redirectUrl;
            }
            return false;
        }
        return true;
    }

    static showAccessDenied() {
        alert('Access Denied: You don\'t have permission to access this resource.');
        window.location.href = '../index.html';
    }
}

// Utility Functions
class Utils {
    static formatDate(date) {
        return new Date(date).toLocaleDateString();
    }

    static formatTime(date) {
        return new Date(date).toLocaleTimeString();
    }

    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    static async fetchWithAuth(url, options = {}) {
        const session = SessionManager.getSession();
        if (!session) {
            throw new Error('No valid session found');
        }

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.user.id}`,
            ...options.headers
        };

        return fetch(url, {
            ...options,
            headers
        });
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SessionManager, RouteGuard, Utils };
}
