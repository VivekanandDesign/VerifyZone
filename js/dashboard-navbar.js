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
        const otherDashboardPath = isVZone ? '../dashboard2/index.html' : '../dashboard1/index.html';

        return `
            <nav class="top-navbar" id="dashboardTopNav">
                <div class="top-nav-container">
                    <div class="nav-brand">
                        <a href="../index.html" class="brand-link">
                            <span class="brand-name">VerifyZone</span>
                        </a>
                        <span class="dashboard-indicator">${dashboardName} Dashboard</span>
                    </div>
                    <div class="nav-actions">
                        <a href="${otherDashboardPath}" class="switch-dashboard" title="Switch to ${otherDashboard}">
                            <span class="switch-icon">⇄</span>
                            <span class="switch-text">${otherDashboard}</span>
                        </a>
                        <a href="../index.html" class="home-link" title="Back to Home">
                            <span class="home-icon">🏠</span>
                            <span class="home-text">Home</span>
                        </a>
                    </div>
                </div>
            </nav>
        `;
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            // Add top navbar to dashboard pages
            const dashboardContainer = document.querySelector('.dashboard-container');
            if (dashboardContainer) {
                dashboardContainer.insertAdjacentHTML('afterbegin', this.generateTopNavHTML());
                this.initializeNavbarFeatures();
            }
        });
    }

    initializeNavbarFeatures() {
        const topNav = document.getElementById('dashboardTopNav');
        if (topNav) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > 50) {
                    topNav.classList.add('scrolled');
                } else {
                    topNav.classList.remove('scrolled');
                }
                
                // Auto-hide navbar on scroll down, show on scroll up
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    topNav.classList.add('hidden');
                } else {
                    topNav.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
            });
        }
    }
}

// Initialize based on current dashboard
const currentPath = window.location.pathname;
if (currentPath.includes('dashboard1')) {
    new DashboardNavbar('v-zone');
} else if (currentPath.includes('dashboard2')) {
    new DashboardNavbar('x-zone');
}
