// ============================================
// AI CyberGuard - AI Agents JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initModal();
    initViewToggle();
    initSliders();
    initAgentActions();
    initActivityFeed();
    initMetricsAnimation();
});

// ============================================
// Particles Animation
// ============================================
function initParticles() {
    var container = document.getElementById('particles');
    if (! container) return;
    
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
// Modal Handling
// ============================================
function initModal() {
    var modal = document.getElementById('createAgentModal');
    var openBtn = document.getElementById('btnCreateAgent');
    var closeBtn = document. getElementById('closeModal');
    var cancelBtn = document.getElementById('cancelCreate');
    
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.classList.add('active');
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal. classList.remove('active');
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.classList. remove('active');
        });
    }
    
    // Close on overlay click
    if (modal) {
        modal. addEventListener('click', function(e) {
            if (e. target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Close on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal. classList.contains('active')) {
            modal.classList.remove('active');
        }
    });
}

// ============================================
// View Toggle (Grid/List)
// ============================================
function initViewToggle() {
    var toggleBtns = document. querySelectorAll('. toggle-btn');
    var agentsContainer = document.getElementById('agentsContainer');
    
    toggleBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var view = btn.getAttribute('data-view');
            
            // Update active button
            toggleBtns.forEach(function(b) {
                b. classList.remove('active');
            });
            btn.classList.add('active');
            
            // Update container class
            if (view === 'list') {
                agentsContainer.classList. add('list-view');
            } else {
                agentsContainer.classList.remove('list-view');
            }
        });
    });
}

// ============================================
// Slider Values
// ============================================
function initSliders() {
    var sliders = document. querySelectorAll('. slider-group input[type="range"]');
    
    sliders.forEach(function(slider) {
        var valueSpan = slider. nextElementSibling;
        
        slider.addEventListener('input', function() {
            valueSpan.textContent = slider.value + '%';
        });
    });
}

// ============================================
// Agent Actions
// ============================================
function initAgentActions() {
    var agentBtns = document. querySelectorAll('. agent-btn');
    
    agentBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var card = btn.closest('. agent-card');
            var agentName = card.querySelector('. agent-title h4').textContent;
            var action = getActionFromButton(btn);
            
            // Show feedback
            showToast(agentName + ': ' + action);
            
            // Update card status based on action
            if (action === 'Paused') {
                updateAgentStatus(card, 'idle');
            } else if (action === 'Started') {
                updateAgentStatus(card, 'active');
            }
        });
    });
}

function getActionFromButton(btn) {
    if (btn.classList. contains('pause')) return 'Paused';
    if (btn.classList.contains('stop')) return 'Stopped';
    if (btn.classList. contains('start')) return 'Started';
    if (btn.querySelector('.fa-eye')) return 'Viewing details';
    if (btn.querySelector('. fa-cog')) return 'Opening settings';
    if (btn.querySelector('. fa-file-alt')) return 'Opening logs';
    return 'Action performed';
}

function updateAgentStatus(card, status) {
    card.setAttribute('data-status', status);
    var badge = card.querySelector('. agent-status-badge');
    
    if (status === 'idle') {
        badge.className = 'agent-status-badge idle';
        badge.innerHTML = '<span class="status-dot"></span> Idle';
    } else if (status === 'active') {
        badge. className = 'agent-status-badge online';
        badge. innerHTML = '<span class="status-dot"></span> Active';
    }
}

