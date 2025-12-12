// ============================================
// AI CyberGuard - Reports JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initModal();
    initTemplateCards();
    initFilterTabs();
    initReportActions();
    initFormatOptions();
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
// Modal Handling
// ============================================
function initModal() {
    var modal = document.getElementById('generateReportModal');
    var openBtn = document.getElementById('btnGenerateReport');
    var closeBtn = document.getElementById('closeReportModal');
    var cancelBtn = document.getElementById('cancelReport');
    
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
    
    // Generate button
    var generateBtn = document. querySelector('.btn-generate-modal');
    if (generateBtn) {
        generateBtn. addEventListener('click', function() {
            var reportName = document.getElementById('reportName').value;
            var reportType = document.getElementById('reportType').value;
            
            if (!reportName || !reportType) {
                showToast('Please fill in all required fields', 'error');
                return;
            }
            
            modal.classList.remove('active');
            showToast('Generating report:  ' + reportName);
            
            // Simulate report generation
            setTimeout(function() {
                showToast('Report generated successfully!', 'success');
            }, 2000);
        });
    }
}

// ============================================
// Template Cards
// ============================================
function initTemplateCards() {
    var templateBtns = document. querySelectorAll('. template-btn');
    
    templateBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var card = btn.closest('.template-card');
            var type = card.getAttribute('data-type');
            var title = card.querySelector('h4').textContent;
            
            showToast('Generating ' + title + '...');
            
            // Simulate generation
            setTimeout(function() {
                showToast(title + ' generated successfully!', 'success');
            }, 2000);
        });
    });
    
    // Card click
    var templateCards = document.querySelectorAll('.template-card');
    templateCards.forEach(function(card) {
        card.addEventListener('click', function() {
            var btn = card.querySelector('.template-btn');
            btn.click();
        });
    });
}

// ============================================
// Filter Tabs
// ============================================
function initFilterTabs() {
    var filterTabs = document.querySelectorAll('.filter-tab');
    
    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            filterTabs.forEach(function(t) {
                t.classList.remove('active');
            });
            tab.classList.add('active');
            
            var filter = tab.getAttribute('data-filter');
            filterReports(filter);
        });
    });
}

function filterReports(filter) {
    var rows = document.querySelectorAll('.report-row');
    
    rows.forEach(function(row) {
        if (filter === 'all') {
            row.style.display = '';
            return;
        }
        
        var status = row.querySelector('.report-status');
        if (status) {
            var statusText = status. textContent. toLowerCase();
            if (filter === 'generated' && statusText === 'completed') {
                row.style.display = '';
            } else if (filter === 'scheduled' && statusText === 'scheduled') {
                row.style.display = '';
            } else if (filter === 'shared') {
                // For demo, show all for "shared" filter
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        }
    });
}

// ============================================
// Report Actions
// ============================================
function initReportActions() {
    var actionBtns = document.querySelectorAll('.report-action-btn');
    
    actionBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var action = btn. getAttribute('title');
            var row = btn.closest('. report-row');
            var reportName = row.querySelector('. report-name span').textContent;
            
            switch(action) {
                case 'Download':
                    showToast('Downloading ' + reportName + '...');
                    setTimeout(function() {
                        showToast('Download complete!', 'success');
                    }, 1500);
                    break;
                case 'View':
                    showToast('Opening ' + reportName + '...');
                    break;
                case 'Share':
                    showToast('Share link copied to clipboard!', 'success');
                    break;
                case 'Delete':
                    if (confirm('Are you sure you want to delete this report?')) {
                        row.style.animation = 'fadeOut 0.3s ease';
                        setTimeout(function() {
                            row.remove();
                            showToast('Report deleted', 'success');
                        }, 300);
                    }
                    break;
                case 'Edit':
                    showToast('Opening schedule editor.. .');
                    break;
                case 'Cancel':
                    if (confirm('Are you sure you want to cancel?')) {
                        row.remove();
                        showToast('Cancelled', 'success');
                    }
                    break;
            }
        });
    });
}

// ============================================
// Format Options
// ============================================
function initFormatOptions() {
    var formatOptions = document.querySelectorAll('.format-option');
    
    formatOptions.forEach(function(option) {
        option.addEventListener('click', function() {
            formatOptions.forEach(function(o) {
                o.classList.remove('active');
            });
            option.classList.add('active');
            option.querySelector('input').checked = true;
        });
    });
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
        toast. style.animation = 'slideOut 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Add CSS animations
var style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideOut { from { opacity:  1; transform:  translateX(0); } to { opacity:  0; transform:  translateX(20px); } } @keyframes fadeOut { from { opacity:  1; } to { opacity: 0; } }';
document.head.appendChild(style);

console.log('Reports page initialized! ');