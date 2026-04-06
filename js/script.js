// ===============================
// CONFIG
// ===============================
const BASE = "/BEHS-Engineering-Hub";

// ===============================
// SIDEBAR INITIALIZATION
// ===============================
async function loadSidebar() {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    try {
        const res = await fetch(`${BASE}/components/sidebar.html`);
        if (!res.ok) throw new Error(`Sidebar fetch failed: ${res.status}`);

        const html = await res.text();
        container.innerHTML = html;

        // Re-attach listeners once HTML is injected
        initSidebarAccordion();
        initSidebarToggle();
    } catch (err) {
        console.error("Sidebar Error:", err);
    }
}

function initSidebarAccordion() {
    document.querySelectorAll(".menu-title").forEach(title => {
        title.onclick = () => {
            const submenu = title.nextElementSibling;
            if (submenu) submenu.classList.toggle("open");
        };
    });
}

function initSidebarToggle() {
    const btn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");

    if (btn && sidebar && main) {
        btn.onclick = () => {
            sidebar.classList.toggle("closed");
            main.classList.toggle("expanded");
        };
    }
}

// ===============================
// RESOURCE PAGE LOGIC
// ===============================
async function loadResources() {
    const grid = document.getElementById('resource-grid');
    if (!grid) return; 

    try {
        const response = await fetch(`${BASE}/articles.json`);
        if (!response.ok) throw new Error(`JSON fetch failed`);

        const articles = await response.json();
      
        grid.innerHTML = articles.map(item => `
            <div class="media-card" data-tags="${item.tags || ''}">
                <div class="category-label">${item.category || ''}</div>
                
                <div class="card-image">
                    <img src="${BASE}/images/icons/${item.icon || 'default-icon.png'}" 
                         class="card-icon" 
                         onerror="this.src='${BASE}/images/icons/default-icon.png'; this.onerror=null;">
                </div>

                <h3>${item.title}</h3>

                <div class="media-links">
                    <a href="${item.articleUrl}" target="_blank" class="media-btn article">View Article</a>
                    ${item.podcastUrl !== '#' ? `<button class="media-btn podcast" onclick="togglePlayer('audio-${item.id}')">Listen</button>` : ''}
                    ${item.videoUrl !== '#' ? `<a href="${item.videoUrl}" target="_blank" class="media-btn video">Watch</a>` : ''}
                </div>

                <div id="audio-${item.id}" class="player-container" style="display:none; margin-top:15px;">
                    <audio controls style="width:100%"><source src="${item.podcastUrl}" type="audio/mpeg"></audio>
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        console.error("Resource Load Error:", err);
    }
}

// Search Filter
function filterResources() {
    const input = document.getElementById('resourceSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('media-card');
    
    for (let card of cards) {
        const title = card.querySelector('h3').innerText.toLowerCase();
        const tags = card.getAttribute('data-tags').toLowerCase();
        const category = card.querySelector('.category-label').innerText.toLowerCase();
        
        if (title.includes(input) || tags.includes(input) || category.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

// Podcast Toggle
function togglePlayer(id) {
    const player = document.getElementById(id);
    if (player) {
        player.style.display = (player.style.display === 'none' || player.style.display === '') ? 'block' : 'none';
    }
}

// ===============================
// STARTUP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    loadResources();
});
