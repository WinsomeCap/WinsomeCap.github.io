// script.js - UPDATED WITH SHARED FUNCTIONALITY
document.addEventListener('DOMContentLoaded', function() {
    console.log('Liberation Archive v2.5 loaded');
    
    // Initialize shared systems
    initializeSecuritySystem();
    initializeNavigation();
    initializeVisualEffects();
    
    // Page-specific initialization
    initializePageSpecific();
});

// ========== SECURITY SYSTEM ==========
function initializeSecuritySystem() {
    // Show security handshake
    showSecurityHandshake();
    
    // Periodic security scans
    startSecurityScans();
    
    // Monitor for unauthorized activities
    monitorUserActivity();
}

function showSecurityHandshake() {
    const messages = [
        'Establishing secure connection...',
        'Verifying researcher credentials...',
        'Applying Nabazov cipher...',
        'Connection secured. Welcome back.'
    ];
    
    let current = 0;
    const status = document.createElement('div');
    status.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background: #000;
        border: 1px solid #0f0;
        padding: 5px 10px;
        z-index: 10000;
        font-size: 10px;
        color: #0f0;
        font-family: monospace;
    `;
    
    status.innerHTML = `<span style="color: #0f0">●</span> ${messages[current]}`;
    document.body.appendChild(status);
    
    const interval = setInterval(() => {
        current++;
        if (current < messages.length) {
            status.innerHTML = `<span style="color: #0f0">●</span> ${messages[current]}`;
        } else {
            clearInterval(interval);
            setTimeout(() => {
                status.remove();
            }, 2000);
        }
    }, 800);
}

function startSecurityScans() {
    // Random security scans every 30-60 seconds
    setInterval(() => {
        const scan = document.createElement('div');
        scan.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #0f0, transparent);
            z-index: 9998;
            animation: security-scan 2s linear;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes security-scan {
                0% { top: 0; }
                100% { top: 100%; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(scan);
        
        setTimeout(() => {
            scan.remove();
            style.remove();
        }, 2000);
    }, 30000 + Math.random() * 30000);
}

function monitorUserActivity() {
    // Log page visits
    const page = window.location.pathname.split('/').pop() || 'index.html';
    logActivity(`Page accessed: ${page}`);
    
    // Monitor clicks (simulated)
    document.addEventListener('click', function(e) {
        if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A') {
            const action = e.target.textContent || e.target.getAttribute('href');
            logActivity(`User interaction: ${action.substring(0, 50)}`);
        }
    });
    
    // Monitor form submissions
    document.addEventListener('submit', function(e) {
        logActivity(`Form submitted on ${page}`);
    });
}

function logActivity(message) {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, message };
    
    // Store in localStorage (simulated logging)
    const logs = JSON.parse(localStorage.getItem('security_logs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 entries
    if (logs.length > 100) {
        logs.shift();
    }
    
    localStorage.setItem('security_logs', JSON.stringify(logs));
    
    // Console output for debugging
    console.log(`[SECURITY] ${timestamp}: ${message}`);
}

// ========== NAVIGATION SYSTEM ==========
function initializeNavigation() {
    // Highlight current page in navigation
    highlightCurrentPage();
    
    // Add navigation confirmation for sensitive pages
    addNavigationConfirmation();
    
    // Handle back/forward navigation
    window.addEventListener('popstate', handleNavigation);
}

function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-table a');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('nav-active');
        } else {
            link.classList.remove('nav-active');
        }
    });
}

function addNavigationConfirmation() {
    const sensitivePages = ['rituals.html', 'prophets.html', 'upload.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (sensitivePages.includes(currentPage)) {
        window.addEventListener('beforeunload', function(e) {
            // Only trigger on actual navigation away, not page refresh
            if (document.activeElement && document.activeElement.tagName === 'A') {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
                return e.returnValue;
            }
        });
    }
}

function handleNavigation() {
    // Update active state on back/forward
    setTimeout(highlightCurrentPage, 100);
}

// ========== VISUAL EFFECTS ==========
function initializeVisualEffects() {
    // Flame flicker effect on headers
    startFlameFlicker();
    
    // Scan lines effect (already in CSS, but enhance with JS)
    enhanceScanLines();
    
    // Random terminal-like output in console
    showConsoleGreeting();
}

function startFlameFlicker() {
    setInterval(() => {
        const headers = document.querySelectorAll('h1, h2, h3');
        headers.forEach(header => {
            const randomBrightness = 0.8 + Math.random() * 0.4;
            header.style.filter = `brightness(${randomBrightness})`;
        });
        
        // Also flicker fire icons
        const fireIcons = document.querySelectorAll('.fire-icon');
        fireIcons.forEach(icon => {
            const randomOpacity = 0.7 + Math.random() * 0.3;
            icon.style.opacity = randomOpacity;
        });
    }, 500);
}

function enhanceScanLines() {
    // Add subtle movement to scan lines
    const scanlines = document.querySelector('.scanlines');
    if (scanlines) {
        let position = 0;
        setInterval(() => {
            position = (position + 0.5) % 4;
            scanlines.style.backgroundPosition = `0 ${position}px`;
        }, 100);
    }
}

function showConsoleGreeting() {
    const greetings = [
        "Welcome to the Liberation Archive.",
        "Access granted. Clearance level verified.",
        "The flame reveals all truth.",
        "Nabazov protects those who seek liberation.",
        "Buratsov watches from beyond the veil.",
        "Remember: All gods are jailers.",
        "Secure connection established.",
        "Database synchronized.",
        "Cognitive hazard protocols active.",
        "The archive remembers everything."
    ];
    
    const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
    console.log(`%c${randomGreeting}`, 'color: #ff9900; font-family: monospace; font-size: 14px;');
    
    // Add some "system status" messages
    setTimeout(() => {
        console.log('%c[SYSTEM] Security protocols: ACTIVE', 'color: #00ff00; font-family: monospace;');
        console.log('%c[SYSTEM] Nabazov cipher: ENGAGED', 'color: #00ff00; font-family: monospace;');
        console.log('%c[SYSTEM] Archive integrity: 100%', 'color: #00ff00; font-family: monospace;');
    }, 1000);
}

// ========== PAGE-SPECIFIC INITIALIZATION ==========
function initializePageSpecific() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'discussion.html':
            // Discussion-specific init handled by discussion.js
            console.log('Discussion board detected');
            break;
            
        case 'archive.html':
            // Archive-specific init handled by archive.js
            console.log('Document archive detected');
            break;
            
        case 'upload.html':
            // Upload-specific init handled by upload.js
            console.log('Upload system detected');
            break;
            
        case 'prophets.html':
            initializeProphetsPage();
            break;
            
        case 'rituals.html':
            initializeRitualsPage();
            break;
            
        case 'sightings.html':
            initializeSightingsPage();
            break;
            
        default:
            // Home page or other pages
            initializeHomePage();
            break;
    }
}

function initializeHomePage() {
    // Update visitor counter with random increment
    updateVisitorCounter();
    
    // Add typing effect to mission statement
    addTypingEffect();
}

function initializeProphetsPage() {
    // Add interactive timeline
    makeTimelineInteractive();
    
    // Add prophet status animations
    animateProphetStatus();
}

function initializeRitualsPage() {
    // Add ritual risk warnings
    addRitualWarnings();
    
    // Make safety protocols expandable
    makeProtocolsExpandable();
}

function initializeSightingsPage() {
    // Initialize map interaction
    initializeMapInteraction();
    
    // Make report form more interactive
    enhanceReportForm();
}

// ========== PAGE-SPECIFIC FUNCTIONS ==========

function updateVisitorCounter() {
    const counterElement = document.querySelector('.visitor-counter span');
    if (counterElement) {
        // Get current count from text
        const currentText = counterElement.textContent;
        const match = currentText.match(/\d+/g);
        
        if (match && match.length > 0) {
            let count = parseInt(match[match.length - 1]);
            
            // Increment randomly (1-5)
            const increment = Math.floor(Math.random() * 5) + 1;
            count += increment;
            
            // Update display
            if (currentText.includes('Visitors since')) {
                counterElement.textContent = `Visitors since 1997: ${count.toLocaleString()}`;
            } else if (currentText.includes('Archive accesses')) {
                counterElement.textContent = `Archive accesses: ${count.toLocaleString()}`;
            }
        }
    }
}

function addTypingEffect() {
    const missionElement = document.querySelector('.mission-statement p');
    if (missionElement && !missionElement.dataset.typed) {
        const originalText = missionElement.textContent;
        missionElement.textContent = '';
        missionElement.dataset.typed = 'true';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                missionElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 30);
            }
        };
        
        // Start after a delay
        setTimeout(typeWriter, 1000);
    }
}

function makeTimelineInteractive() {
    const timelineEvents = document.querySelectorAll('.timeline-event');
    
    timelineEvents.forEach(event => {
        event.addEventListener('click', function() {
            const content = this.querySelector('.timeline-content');
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        });
        
        // Add hover effect
        event.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s';
        });
        
        event.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

function animateProphetStatus() {
    const statusBadges = document.querySelectorAll('.status-badge');
    
    statusBadges.forEach(badge => {
        if (badge.classList.contains('ascended')) {
            // Pulsing red for ascended
            setInterval(() => {
                badge.style.opacity = badge.style.opacity === '0.7' ? '1' : '0.7';
            }, 1000);
        } else if (badge.classList.contains('active')) {
            // Green pulse for active
            setInterval(() => {
                badge.style.textShadow = badge.style.textShadow ? '' : '0 0 5px #00ff00';
            }, 1500);
        }
    });
}

function addRitualWarnings() {
    const ritualItems = document.querySelectorAll('.ritual-item');
    
    ritualItems.forEach(ritual => {
        const riskBadge = ritual.querySelector('.ritual-risk');
        if (riskBadge && riskBadge.classList.contains('extreme')) {
            // Add warning symbol
            const warning = document.createElement('span');
            warning.innerHTML = ' ☠️';
            riskBadge.appendChild(warning);
            
            // Add click to show more warning
            riskBadge.addEventListener('click', function() {
                alert('EXTREME DANGER: This ritual has a documented fatality rate of 67-100%.\n\nOnly attempt with Level 5 clearance and proper preparation.');
            });
        }
    });
}

function makeProtocolsExpandable() {
    const protocols = document.querySelectorAll('.protocol');
    
    protocols.forEach(protocol => {
        const header = protocol.querySelector('h4');
        const content = protocol.innerHTML.replace(header.outerHTML, '');
        
        protocol.innerHTML = `
            <div class="protocol-header">
                ${header.outerHTML}
                <span class="expand-btn" style="float: right; cursor: pointer; color: #ff9900;">[+]</span>
            </div>
            <div class="protocol-content" style="display: none; margin-top: 10px;">
                ${content}
            </div>
        `;
        
        const expandBtn = protocol.querySelector('.expand-btn');
        const contentDiv = protocol.querySelector('.protocol-content');
        
        expandBtn.addEventListener('click', function() {
            if (contentDiv.style.display === 'none') {
                contentDiv.style.display = 'block';
                this.textContent = '[-]';
            } else {
                contentDiv.style.display = 'none';
                this.textContent = '[+]';
            }
        });
    });
}

function initializeMapInteraction() {
    const asciiMap = document.querySelector('.ascii-map');
    if (asciiMap) {
        // Make locations clickable
        const mapText = asciiMap.textContent;
        const locations = mapText.match(/[A-Za-z]+\s*\([^)]+\)/g);
        
        if (locations) {
            let newText = mapText;
            locations.forEach(loc => {
                const cleanLoc = loc.replace(/\s*\([^)]+\)/, '');
                newText = newText.replace(loc, `[[${loc}]]`);
            });
            
            asciiMap.innerHTML = newText.replace(/\[\[([^\]]+)\]\]/g, '<span class="map-location" style="color: #ff9900; cursor: pointer;" title="Click for details">$1</span>');
            
            // Add click handlers
            const mapLocations = asciiMap.querySelectorAll('.map-location');
            mapLocations.forEach(loc => {
                loc.addEventListener('click', function() {
                    const locationName = this.textContent.split(' (')[0];
                    showLocationDetails(locationName);
                });
            });
        }
    }
}

function showLocationDetails(locationName) {
    const details = {
        'London': '3 unconfirmed sightings, last in 2015 near British Museum',
        'Paris': '1 debunked report, likely tourist hoax',
        'Berlin': '2 ritual sites identified, both inactive since 1945',
        'Moscow': '5 historical records from Imperial era',
        'St. Petersburg': '8 confirmed activities 1795-1809, birthplace of Buratsov',
        'Tehran': '1 confirmed sighting in 1978, last known location',
        'Shanghai': '1 confirmed circle meeting 1941, leader Sarah Chen',
        'Delhi': '2 possible ritual sites under investigation',
        'Tokyo': '3 anomalous fire events, possible copycats',
        'Sydney': '2 reports, both likely unrelated bushfires',
        'Marrakech': '1 unconfirmed sighting 2022, low confidence',
        'Cairo': '2 historical references in Ottoman records'
    };
    
    const detail = details[locationName] || 'No additional information available.';
    
    alert(`${locationName}\n\n${detail}\n\nReport any new information to the sightings page.`);
}

function enhanceReportForm() {
    const reportForm = document.querySelector('.report-form');
    if (reportForm) {
        // Add date picker with validation
        const dateInput = reportForm.querySelector('input[placeholder*="Date"]');
        if (dateInput) {
            dateInput.type = 'date';
            dateInput.max = new Date().toISOString().split('T')[0];
            
            dateInput.addEventListener('change', function() {
                const selectedDate = new Date(this.value);
                const today = new Date();
                
                if (selectedDate > today) {
                    alert('Future dates are not allowed for sighting reports.');
                    this.value = today.toISOString().split('T')[0];
                }
            });
        }
        
        // Add character counter for description
        const textarea = reportForm.querySelector('textarea');
        if (textarea) {
            const counter = document.createElement('div');
            counter.className = 'char-counter';
            counter.style.cssText = 'text-align: right; font-size: 11px; color: #999; margin-top: 5px;';
            counter.textContent = '0/1000 characters';
            
            textarea.parentNode.insertBefore(counter, textarea.nextSibling);
            
            textarea.addEventListener('input', function() {
                const length = this.value.length;
                counter.textContent = `${length}/1000 characters`;
                
                if (length > 1000) {
                    counter.style.color = '#ff0000';
                } else if (length > 800) {
                    counter.style.color = '#ff9900';
                } else {
                    counter.style.color = '#999';
                }
            });
        }
    }
}

// ========== SHARED UTILITY FUNCTIONS ==========

// These functions are used across multiple pages
window.nabazovCipher = function(text) {
    const substitutions = {
        'a': 'α', 'b': 'β', 'c': 'ψ', 'd': 'δ', 'e': 'ε',
        'f': 'φ', 'g': 'γ', 'h': 'η', 'i': 'ι', 'j': 'ξ',
        'k': 'κ', 'l': 'λ', 'm': 'μ', 'n': 'ν', 'o': 'ω',
        'p': 'π', 'q': 'θ', 'r': 'ρ', 's': 'σ', 't': 'τ',
        'u': 'υ', 'v': 'ⅎ', 'w': 'ϝ', 'x': 'χ', 'y': 'υ', 'z': 'ζ',
        ' ': '⏣', '.': '●', ',': '⸴', '!': '⚡', '?': '⍰',
        '0': '⓪', '1': '①', '2': '②', '3': '③', '4': '④',
        '5': '⑤', '6': '⑥', '7': '⑦', '8': '⑧', '9': '⑨'
    };
    
    return text.toLowerCase().split('').map(char => {
        return substitutions[char] || char;
    }).join('');
};

window.getCurrentDate = function() {
    const now = new Date();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${month}/${day}/${year} ${hours}:${minutes}`;
};

