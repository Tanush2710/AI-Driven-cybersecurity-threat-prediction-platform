// ============================================
// AI CyberGuard - Settings JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initSettingsNav();
    initThemeSelector();
    initColorPicker();
    initSliders();
    initSaveButton();
    initIntegrations();
    initAPIKeys();
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
// Settings Navigation
// ============================================
function initSettingsNav() {
    var navItems = document.querySelectorAll('.settings-nav-item');
    var panels = document.querySelectorAll('.settings-panel');
    
    navItems.forEach(function(item) {
        item. addEventListener('click', function() {
            var section = item.getAttribute('data-section');
            
            // Update nav
            navItems.forEach(function(nav) {
                nav.classList. remove('active');
            });
            item.classList.add('active');
            
            // Update panels
            panels.forEach(function(panel) {
                panel.classList.remove('active');
            });
            
            var targetPanel = document.getElementById('panel-' + section);
            if (targetPanel) {
                targetPanel.classList. add('active');
            }
        });
    });
}

// ============================================
// Theme Selector
// ============================================
function initThemeSelector() {
    var themeBtns = document. querySelectorAll('. theme-btn');
    
    themeBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            themeBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            var theme = btn.getAttribute('data-theme');
            showToast('Theme changed to ' + theme);
            
            // In a real app, you would apply the theme here
            // document.body.setAttribute('data-theme', theme);
        });
    });
}

// ============================================
// Color Picker
// ============================================
function initColorPicker() {
    var colorBtns = document. querySelectorAll('. color-btn');
    
    colorBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            colorBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            btn.classList.add('active');
            
            var color = btn.style.background;
            showToast('Accent color updated');
            
            // In a real app, you would apply the color here
            // document. documentElement.style.setProperty('--accent-primary', color);
        });
    });
}

// ============================================
// Sliders
// ============================================
function initSliders() {
    // Confidence threshold slider
    var thresholdSlider = document.getElementById('confidenceThreshold');
    var thresholdValue = document.querySelector('. threshold-value');
    
    if (thresholdSlider && thresholdValue) {
        thresholdSlider.addEventListener('input', function() {
            thresholdValue.textContent = thresholdSlider. value + '%';
        });
    }
    
    // Sensitivity slider
    var sensitivitySlider = document.getElementById('sensitivity');
    if (sensitivitySlider) {
        sensitivitySlider.addEventListener('input', function() {
            var labels = ['Very Low', 'Low', 'Medium', 'High', 'Very High'];
            var value = parseInt(sensitivitySlider.value);
            // You could update a label here if needed
        });
    }
}

// ============================================
// Save Button
// ============================================
function initSaveButton() {
    var saveBtn = document. getElementById('btnSaveAll');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            // Add saving animation
            saveBtn. innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
            saveBtn.disabled = true;
            
            // Simulate save
            setTimeout(function() {
                saveBtn.innerHTML = '<i class="fas fa-check"></i> Saved! ';
                saveBtn.style.background = 'var(--success)';
                
                showToast('All settings saved successfully!', 'success');
                
                // Reset button after delay
                setTimeout(function() {
                    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save All Changes';
                    saveBtn.style.background = '';
                    saveBtn.disabled = false;
                }, 2000);
            }, 1500);
        });
    }
}

// ============================================
// Integrations
// ============================================
function initIntegrations() {
    var integrationBtns = document. querySelectorAll('. integration-btn');
    
    integrationBtns.forEach(function(btn) {
        btn. addEventListener('click', function() {
            var card = btn.closest('. integration-card');
            var name = card.querySelector('. integration-name').textContent;
            var isConnected = card.classList.contains('connected');
            
            if (isConnected) {
                if (confirm('Disconnect from ' + name + '?')) {
                    card.classList. remove('connected');
                    card.querySelector('.integration-status').textContent = 'Not Connected';
                    btn.textContent = 'Connect';
                    btn.classList.remove('disconnect');
                    btn.classList.add('connect');
                    showToast(name + ' disconnected');
                }
            } else {
                // Simulate connection
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                
                setTimeout(function() {
                    card.classList.add('connected');
                    card.querySelector('.integration-status').textContent = 'Connected';
                    btn. textContent = 'Disconnect';
                    btn.classList. remove('connect');
                    btn.classList.add('disconnect');
                    showToast(name + ' connected successfully! ', 'success');
                }, 1500);
            }
        });
    });
}

// ============================================
// API Keys
// ============================================
function initAPIKeys() {
    var keyBtns = document. querySelectorAll('. api-key-btn');
    
    keyBtns. forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = btn.getAttribute('title');
            var keyItem = btn.closest('. api-key-item');
            var keyName = keyItem. querySelector('.api-key-name').textContent;
            
            switch(action) {
                case 'Copy':
                    showToast('API key copied to clipboard', 'success');
                    btn.innerHTML = '<i class="fas fa-check"></i>';
                    setTimeout(function() {
                        btn. innerHTML = '<i class="fas fa-copy"></i>';
                    }, 1500);
                    break;
                    
                case 'Regenerate': 
                    if (confirm('Regenerate ' + keyName + '?  This will invalidate the current key. ')) {
                        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        setTimeout(function() {
                            btn. innerHTML = '<i class="fas fa-sync"></i>';
                            showToast('API key regenerated', 'success');
                        }, 1500);
                    }
                    break;
                    
                case 'Delete':
                    if (confirm('Delete ' + keyName + '? This action cannot be undone. ')) {
                        keyItem.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(function() {
                            keyItem. remove();
                            showToast('API key deleted');
                        }, 300);
                    }
                    break;
            }
        });
    });
    
    // Add new key button
    var addKeyBtn = document.querySelector('.btn-add-key');
    if (addKeyBtn) {
        addKeyBtn. addEventListener('click', function() {
            showToast('New API key generated! ', 'success');
        });
    }
}

// ============================================
// Toast Notification
// ============================================
function showToast(message, type) {
    type = type || 'info';
    
    // Remove existing toast
    var existingToast = document.querySelector('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    var icon = type === 'success' ? 'fa-check-circle' : 
               type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
    var color = type === 'success' ? 'var(--success)' : 
                type === 'error' ? 'var(--danger)' : 'var(--accent-primary)';
    
    // Create toast
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = '<i class="fas ' + icon + '" style="color:  ' + color + '"></i> ' + message;
    toast.style.cssText = 'position: fixed; bottom: 30px; right: 30px; padding: 16px 24px; background: var(--bg-card); border: 1px solid ' + color + '; border-radius: var(--border-radius-sm); color: var(--text-primary); display: flex; align-items: center; gap: 10px; z-index: 1001; animation: slideIn 0.3s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(function() {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
var style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideOut { from { opacity:  1; transform:  translateX(0); } to { opacity:  0; transform:  translateX(20px); } } @keyframes fadeOut { from { opacity:  1; } to { opacity: 0; } }';
document.head.appendChild(style);

console.log('Settings page initialized! ');