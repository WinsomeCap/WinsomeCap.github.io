// nav.js - Navigation System
document.addEventListener('DOMContentLoaded', function() {
    // Set active navigation based on current page
    setActiveNav();
    
    // Add navigation event listeners
    initializeNavigation();
    
    // Common security handshake
    simulateSecurityHandshake();
});

function setActiveNav() {
    const currentPage = getCurrentPage();
    const navLinks = document.querySelectorAll('.nav-table a');
    
    navLinks.forEach(link => {
        link.classList.remove('nav-active');
        if (link.getAttribute('href').includes(currentPage)) {
            link.classList.add('nav-active');
        }
    });
}

function getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('archive')) return 'archive';
    if (path.includes('prophets')) return 'prophets';
    if (path.includes('rituals')) return 'rituals';
    if (path.includes('sightings')) return 'sightings';
    if (path.includes('discussion')) return 'discussion';
    if (path.includes('upload')) return 'upload';
    return 'home';
}

function initializeNavigation() {
    // Intercept navigation clicks for smooth transitions
    document.querySelectorAll('.nav-table a').forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                // Internal page link
                e.preventDefault();
                const page = this.getAttribute('href').substring(1);
                navigateToPage(page);
            }
        });
    });
    
    // Add navigation state to localStorage
    if (!localStorage.getItem('last_visited')) {
        localStorage.setItem('last_visited', 'home');
    }
}

function navigateToPage(page) {
    // Show loading animation
    const loading = document.createElement('div');
    loading.id = 'page-loading';
    loading.innerHTML = `
        <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
             background: rgba(0,0,0,0.9); z-index: 10000; display: flex; 
             align-items: center; justify-content: center; flex-direction: column;">
            <div style="color: #cc9900; font-size: 24px; margin-bottom: 20px;">
                LOADING ${page.toUpperCase()}...
            </div>
            <div style="color: #ff9900; font-family: monospace;">
                [██████████] 100%
            </div>
            <div style="color: #999; margin-top: 20px; font-size: 12px;">
                Applying Nabazov cipher decryption...
            </div>
        </div>
    `;
    document.body.appendChild(loading);
    
    // Save navigation state
    localStorage.setItem('last_visited', page);
    
    // Navigate after delay (simulating loading)
    setTimeout(() => {
        if (page === 'home') {
            window.location.href = 'index.html';
        } else {
            window.location.href = `${page}.html`;
        }
    }, 800);
}

function simulateSecurityHandshake() {
    console.log(`Liberation Archive - ${getCurrentPage().toUpperCase()} module loaded`);
    console.log('Security Protocol: Nabazov Cipher v2.4 active');
}