// ============================================
// AI CyberGuard - Live Monitor JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initParticles();
    initLiveChart();
    initPacketStream();
    initAlerts();
    initHeatmap();
    initControls();
    initStats();
    updateTime();
    setInterval(updateTime, 1000);
});

var chartData = { normal: [], threat: [] };
var isPlaying = true;
var alertCount = 0;

// Particles
function initParticles() {
    var container = document.getElementById('particles');
    if (!container) return;
    
    for (var i = 0; i < 30; i++) {
        var particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        container.appendChild(particle);
    }
}

// Time Display
function updateTime() {
    var timeDisplay = document.getElementById('currentTime');
    if (timeDisplay) {
        var now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    }
}

// Live Chart
function initLiveChart() {
    for (var i = 0; i < 50; i++) {
        chartData.normal.push(50 + Math.random() * 50);
        chartData.threat.push(150 + Math.random() * 30);
    }
    updateChart();
    
    setInterval(function() {
        if (isPlaying) {
            chartData.normal.push(50 + Math.random() * 80);
            chartData.threat.push(140 + Math.random() * 40);
            if (chartData.normal.length > 50) {
                chartData. normal.shift();
                chartData.threat.shift();
            }
            updateChart();
        }
    }, 100);
}

function updateChart() {
    var normalLine = document.getElementById('normalLine');
    var normalArea = document.getElementById('normalArea');
    var threatLine = document. getElementById('threatLine');
    var threatArea = document.getElementById('threatArea');
    
    if (! normalLine) return;
    
    var width = 800;
    var height = 200;
    var points = chartData.normal.length;
    var stepX = width / (points - 1);
    
    var normalPath = 'M 0 ' + (height - chartData. normal[0]);
    var normalAreaPath = 'M 0 ' + height + ' L 0 ' + (height - chartData.normal[0]);
    var threatPath = 'M 0 ' + (height - chartData. threat[0]);
    var threatAreaPath = 'M 0 ' + height + ' L 0 ' + (height - chartData. threat[0]);
    
    for (var i = 1; i < points; i++) {
        var x = i * stepX;
        normalPath += ' L ' + x + ' ' + (height - chartData.normal[i]);
        normalAreaPath += ' L ' + x + ' ' + (height - chartData.normal[i]);
        threatPath += ' L ' + x + ' ' + (height - chartData.threat[i]);
        threatAreaPath += ' L ' + x + ' ' + (height - chartData.threat[i]);
    }
    
    normalAreaPath += ' L ' + width + ' ' + height + ' Z';
    threatAreaPath += ' L ' + width + ' ' + height + ' Z';
    
    normalLine.setAttribute('d', normalPath);
    normalArea.setAttribute('d', normalAreaPath);
    threatLine.setAttribute('d', threatPath);
    threatArea.setAttribute('d', threatAreaPath);
}

// Packet Stream
var protocols = ['TCP', 'UDP', 'HTTP', 'HTTPS', 'DNS', 'SSH', 'ICMP'];
var packetTypes = ['normal', 'normal', 'normal', 'normal', 'warning', 'threat'];

function initPacketStream() {
    var container = document.getElementById('packetStream');
    if (!container) return;
    
    for (var i = 0; i < 8; i++) {
        addPacket(container);
    }
    
    setInterval(function() {
        if (isPlaying) {
            addPacket(container);
        }
    }, 500);
}

function addPacket(container) {
    var packet = document.createElement('div');
    var type = packetTypes[Math.floor(Math.random() * packetTypes.length)];
    var protocol = protocols[Math.floor(Math. random() * protocols.length)];
    var srcIP = '192.168.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
    var dstIP = '10.0.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255);
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { hour12: false });
    
    packet.className = 'packet-line ' + type;
    packet.innerHTML = '<span class="packet-time">' + time + '</span>' +
                       '<span class="packet-protocol">' + protocol + '</span>' +
                       '<span class="packet-info">' + srcIP + ' → ' + dstIP + '</span>';
    
    container.insertBefore(packet, container.firstChild);
    
    var packets = container.querySelectorAll('.packet-line');
    if (packets.length > 20) {
        packets[packets.length - 1].remove();
    }
}

// Alerts
var alertTypes = [
    { title:  'SQL Injection', desc: 'Malicious query detected', icon: 'fa-database' },
    { title:  'Brute Force', desc:  'Multiple failed logins', icon: 'fa-key' },
    { title: 'Port Scan', desc: 'Sequential scanning', icon: 'fa-search' },
    { title: 'Malware', desc: 'Known signature found', icon: 'fa-bug' },
    { title:  'DDoS Attack', desc: 'Traffic spike detected', icon: 'fa-network-wired' }
];

function initAlerts() {
    var container = document.getElementById('alertsContainer');
    if (!container) return;
    
    addAlert(container);
    addAlert(container);
    
    setInterval(function() {
        if (isPlaying && Math.random() > 0.6) {
            addAlert(container);
            alertCount++;
            var countEl = document.getElementById('alertCount');
            if (countEl) countEl.textContent = alertCount;
        }
    }, 4000);
}

