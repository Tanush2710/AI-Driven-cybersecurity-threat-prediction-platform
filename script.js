// ============================================
// AI CyberGuard - Dashboard JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initCounters();
    initAttackPoints();
    initLiveActivityFeed();
    initNavigation();
});

// ============================================
// Floating Particles Animation
// ============================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document. createElement('div');
        particle.className = 'particle';
        particle.style. left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math. random() * 15 + 's';
        particle.style.animationDuration = (10 + Math.random() * 10) + 's';
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// Animated Number Counters
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
        animateCounter(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.dataset. count);
    if (isNaN(target)) return;
    
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target.toLocaleString();
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// ============================================
// Attack Points on Map
// ============================================
function initAttackPoints() {
    const attackPointsContainer = document. getElementById('attackPoints');
    if (!attackPointsContainer) return;
    
    const attacks = [
        { x: 15, y: 30, severity: 'critical' },
        { x: 25, y: 45, severity: 'high' },
        { x: 40, y: 25, severity: 'medium' },
        { x: 55, y: 35, severity: 'critical' },
        { x:  65, y: 50, severity: 'low' },
        { x: 75, y: 40, severity: 'high' },
        { x: 85, y: 55, severity: 'medium' },
        { x: 30, y: 65, severity: 'low' },
        { x: 50, y: 70, severity: 'critical' },
        { x: 70, y: 75, severity: 'high' }
    ];
    
    attacks.forEach((attack, index) => {
        const point = document.createElement('div');
        point.className = 'attack-point ' + attack.severity;
        point.style.left = attack. x + '%';
        point. style.top = attack.y + '%';
        point.style.animationDelay = (index * 0.2) + 's';
        attackPointsContainer.appendChild(point);
    });
    
    // Add new attack points periodically
    setInterval(() => {
        addNewAttackPoint(attackPointsContainer);
    }, 5000);
}

function addNewAttackPoint(container) {
    const severities = ['critical', 'high', 'medium', 'low'];
    const severity = severities[Math.floor(Math. random() * severities.length)];
    
    const point = document.createElement('div');
    point.className = 'attack-point ' + severity;
    point.style.left = (10 + Math.random() * 80) + '%';
    point.style. top = (20 + Math.random() * 60) + '%';
    point.style. opacity = '0';
    point.style.transform = 'translate(-50%, -50%) scale(0)';
    
    container.appendChild(point);
    
    // Animate in
    setTimeout(() => {
        point. style.transition = 'all 0.5s ease';
        point.style.opacity = '1';
        point. style.transform = 'translate(-50%, -50%) scale(1)';
    }, 10);
    
    // Remove after some time
    setTimeout(() => {
        point.style.opacity = '0';
        point. style.transform = 'translate(-50%, -50%) scale(0)';
        setTimeout(() => point.remove(), 500);
    }, 10000);
}

// ============================================
// Live Activity Feed
// ============================================
function initLiveActivityFeed() {
    const activities = [
        {
            icon: 'fa-shield-alt',
            type: 'success',
            message: '<strong>Agent Guardian-04</strong> blocked malware attempt',
            time:  'Just now'
        },
        {
            icon:  'fa-user-secret',
            type:  'warning',
            message: '<strong>Suspicious login</strong> attempt detected',
            time: 'Just now'
        },
        {
            icon: 'fa-database',
            type:  'info',
            message: '<strong>Database backup</strong> completed successfully',
            time:  'Just now'
        },
        {
            icon:  'fa-bug',
            type:  'warning',
            message:  '<strong>Zero-day vulnerability</strong> detected',
            time:  'Just now'
        },
        {
            icon:  'fa-robot',
            type:  'info',
            message: '<strong>Agent Hunter-02</strong> initiated deep scan',
            time: 'Just now'
        }
    ];
    
    let activityIndex = 0;
    
    setInterval(() => {
        addNewActivity(activities[activityIndex % activities.length]);
        activityIndex++;
    }, 8000);
}

function addNewActivity(activity) {
    const feed = document.getElementById('activityFeed');
    if (!feed) return;
    
    const item = document.createElement('div');
    item.className = 'activity-item';
    item.style. animation = 'slideIn 0.3s ease';
    item.innerHTML = 
        '<div class="activity-icon ' + activity.type + '">' +
            '<i class="fas ' + activity.icon + '"></i>' +
        '</div>' +
        '<div class="activity-content">' +
            '<p>' + activity.message + '</p>' +
            '<span class="activity-time">' + activity. time + '</span>' +
        '</div>';
    
    feed.insertBefore(item, feed.firstChild);
    
    // Remove old items if too many
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
    
    // Update times for existing items
    updateActivityTimes();
}

function updateActivityTimes() {
    const items = document.querySelectorAll('.activity-item: not(: first-child) .activity-time');
    const times = ['1 min ago', '3 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '20 min ago', '25 min ago', '30 min ago'];
    
    items.forEach((item, index) => {
        if (times[index]) {
            item. textContent = times[index];
        }
    });
}

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function(e) {
            // Don't prevent default - allow navigation to other pages
            if (this.getAttribute('href') === '#') {
                e.preventDefault();
            }
        });
    });
}

// ============================================
// Real-time Data Simulation
// ============================================
setInterval(() => {
    // Update threat score randomly
    const threatValue = document.querySelector('.threat-value');
    if (threatValue) {
        const currentValue = parseInt(threatValue.textContent);
        if (! isNaN(currentValue)) {
            const change = (Math.random() > 0.5 ? 1 :  -1) * Math.floor(Math. random() * 3);
            const newValue = Math.max(30, Math.min(95, currentValue + change));
            threatValue.textContent = newValue;
        }
    }
}, 3000);

// Add slideIn animation
const style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }';
document.head. appendChild(style);

console.log('Dashboard initialized successfully!');