function showToast(message) {
    // Remove existing toast
    var existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fas fa-check-circle"></i> ' + message;
    toast.style.cssText = 'position: fixed; bottom: 30px; right: 30px; padding: 16px 24px; background: var(--bg-card); border: 1px solid var(--accent-primary); border-radius: var(--border-radius-sm); color: var(--text-primary); display: flex; align-items: center; gap: 10px; z-index: 1001; animation: slideIn 0.3s ease;';
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(function() {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// ============================================
// Activity Feed Animation
// ============================================
function initActivityFeed() {
    var activities = [
        {
            icon: 'fa-shield-alt',
            type: 'success',
            agent: 'Guardian-04',
            action: 'blocked ransomware attempt'
        },
        {
            icon:  'fa-search',
            type:  'warning',
            agent:  'Hunter-02',
            action: 'found suspicious process'
        },
        {
            icon: 'fa-brain',
            type:  'info',
            agent: 'Neural-03',
            action:  'improved accuracy to 94. 5%'
        },
        {
            icon: 'fa-eye',
            type:  'success',
            agent:  'Sentinel-01',
            action:  'detected DDoS attempt'
        },
        {
            icon: 'fa-user-secret',
            type:  'warning',
            agent: 'Watcher-05',
            action: 'flagged unusual file access'
        }
    ];
    
    var activityIndex = 0;
    
    setInterval(function() {
        addNewActivity(activities[activityIndex % activities.length]);
        activityIndex++;
    }, 8000);
}

function addNewActivity(activity) {
    var feed = document.getElementById('agentActivityFeed');
    if (!feed) return;
    
    var item = document.createElement('div');
    item.className = 'activity-item';
    item.style.animation = 'slideIn 0.3s ease';
    item.innerHTML = 
        '<div class="activity-icon ' + activity.type + '">' +
            '<i class="fas ' + activity.icon + '"></i>' +
        '</div>' +
        '<div class="activity-content">' +
            '<p><strong>' + activity.agent + '</strong> ' + activity.action + '</p>' +
            '<span class="activity-time">Just now</span>' +
        '</div>';
    
    feed.insertBefore(item, feed.firstChild);
    
    // Update times
    updateActivityTimes();
    
    // Remove old items
    var items = feed.querySelectorAll('.activity-item');
    if (items.length > 10) {
        items[items.length - 1].remove();
    }
}

function updateActivityTimes() {
    var times = ['Just now', '1 min ago', '3 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '20 min ago'];
    var items = document.querySelectorAll('#agentActivityFeed .activity-item');
    
    items.forEach(function(item, index) {
        var timeSpan = item.querySelector('.activity-time');
        if (timeSpan && times[index]) {
            timeSpan.textContent = times[index];
        }
    });
}

// ============================================
// Metrics Animation
// ============================================
function initMetricsAnimation() {
    // Animate agent metrics periodically
    setInterval(function() {
        updateRandomMetrics();
    }, 5000);
}

function updateRandomMetrics() {
    var metricFills = document.querySelectorAll('.metric-fill');
    
    metricFills.forEach(function(fill) {
        if (Math.random() > 0.7) {
            var currentWidth = parseFloat(fill.style.width);
            var change = (Math.random() - 0.5) * 10;
            var newWidth = Math.max(10, Math.min(95, currentWidth + change));
            
            fill.style. width = newWidth + '%';
            
            // Update value text
            var metricHeader = fill.closest('.metric').querySelector('.metric-value');
            if (metricHeader) {
                metricHeader.textContent = Math.round(newWidth) + '%';
            }
            
            // Update high class for CPU
            if (fill.classList.contains('cpu')) {
                if (newWidth > 80) {
                    fill.classList.add('high');
                } else {
                    fill.classList.remove('high');
                }
            }
        }
    });
    
    // Update threats blocked
    var threatsBlocked = document.getElementById('threatsBlocked');
    if (threatsBlocked) {
        var current = parseInt(threatsBlocked.textContent. replace(/,/g, ''));
        threatsBlocked.textContent = (current + Math.floor(Math.random() * 5)).toLocaleString();
    }
}

// ============================================
// Add CSS Animation Keyframes
// ============================================
var style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideOut { from { opacity:  1; transform:  translateX(0); } to { opacity:  0; transform:  translateX(20px); } }';
document.head.appendChild(style);

console.log('AI Agents page initialized! ');