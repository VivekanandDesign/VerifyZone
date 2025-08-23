// XZone System Charts Implementation
class SystemCharts {
    constructor() {
        this.charts = {};
        this.currentMetric = 'memory';
        this.colors = {
            primary: '#361968',
            secondary: '#9967d1',
            accent: '#48cae4',
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545'
        };
    }

    initialize() {
        this.drawSystemPerformanceChart();
        this.initializeChartControls();
    }

    initializeChartControls() {
        // Add click handlers to chart control buttons
        const chartControls = document.querySelectorAll('.chart-controls .btn');
        chartControls.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Remove active class from all buttons
                chartControls.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                e.target.classList.add('active');
            });
        });
    }

    drawSystemPerformanceChart() {
        const canvas = document.getElementById('systemPerformanceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Get data based on current metric
        const dataPoints = this.getSystemData(this.currentMetric);
        const labels = this.getTimeLabels();
        
        // Calculate chart dimensions
        const padding = 40;
        const chartWidth = width - (padding * 2);
        const chartHeight = height - (padding * 2);
        
        // Draw grid
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // Draw the performance chart
        this.drawPerformanceLine(ctx, dataPoints, padding, chartWidth, chartHeight);
        
        // Draw labels and legend
        this.drawChartLabels(ctx, labels, padding, chartWidth, chartHeight);
        
        // Store chart reference
        this.charts.systemPerformance = { canvas, ctx, dataPoints, labels };
    }

    drawGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#e9ecef';
        ctx.lineWidth = 1;
        
        // Horizontal grid lines (5 lines)
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // Vertical grid lines (7 lines for 24 hours)
        for (let i = 0; i <= 6; i++) {
            const x = padding + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
    }

    drawPerformanceLine(ctx, dataPoints, padding, chartWidth, chartHeight) {
        if (dataPoints.length === 0) return;

        const maxValue = Math.max(...dataPoints);
        const minValue = Math.min(...dataPoints);
        const range = maxValue - minValue || 1;

        // Draw the main line
        ctx.strokeStyle = this.colors.primary;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        dataPoints.forEach((point, index) => {
            const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
            const y = padding + chartHeight - ((point - minValue) / range) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // Draw data points
        ctx.fillStyle = this.colors.secondary;
        dataPoints.forEach((point, index) => {
            const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
            const y = padding + chartHeight - ((point - minValue) / range) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });

        // Draw gradient fill under the line
        const gradient = ctx.createLinearGradient(0, padding, 0, padding + chartHeight);
        gradient.addColorStop(0, this.colors.primary + '20');
        gradient.addColorStop(1, this.colors.primary + '05');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(padding, padding + chartHeight);
        
        dataPoints.forEach((point, index) => {
            const x = padding + (chartWidth / (dataPoints.length - 1)) * index;
            const y = padding + chartHeight - ((point - minValue) / range) * chartHeight;
            if (index === 0) {
                ctx.lineTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.closePath();
        ctx.fill();

        // Draw threshold lines if applicable
        this.drawThresholdLines(ctx, padding, chartWidth, chartHeight, minValue, range);
    }

    drawThresholdLines(ctx, padding, chartWidth, chartHeight, minValue, range) {
        const thresholds = this.getThresholds(this.currentMetric);
        
        thresholds.forEach(threshold => {
            const y = padding + chartHeight - ((threshold.value - minValue) / range) * chartHeight;
            
            ctx.strokeStyle = threshold.color;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
            
            // Draw threshold label
            ctx.fillStyle = threshold.color;
            ctx.font = '12px Poppins';
            ctx.fillText(`${threshold.label} (${threshold.value}%)`, padding + 10, y - 5);
        });
        
        ctx.setLineDash([]); // Reset line dash
    }

    drawChartLabels(ctx, labels, padding, chartWidth, chartHeight) {
        ctx.fillStyle = '#6c757d';
        ctx.font = '12px Poppins';
        ctx.textAlign = 'center';
        
        // X-axis labels
        labels.forEach((label, index) => {
            const x = padding + (chartWidth / (labels.length - 1)) * index;
            ctx.fillText(label, x, padding + chartHeight + 20);
        });
        
        // Y-axis labels
        ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            const value = 100 - (i * 20); // 100% to 0%
            ctx.fillText(`${value}%`, padding - 10, y + 4);
        }
        
        // Chart title
        ctx.textAlign = 'center';
        ctx.font = 'bold 14px Poppins';
        ctx.fillStyle = this.colors.primary;
        const title = this.getChartTitle(this.currentMetric);
        ctx.fillText(title, padding + chartWidth / 2, 20);
    }

    getSystemData(metric) {
        // Simulate system performance data
        const baseData = {
            cpu: [45, 52, 48, 61, 58, 55, 49, 53, 46, 59, 62, 57, 51, 48, 55, 60, 58, 52, 47, 50, 56, 54, 49, 53],
            memory: [72, 75, 78, 74, 71, 73, 76, 79, 77, 74, 72, 75, 78, 80, 76, 73, 71, 74, 77, 79, 75, 72, 74, 76],
            disk: [28, 29, 31, 30, 28, 32, 34, 33, 31, 29, 30, 32, 35, 33, 31, 28, 30, 33, 35, 32, 29, 31, 33, 30]
        };
        
        // Add some randomness for real-time feel
        const data = baseData[metric] || baseData.memory;
        return data.map(value => value + (Math.random() - 0.5) * 5);
    }

    getTimeLabels() {
        const now = new Date();
        const labels = [];
        
        for (let i = 6; i >= 0; i--) {
            const time = new Date(now.getTime() - (i * 4 * 60 * 60 * 1000)); // 4-hour intervals
            labels.push(time.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
            }));
        }
        
        return labels;
    }

    getThresholds(metric) {
        const thresholds = {
            cpu: [
                { value: 80, label: 'High CPU', color: this.colors.warning },
                { value: 90, label: 'Critical CPU', color: this.colors.danger }
            ],
            memory: [
                { value: 85, label: 'High Memory', color: this.colors.warning },
                { value: 95, label: 'Critical Memory', color: this.colors.danger }
            ],
            disk: [
                { value: 70, label: 'High Disk', color: this.colors.warning },
                { value: 90, label: 'Critical Disk', color: this.colors.danger }
            ]
        };
        
        return thresholds[metric] || [];
    }

    getChartTitle(metric) {
        const titles = {
            cpu: 'CPU Usage Over Time',
            memory: 'Memory Usage Over Time',
            disk: 'Disk Usage Over Time'
        };
        
        return titles[metric] || 'System Performance';
    }

    updateSystemChart(metric) {
        this.currentMetric = metric;
        this.drawSystemPerformanceChart();
        
        console.log(`Chart updated to show ${metric} metrics`);
    }

    updateChartsForPeriod(period) {
        // Update chart data for new time period
        this.drawSystemPerformanceChart();
        
        const periodText = {
            '7d': '7 days',
            '30d': '30 days',
            '90d': '90 days'
        };
        
        console.log(`Charts updated for ${periodText[period]} period`);
    }

    refreshCharts() {
        // Refresh all charts with new data
        this.drawSystemPerformanceChart();
        console.log('System charts refreshed');
    }

    exportChartAsImage(chartName) {
        const chart = this.charts[chartName];
        if (!chart) return null;

        return chart.canvas.toDataURL('image/png');
    }

    animateChart(duration = 1000) {
        const chart = this.charts.systemPerformance;
        if (!chart) return;

        let progress = 0;
        const step = 16; // ~60fps
        const increment = step / duration;

        const animate = () => {
            progress += increment;
            if (progress >= 1) {
                progress = 1;
            }

            chart.ctx.globalAlpha = progress;
            this.drawSystemPerformanceChart();
            chart.ctx.globalAlpha = 1;

            if (progress < 1) {
                setTimeout(animate, step);
            }
        };

        animate();
    }

    // Responsive chart resizing
    resizeCharts() {
        const chart = this.charts.systemPerformance;
        if (chart) {
            const container = chart.canvas.parentElement;
            
            // Update canvas size
            chart.canvas.width = container.offsetWidth - 48; // Account for padding
            chart.canvas.height = 250;
            
            // Redraw chart
            this.drawSystemPerformanceChart();
        }
    }
}

// Global functions for chart controls
window.updateSystemChart = (metric) => {
    if (window.systemCharts) {
        window.systemCharts.updateSystemChart(metric);
    }
};

// Initialize charts when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const systemCharts = new SystemCharts();
    systemCharts.initialize();

    // Make charts available globally
    window.systemCharts = systemCharts;

    // Animate chart on load
    setTimeout(() => {
        systemCharts.animateChart(1500);
    }, 500);

    // Resize charts on window resize
    window.addEventListener('resize', Utils.debounce(() => {
        systemCharts.resizeCharts();
    }, 250));
});
