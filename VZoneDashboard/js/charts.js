// VZone Charts Implementation
// Utility function for debouncing
function debounce(func, wait) {
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

class VZoneCharts {
    constructor() {
        this.charts = {};
        this.colors = {
            primary: '#361968',
            secondary: '#9967d1',
            accent: '#4caf50',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545'
        };
    }

    initialize() {
        this.drawUserGrowthChart();
    }

    drawUserGrowthChart() {
        const canvas = document.getElementById('userGrowthChart');
        if (!canvas) return;
        
        // Get container dimensions for responsive sizing
        const container = canvas.parentElement;
        const containerRect = container.getBoundingClientRect();
        
        // Set canvas size to fill container
        const dpr = window.devicePixelRatio || 1;
        const width = containerRect.width - 32; // Account for padding
        const height = containerRect.height - 32; // Account for padding
        
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        canvas.style.width = width + 'px';
        canvas.style.height = height + 'px';
        
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        
        const padding = 60;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get data from analytics for three series
        const verificationData = vzoneAnalytics.getVerificationData('7d');
        const reVerificationData = vzoneAnalytics.getReVerificationData('7d');
        const approvalData = vzoneAnalytics.getApprovalData('7d');
        
        // Find max value across all series for scaling
        const allData = [...verificationData, ...reVerificationData, ...approvalData];
        const maxValue = Math.max(...allData);
        const minValue = Math.min(...allData);
        const range = maxValue - minValue;
        
        // Chart dimensions
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Draw grid lines
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Vertical grid lines
        const pointCount = verificationData.length;
        for (let i = 0; i <= pointCount - 1; i++) {
            const x = padding + (chartWidth / (pointCount - 1)) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Draw three lines
        this.drawLine(ctx, verificationData, '#361968', padding, chartWidth, chartHeight, maxValue, minValue);
        this.drawLine(ctx, reVerificationData, '#9967d1', padding, chartWidth, chartHeight, maxValue, minValue);
        this.drawLine(ctx, approvalData, '#4caf50', padding, chartWidth, chartHeight, maxValue, minValue);
        
        // Draw Y-axis labels
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = minValue + (range / 5) * (5 - i);
            const y = padding + (chartHeight / 5) * i;
            ctx.fillText(Math.round(value), padding - 10, y + 4);
        }
        
        // Draw X-axis labels (days)
        ctx.textAlign = 'center';
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        for (let i = 0; i < pointCount; i++) {
            const x = padding + (chartWidth / (pointCount - 1)) * i;
            ctx.fillText(days[i] || `Day ${i + 1}`, x, height - padding + 20);
        }
    }

    drawLine(ctx, data, color, padding, chartWidth, chartHeight, maxValue, minValue) {
        const range = maxValue - minValue;
        const pointCount = data.length;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        
        for (let i = 0; i < pointCount; i++) {
            const x = padding + (chartWidth / (pointCount - 1)) * i;
            const normalizedValue = (data[i] - minValue) / range;
            const y = padding + chartHeight - (normalizedValue * chartHeight);
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = color;
        for (let i = 0; i < pointCount; i++) {
            const x = padding + (chartWidth / (pointCount - 1)) * i;
            const normalizedValue = (data[i] - minValue) / range;
            const y = padding + chartHeight - (normalizedValue * chartHeight);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    updateChartsForPeriod(period) {
        this.drawUserGrowthChart();
    }

    resizeCharts() {
        // Redraw charts when window resizes
        this.drawUserGrowthChart();
    }
}

// Initialize charts
const vzoneCharts = new VZoneCharts();

// Global function for chart updates
function updateChartsForPeriod(period) {
    vzoneCharts.updateChartsForPeriod(period);
    
    // Update button states
    const buttons = document.querySelectorAll('.chart-controls .btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    const activeButton = Array.from(buttons).find(btn => 
        btn.textContent.includes(period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : '90 Days')
    );
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Initialize charts when loaded
function initializeCharts() {
    vzoneCharts.initialize();
}

// Make it globally available
window.initializeCharts = initializeCharts;
window.updateChartsForPeriod = updateChartsForPeriod;

// Handle window resize
window.addEventListener('resize', debounce(() => {
    vzoneCharts.resizeCharts();
}, 250));
