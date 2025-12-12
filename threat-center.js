// ============================================
// AI CyberGuard - Threat Center JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initFilterDropdown();
    initTableActions();
    initThreatModal();
    initAttackDots();
    initIOCCopy();
    initTableSearch();
    initPagination();
    updateThreatCounts();
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
// Filter Dropdown
// ============================================
function initFilterDropdown() {
    var filterBtn = document.getElementById('filterBtn');
    var filterMenu = document.getElementById('filterMenu');
    
    if (!filterBtn || !filterMenu) return;
    
    filterBtn. addEventListener('click', function(e) {
        e.stopPropagation();
        filterMenu.classList.toggle('active');
    });
    
    // Close on outside click
    document.addEventListener('click', function(e) {
        if (!filterMenu.contains(e.target) && !filterBtn.contains(e.target)) {
            filterMenu. classList.remove('active');
        }
    });
    
    // Apply filter button
    var applyBtn = filterMenu.querySelector('.apply-filter-btn');
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            filterMenu.classList.remove('active');
            applyFilters();
        });
    }
}

function applyFilters() {
    // Get selected filters
    var checkboxes = document. querySelectorAll('#filterMenu input[type="checkbox"]');
    var activeFilters = [];
    
    checkboxes.forEach(function(cb) {
        if (cb.checked) {
            activeFilters.push(cb.parentElement.textContent. trim());
        }
    });
    
    console.log('Applied filters:', activeFilters);
    showToast('Filters applied successfully');
}

// ============================================
// Table Actions
// ============================================
function initTableActions() {
    // Select all checkbox
    var selectAll = document.getElementById('selectAll');
    if (selectAll) {
        selectAll.addEventListener('change', function() {
            var checkboxes = document.querySelectorAll('#threatsTableBody input[type="checkbox"]');
            checkboxes.forEach(function(cb) {
                cb.checked = selectAll.checked;
            });
        });
    }
    
    // Row action buttons
    var rowActionBtns = document. querySelectorAll('. row-action-btn');
    rowActionBtns.forEach(function(btn) {
        btn. addEventListener('click', function(e) {
            e.stopPropagation();
            var action = btn.getAttribute('title');
            var row = btn.closest('. threat-row');
            var threatId = row.querySelector('.threat-id').textContent;
            
            handleRowAction(action, threatId, row);
        });
    });
    
    // Row click to open modal
    var threatRows = document.querySelectorAll('.threat-row');
    threatRows.forEach(function(row) {
        row.addEventListener('click', function(e) {
            if (e.target. tagName !== 'INPUT' && ! e.target.closest('.row-action-btn')) {
                openThreatModal(row);
            }
        });
    });
    
    // Export button
    var exportBtn = document.querySelector('.export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function() {
            showToast('Exporting threats data...');
            // Simulate export
            setTimeout(function() {
                showToast('Export completed:  threats_report.csv');
            }, 1500);
        });
    }
}

function handleRowAction(action, threatId, row) {
    switch(action) {
        case 'Investigate':
            showToast('Opening investigation for ' + threatId);
            openThreatModal(row);
            break;
        case 'Contain':
            showToast('Containing threat ' + threatId);
            updateRowStatus(row, 'contained');
            break;
        case 'Block':
            showToast('Blocking threat source for ' + threatId);
            updateRowStatus(row, 'resolved');
            break;
        default:
            showToast(action + ' action for ' + threatId);
    }
}

function updateRowStatus(row, newStatus) {
    var statusBadge = row.querySelector('.status-badge');
    if (statusBadge) {
        statusBadge.className = 'status-badge ' + newStatus;
        statusBadge. innerHTML = '<span class="status-dot"></span> ' + capitalizeFirst(newStatus);
    }
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// ============================================
// Threat Detail Modal
// ============================================
function initThreatModal() {
    var modal = document.getElementById('threatDetailModal');
    var closeBtn = document. getElementById('closeDetailModal');
    
    if (!modal) return;
    
    if (closeBtn) {
        closeBtn. addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal. classList.remove('active');
        }
    });
    
    // Close on Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList. contains('active')) {
            modal.classList.remove('active');
        }
    });
    
    // Modal action buttons
    var modalBtns = modal. querySelectorAll('. btn-action');
    modalBtns. forEach(function(btn) {
        btn.addEventListener('click', function() {
            var action = btn.textContent.trim();
            showToast('Action: ' + action);
            if (action. includes('Block')) {
                modal.classList.remove('active');
            }
        });
    });
}