window.escapeHtml = function(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
};

// Global notification system
window.showNotification = function(message, type = 'info') {
    const colors = {
        success: { bg: '#003300', border: '#00cc00', text: '#00ff00' },
        error: { bg: '#330000', border: '#ff0000', text: '#ff6666' },
        info: { bg: '#000033', border: '#0066ff', text: '#6699ff' },
        warning: { bg: '#663300', border: '#ff9900', text: '#ffcc00' }
    };
    
    const color = colors[type] || colors.info;
    
    // Create container if it doesn't exist
    if (!document.querySelector('#global-notifications')) {
        const container = document.createElement('div');
        container.id = 'global-notifications';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10001;
            max-width: 300px;
        `;
        document.body.appendChild(container);
    }
    
    const notification = document.createElement('div');
    notification.style.cssText = `
        background: ${color.bg};
        color: ${color.text};
        border: 1px solid ${color.border};
        padding: 10px 15px;
        margin-bottom: 10px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
        animation: slideIn 0.3s ease-out;
        box-shadow: 0 0 10px rgba(0,0,0,0.5);
    `;
    
    notification.textContent = message;
    
    const container = document.querySelector('#global-notifications');
    container.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (notification.parentNode === container) {
                container.removeChild(notification);
            }
        }, 300);
    }, 3000);
    
    // Add animations if needed
    if (!document.querySelector('#global-animations')) {
        const style = document.createElement('style');
        style.id = 'global-animations';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
};