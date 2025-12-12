// ============================================
// AI CyberGuard - Static Analysis JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initDropZone();
    initTabs();
    initDllSections();
    initCopyButtons();
    initStringFilters();
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
// Drop Zone File Upload
// ============================================
function initDropZone() {
    var dropZone = document. getElementById('dropZone');
    var fileInput = document. getElementById('fileInput');
    
    if (!dropZone || !fileInput) return;
    
    // Click to browse
    dropZone.addEventListener('click', function(e) {
        if (e.target. tagName !== 'BUTTON') {
            fileInput.click();
        }
    });
    
    // Drag events
    dropZone.addEventListener('dragover', function(e) {
        e. preventDefault();
        dropZone.classList.add('drag-over');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
    });
    
    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        var files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });
    
    // File input change
    fileInput.addEventListener('change', function() {
        if (fileInput.files.length > 0) {
            handleFileUpload(fileInput. files[0]);
        }
    });
}

function handleFileUpload(file) {
    var uploadProgress = document.getElementById('uploadProgress');
    var fileName = document.getElementById('fileName');
    var fileSize = document.getElementById('fileSize');
    var progressFill = document.getElementById('progressFill');
    var progressPercent = document.getElementById('progressPercent');
    var progressStatus = document.getElementById('progressStatus');
    var resultsSection = document.getElementById('resultsSection');
    
    // Show progress
    uploadProgress. style.display = 'block';
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // Simulate upload progress
    var progress = 0;
    var uploadInterval = setInterval(function() {
        progress += Math.random() * 15;
        if (progress >= 100) {
            progress = 100;
            clearInterval(uploadInterval);
            
            // Show analyzing status
            progressStatus. innerHTML = '<i class="fas fa-cog fa-spin"></i> <span>Analyzing file...</span>';
            
            // Simulate analysis
            setTimeout(function() {
                progressStatus.innerHTML = '<i class="fas fa-check-circle"></i> <span>Analysis complete!</span>';
                progressStatus.classList.add('complete');
                
                // Show results
                setTimeout(function() {
                    showAnalysisResults(file);
                }, 500);
            }, 2000);
        }
        
        progressFill.style. width = progress + '%';
        progressPercent.textContent = Math.round(progress) + '%';
    }, 100);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    var k = 1024;
    var sizes = ['Bytes', 'KB', 'MB', 'GB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showAnalysisResults(file) {
    var resultsSection = document. getElementById('resultsSection');
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior:  'smooth' });
    
    // Update file info
    document.getElementById('infoFileName').textContent = file.name;
    document.getElementById('infoFileSize').textContent = formatFileSize(file.size);
    
    // Generate random threat score for demo
    var threatScore = Math.floor(Math.random() * 100);
    animateThreatScore(threatScore);
    
    // Update verdict based on score
    updateVerdict(threatScore);
}

function animateThreatScore(targetScore) {
    var scoreValue = document.getElementById('threatScore');
    var scoreCircle = document.getElementById('scoreCircle');
    var currentScore = 0;
    
    // Determine color class
    var colorClass = 'safe';
    if (targetScore > 70) {
        colorClass = 'danger';
    } else if (targetScore > 40) {
        colorClass = 'warning';
    }
    
    scoreCircle.classList.remove('safe', 'warning', 'danger');
    scoreCircle.classList. add(colorClass);
    
    // Animate score number
    var interval = setInterval(function() {
        currentScore += 1;
        if (currentScore >= targetScore) {
            currentScore = targetScore;
            clearInterval(interval);
        }
        scoreValue.textContent = currentScore;
    }, 20);
    
    // Animate circle
    var circumference = 339.292;
    var offset = circumference - (targetScore / 100 * circumference);
    scoreCircle.style. strokeDashoffset = offset;
}