function addAlert(container) {
    var alert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    var now = new Date();
    var time = now.toLocaleTimeString('en-US', { hour12: false });
    
    var alertEl = document.createElement('div');
    alertEl.className = 'alert-item';
    alertEl.innerHTML = '<div class="alert-icon"><i class="fas ' + alert.icon + '"></i></div>' +
                        '<div class="alert-content">' +
                        '<div class="alert-title">' + alert. title + '</div>' +
                        '<div class="alert-desc">' + alert. desc + ' at ' + time + '</div>' +
                        '</div>';
    
    container. insertBefore(alertEl, container.firstChild);
    
    var alerts = container. querySelectorAll('. alert-item');
    if (alerts. length > 5) {
        alerts[alerts.length - 1].remove();
    }
}

// Heatmap
function initHeatmap() {
    var container = document.getElementById('heatmapContainer');
    if (!container) return;
    
    for (var i = 0; i < 60; i++) {
        var cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        
        var intensity = Math.random();
        var color;
        
        if (intensity < 0.3) {
            color = 'rgba(16, 185, 129, ' + (0.3 + intensity) + ')';
        } else if (intensity < 0.6) {
            color = 'rgba(245, 158, 11, ' + (0.3 + intensity) + ')';
        } else if (intensity < 0.8) {
            color = 'rgba(249, 115, 22, ' + (0.3 + intensity) + ')';
        } else {
            color = 'rgba(239, 68, 68, ' + (0.3 + intensity) + ')';
        }
        
        cell.style.background = color;
        cell.title = (60 - i) + ' minutes ago';
        container.appendChild(cell);
    }
    
    setInterval(function() {
        if (isPlaying) {
            updateHeatmap(container);
        }
    }, 5000);
}

function updateHeatmap(container) {
    var cells = container.querySelectorAll('.heatmap-cell');
    
    for (var i = cells.length - 1; i > 0; i--) {
        cells[i].style.background = cells[i - 1].style.background;
    }
    
    var intensity = Math.random();
    var color;
    
    if (intensity < 0.3) {
        color = 'rgba(16, 185, 129, ' + (0.3 + intensity) + ')';
    } else if (intensity < 0.6) {
        color = 'rgba(245, 158, 11, ' + (0.3 + intensity) + ')';
    } else if (intensity < 0.8) {
        color = 'rgba(249, 115, 22, ' + (0.3 + intensity) + ')';
    } else {
        color = 'rgba(239, 68, 68, ' + (0.3 + intensity) + ')';
    }
    
    cells[0].style.background = color;
}

// Controls
function initControls() {
    var playBtn = document.getElementById('playBtn');
    var pauseBtn = document.getElementById('pauseBtn');
    var resetBtn = document.getElementById('resetBtn');
    
    if (playBtn) {
        playBtn. addEventListener('click', function() {
            isPlaying = true;
            playBtn. classList.add('active');
            if (pauseBtn) pauseBtn.classList.remove('active');
        });
    }
    
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            isPlaying = false;
            pauseBtn.classList.add('active');
            if (playBtn) playBtn.classList.remove('active');
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            chartData.normal = [];
            chartData. threat = [];
            alertCount = 0;
            
            var streamContainer = document.getElementById('packetStream');
            var alertsContainer = document.getElementById('alertsContainer');
            var countEl = document.getElementById('alertCount');
            
            if (streamContainer) streamContainer.innerHTML = '';
            if (alertsContainer) alertsContainer.innerHTML = '';
            if (countEl) countEl.textContent = '0';
            
            for (var i = 0; i < 50; i++) {
                chartData.normal.push(50 + Math.random() * 50);
                chartData.threat.push(150 + Math.random() * 30);
            }
            updateChart();
        });
    }
    
    // Severity chips
    var chips = document.querySelectorAll('.chip');
    chips.forEach(function(chip) {
        chip.addEventListener('click', function() {
            chip.classList.toggle('active');
        });
    });
    
    // Source toggles
    var toggles = document.querySelectorAll('.source-toggle input');
    toggles.forEach(function(toggle) {
        toggle.addEventListener('change', function() {
            var item = toggle.closest('.source-item');
            if (toggle.checked) {
                item.classList. add('active');
            } else {
                item.classList. remove('active');
            }
        });
    });
}

// Stats
function initStats() {
    setInterval(function() {
        if (isPlaying) {
            updateStats();
        }
    }, 1000);
}

function updateStats() {
    var packetsEl = document.getElementById('packetsPerSec');
    var threatsEl = document.getElementById('activeThreats');
    var blockedEl = document. getElementById('blockedCount');
    var bandwidthEl = document.getElementById('bandwidth');
    var latencyEl = document. getElementById('latency');
    
    if (packetsEl) {
        var pps = 10000 + Math.floor(Math.random() * 5000);
        packetsEl.textContent = pps.toLocaleString();
    }
    
    if (threatsEl) {
        threatsEl.textContent = 15 + Math.floor(Math.random() * 20);
    }
    
    if (blockedEl) {
        var current = parseInt(blockedEl. textContent. replace(/,/g, '')) || 1000;
        blockedEl.textContent = (current + Math.floor(Math. random() * 5)).toLocaleString();
    }
    
    if (bandwidthEl) {
        bandwidthEl.textContent = (700 + Math.floor(Math.random() * 300));
    }
    
    if (latencyEl) {
        latencyEl. textContent = 8 + Math.floor(Math.random() * 10);
    }
}

console.log('Live Monitor initialized! ');