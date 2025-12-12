// ============================================
// AI CyberGuard - Analytics JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initDateRangePicker();
    initCharts();
    initHeatmap();
    animateMetrics();
    initChartButtons();
});

// ============================================
// Particles Animation
// ============================================
function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    
    for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math. random() * 100 + '%';
        particle.style. top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math. random() * 15 + 's';
        container.appendChild(particle);
    }
}

// ============================================
// Date Range Picker
// ============================================
function initDateRangePicker() {
    var dateBtns = document. querySelectorAll('. date-btn');
    
    dateBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            dateBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // Update charts based on date range
            var range = btn.textContent.trim();
            updateChartsForRange(range);
        });
    });
}

function updateChartsForRange(range) {
    console.log('Updating charts for range:', range);
    // In a real app, you would fetch new data and update charts
}

// ============================================
// Initialize Charts
// ============================================
function initCharts() {
    initThreatTrendsChart();
    initAttackTypesChart();
    initSeverityChart();
    initResponseTimeChart();
}

function initThreatTrendsChart() {
    var ctx = document.getElementById('threatTrendsChart');
    if (!ctx) return;
    
    var gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 220);
    gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
    gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
    
    var gradient2 = ctx. getContext('2d').createLinearGradient(0, 0, 0, 220);
    gradient2.addColorStop(0, 'rgba(239, 68, 68, 0.3)');
    gradient2.addColorStop(1, 'rgba(239, 68, 68, 0)');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
            datasets: [
                {
                    label: 'Blocked',
                    data: [120, 150, 80, 90, 200, 350, 420, 380, 450, 520, 400, 280],
                    borderColor: '#6366f1',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor:  '#6366f1'
                },
                {
                    label: 'Detected',
                    data: [130, 160, 85, 95, 220, 380, 450, 400, 480, 550, 420, 300],
                    borderColor: '#ef4444',
                    backgroundColor: gradient2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius:  6,
                    pointHoverBackgroundColor: '#ef4444'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:  true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        color: 'rgba(255,255,255,0.7)',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 20
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

function initAttackTypesChart() {
    var ctx = document.getElementById('attackTypesChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Malware', 'Phishing', 'Intrusion', 'DDoS', 'Other'],
            datasets:  [{
                data: [32, 25, 19, 14, 10],
                backgroundColor:  [
                    '#ef4444',
                    '#f59e0b',
                    '#8b5cf6',
                    '#3b82f6',
                    '#64748b'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        color: 'rgba(255,255,255,0.7)',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding:  15
                    }
                }
            }
        }
    });
}

function initSeverityChart() {
    var ctx = document.getElementById('severityChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'bar',
        data:  {
            labels:  ['Critical', 'High', 'Medium', 'Low'],
            datasets: [{
                data: [12, 28, 45, 67],
                backgroundColor:  [
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(34, 197, 94, 0.8)'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)'
                    }
                }
            }
        }
    });
}

function initResponseTimeChart() {
    var ctx = document.getElementById('responseTimeChart');
    if (!ctx) return;
    
    new Chart(ctx, {
        type: 'line',
        data:  {
            labels:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Response Time (ms)',
                data: [320, 280, 350, 290, 310, 250, 300],
                borderColor:  '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointBackgroundColor: '#10b981'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display:  false
                }
            },
            scales:  {
                x:  {
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks:  {
                        color: 'rgba(255,255,255,0.5)'
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255,255,255,0.05)'
                    },
                    ticks: {
                        color: 'rgba(255,255,255,0.5)',
                        callback:  function(value) {
                            return value + 'ms';
                        }
                    }
                }
            }
        }
    });
}

// ============================================
// Heatmap
// ============================================
function initHeatmap() {
    var grid = document.getElementById('heatmapGrid');
    if (!grid) return;
    
    // Generate 7 days x 24 hours = 168 cells
    for (var day = 0; day < 7; day++) {
        for (var hour = 0; hour < 24; hour++) {
            var cell = document.createElement('div');
            cell.className = 'heatmap-cell';
            
            // Random intensity level
            var level = Math.floor(Math.random() * 6);
            if (level > 0) {
                cell.classList.add('level-' + level);
            }
            
            // Higher activity during work hours
            if (hour >= 9 && hour <= 17 && day < 5) {
                if (Math.random() > 0.3) {
                    cell. className = 'heatmap-cell level-' + (Math.floor(Math. random() * 3) + 3);
                }
            }
            
            cell.title = getDayName(day) + ' ' + formatHour(hour) + ': ' + Math.floor(Math.random() * 100) + ' attacks';
            grid.appendChild(cell);
        }
    }
}

function getDayName(index) {
    var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[index];
}

function formatHour(hour) {
    if (hour === 0) return '12 AM';
    if (hour < 12) return hour + ' AM';
    if (hour === 12) return '12 PM';
    return (hour - 12) + ' PM';
}

// ============================================
// Animate Metrics
// ============================================
function animateMetrics() {
    var metrics = document.querySelectorAll('.metric-value[data-count]');
    
    metrics.forEach(function(metric) {
        var target = parseInt(metric.getAttribute('data-count'));
        var duration = 2000;
        var step = target / (duration / 16);
        var current = 0;
        
        var timer = setInterval(function() {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            metric.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// ============================================
// Chart Type Buttons
// ============================================
function initChartButtons() {
    var chartBtns = document. querySelectorAll('. chart-btn');
    
    chartBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var parent = btn.parentElement;
            parent.querySelectorAll('.chart-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            // In a real app, this would change the chart type
            console.log('Chart type changed to:', btn. textContent);
        });
    });
}

console.log('Analytics page initialized! ');