function updateVerdict(score) {
    var verdictTitle = document.getElementById('threatVerdict');
    var verdictDesc = document.getElementById('threatDescription');
    var verdictTags = document.getElementById('verdictTags');
    
    verdictTags.innerHTML = '';
    
    if (score > 70) {
        verdictTitle. textContent = 'MALICIOUS FILE DETECTED';
        verdictTitle.className = 'malicious';
        verdictDesc.textContent = 'This file contains malicious code and should not be executed.';
        
        var tags = ['Trojan', 'Ransomware', 'Process Injection', 'Network Activity'];
        tags. forEach(function(tag) {
            var tagEl = document.createElement('span');
            tagEl.className = 'verdict-tag danger';
            tagEl.textContent = tag;
            verdictTags.appendChild(tagEl);
        });
    } else if (score > 40) {
        verdictTitle.textContent = 'SUSPICIOUS FILE';
        verdictTitle.className = 'suspicious';
        verdictDesc.textContent = 'This file exhibits suspicious behavior and requires further investigation.';
        
        var tags = ['Packed', 'Obfuscated', 'Unusual Imports'];
        tags.forEach(function(tag) {
            var tagEl = document.createElement('span');
            tagEl.className = 'verdict-tag warning';
            tagEl.textContent = tag;
            verdictTags.appendChild(tagEl);
        });
    } else {
        verdictTitle.textContent = 'FILE APPEARS CLEAN';
        verdictTitle.className = 'clean';
        verdictDesc.textContent = 'No malicious indicators were detected in this file. ';
        
        var tags = ['No Threats', 'Safe to Use'];
        tags.forEach(function(tag) {
            var tagEl = document.createElement('span');
            tagEl.className = 'verdict-tag info';
            tagEl.textContent = tag;
            verdictTags.appendChild(tagEl);
        });
    }
}

// ============================================
// Tabs
// ============================================
function initTabs() {
    var tabBtns = document. querySelectorAll('. tab-btn');
    
    tabBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var tabId = btn.getAttribute('data-tab');
            
            // Remove active from all
            tabBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(function(c) {
                c.classList.remove('active');
            });
            
            // Add active to clicked
            btn.classList. add('active');
            document.getElementById('tab-' + tabId).classList.add('active');
        });
    });
}

// ============================================
// DLL Sections Toggle
// ============================================
function initDllSections() {
    // First DLL section is expanded by default
    var firstHeader = document.querySelector('. dll-header');
    if (firstHeader) {
        firstHeader.classList.add('expanded');
    }
}

function toggleDll(header) {
    var functions = header.nextElementSibling;
    var isExpanded = header.classList.contains('expanded');
    
    if (isExpanded) {
        header.classList.remove('expanded');
        functions.style.display = 'none';
    } else {
        header.classList.add('expanded');
        functions.style.display = 'flex';
    }
}

// ============================================
// Copy Buttons
// ============================================
function initCopyButtons() {
    var copyBtns = document. querySelectorAll('. copy-btn');
    
    copyBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            var text = btn.parentElement.childNodes[0].textContent. trim();
            
            navigator.clipboard.writeText(text).then(function() {
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
// String Filters
// ============================================
function initStringFilters() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var searchInput = document.getElementById('stringsSearch');
    
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = btn.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(function(b) {
                b. classList.remove('active');
            });
            btn.classList.add('active');
            
            // Filter strings
            filterStrings(filter, searchInput ?  searchInput.value :  '');
        });
    });
    
    if (searchInput) {
        searchInput. addEventListener('input', function() {
            var activeFilter = document.querySelector('.filter-btn.active');
            var filter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
            filterStrings(filter, searchInput.value);
        });
    }
}

function filterStrings(type, searchTerm) {
    var strings = document.querySelectorAll('.string-item');
    
    strings.forEach(function(item) {
        var matchesType = type === 'all' || item.classList.contains(type);
        var matchesSearch = ! searchTerm || 
            item.querySelector('.string-value').textContent.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (matchesType && matchesSearch) {
            item.style. display = 'flex';
        } else {
            item. style.display = 'none';
        }
    });
}

// Make toggleDll available globally
window.toggleDll = toggleDll;

console.log('Static Analysis initialized! ');