function openThreatModal(row) {
    var modal = document.getElementById('threatDetailModal');
    if (!modal) return;
    
    // Update modal content based on row data
    var threatId = row.querySelector('. threat-id').textContent;
    var threatType = row.querySelector('. threat-type span').textContent;
    var severity = row.querySelector('.severity-badge').textContent;
    var source = row.querySelector('. source-info span').textContent;
    var target = row.querySelector('. target-info').textContent;
    
    // Update modal title
    var modalTitle = modal.querySelector('.modal-title-section h3');
    if (modalTitle) {
        modalTitle.textContent = threatId + ' - ' + threatType + ' Attack';
    }
    
    // Update severity badge
    var modalSeverity = modal.querySelector('.modal-title-section .severity-badge');
    if (modalSeverity) {
        modalSeverity.className = 'severity-badge ' + severity. toLowerCase();
        modalSeverity.textContent = severity;
    }
    
    modal.classList.add('active');
}

// ============================================
// Attack Dots on Mini Map
// ============================================
function initAttackDots() {
    var container = document.getElementById('attackDots');
    if (!container) return;
    
    var positions = [
        { x: 15, y: 30 },  // Russia
        { x:  75, y: 35 },  // China
        { x:  80, y: 25 },  // North Korea
        { x: 60, y: 40 },  // Iran
        { x:  25, y: 65 },  // Brazil
    ];
    
    positions.forEach(function(pos, index) {
        var dot = document. createElement('div');
        dot.className = 'attack-dot';
        dot. style.left = pos.x + '%';
        dot. style.top = pos.y + '%';
        dot.style.animationDelay = (index * 0.3) + 's';
        container.appendChild(dot);
    });
    
    // Add new dots periodically
    setInterval(function() {
        addRandomAttackDot(container);
    }, 5000);
}

function addRandomAttackDot(container) {
    var dot = document. createElement('div');
    dot.className = 'attack-dot';
    dot. style.left = (10 + Math.random() * 80) + '%';
    dot.style.top = (20 + Math.random() * 60) + '%';
    container.appendChild(dot);
    
    // Remove after animation
    setTimeout(function() {
        dot.remove();
    }, 3000);
}

// ============================================
// IOC Copy Functionality
// ============================================
function initIOCCopy() {
    var copyBtns = document. querySelectorAll('. ioc-copy');
    
    copyBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var iocValue = btn. parentElement.querySelector('.ioc-value').textContent;
            
            navigator.clipboard.writeText(iocValue).then(function() {
                var originalIcon = btn.innerHTML;
                btn. innerHTML = '<i class="fas fa-check"></i>';
                btn.style.color = 'var(--success)';
                
                setTimeout(function() {
                    btn.innerHTML = originalIcon;
                    btn.style.color = '';
                }, 1500);
            });
        });
    });
}

// ============================================
// Table Search
// ============================================
function initTableSearch() {
    var searchInput = document.getElementById('threatSearch');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        var searchTerm = searchInput.value.toLowerCase();
        var rows = document.querySelectorAll('#threatsTableBody . threat-row');
        
        rows. forEach(function(row) {
            var text = row.textContent.toLowerCase();
            if (text. includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ============================================
// Pagination
// ============================================
function initPagination() {
    var paginationBtns = document. querySelectorAll('. pagination-btn: not(: disabled)');
    
    paginationBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Remove active from all
            paginationBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            
            // Add active to clicked (if it's a number)
            if (! btn.querySelector('i')) {
                btn. classList.add('active');
            }
            
            showToast('Loading page ' + (btn.textContent || 'next'));
        });
    });
}

// ============================================
// Update Threat Counts
// ============================================
function updateThreatCounts() {
    // Simulate real-time updates
    setInterval(function() {
        // Random chance to update counts
        if (Math.random() > 0.7) {
            var stats = document.querySelectorAll('.threat-stat-value');
            
            stats.forEach(function(stat, index) {
                // Only update numeric values (not "2,847")
                var currentVal = parseInt(stat.textContent);
                if (! isNaN(currentVal) && currentVal < 100) {
                    var change = Math.random() > 0.5 ? 1 :  -1;
                    var newVal = Math.max(0, currentVal + change);
                    stat. textContent = newVal;
                }
            });
        }
    }, 10000);
}

// ============================================
// Toast Notification
// ============================================
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
    toast.style.cssText = 'position: fixed; bottom: 30px; right: 30px; padding: 16px 24px; background: var(--bg-card); border:  1px solid var(--accent-primary); border-radius: var(--border-radius-sm); color: var(--text-primary); display: flex; align-items: center; gap: 10px; z-index: 1001; animation: slideIn 0.3s ease; box-shadow: 0 10px 40px rgba(0,0,0,0.3);';
    
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
// Add CSS Animation Keyframes
// ============================================
var style = document.createElement('style');
style.textContent = '@keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } } @keyframes slideOut { from { opacity:  1; transform:  translateX(0); } to { opacity:  0; transform:  translateX(20px); } }';
document.head.appendChild(style);

console.log('Threat Center page initialized! ');