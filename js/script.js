// ===============================
// CONFIG
// ===============================
const BASE = "/BEHS-Engineering-Hub";

// ===============================
// LOAD SIDEBAR
// ===============================
async function loadSidebar() {
    const container = document.getElementById("sidebar-container");
    if (!container) return;

    try {
        const res = await fetch(`${BASE}/components/sidebar.html`);
        if (!res.ok) throw new Error(`Sidebar failed: ${res.status}`);

        const html = await res.text();
        container.innerHTML = html;

        initSidebar();
        initToggle();
        initResponsive(); 
    } catch (err) {
        console.error(err);
        container.innerHTML = "<p style='color:red;'>Sidebar failed to load</p>";
    }
}

function initSidebar() {
    document.querySelectorAll(".menu-title").forEach(title => {
        title.addEventListener("click", () => {
            const submenu = title.nextElementSibling;
            if (submenu) submenu.classList.toggle("open");
        });
    });
}

function initToggle() {
    const btn = document.getElementById("menu-toggle");
    if (!btn) return;

    btn.addEventListener("click", () => {
        const sidebar = document.getElementById("sidebar");
        const main = document.querySelector(".main");
        if (sidebar && main) {
            sidebar.classList.toggle("closed");
            main.classList.toggle("expanded");
        }
    });
}

// ===============================
// RESOURCE SEARCH FILTER
// ===============================
function filterResources() {
    let input = document.getElementById('resourceSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('media-card');
    
    for (let card of cards) {
        let title = card.querySelector('h3').innerText.toLowerCase();
        let tags = card.getAttribute('data-tags').toLowerCase();
        
        let categoryElement = card.querySelector('.category-label');
        let category = categoryElement ? categoryElement.innerText.toLowerCase() : "";
        
        if (title.includes(input) || tags.includes(input) || category.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

// ===============================
// LOAD RESOURCES
// ===============================
async function loadResources() {
    const grid = document.getElementById('resource-grid');
    if (!grid) return; 

    try {
        const response = await fetch(`${BASE}/articles.json`);
        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const articles = await response.json();
      
        grid.innerHTML = articles.map(item => `
            <div class="media-card" data-tags="${item.tags || ''}">
                <div class="category-label">${item.category || ''}</div>
                
                <div class="card-image">
                    <img src="${BASE}/images/icons/${item.icon || 'default-icon.png'}" 
                         class="card-icon" 
                         onerror="this.src='${BASE}/images/icons/default-icon.png';">
                </div>

                <h3>${item.title}</h3>

                <div class="media-links">
                    <a href="${item.articleUrl}" target="_blank" class="media-btn article">View Article</a>
                    ${item.podcastUrl !== '#' ? `<button class="media-btn podcast" onclick="togglePlayer('audio-${item.id}')">Listen</button>` : ''}
                    ${item.videoUrl !== '#' ? `<a href="${item.videoUrl}" target="_blank" class="media-btn video">Watch</a>` : ''}
                </div>
            </div>
        `).join('');
        
    } catch (err) {
        console.error("Resource error:", err);
    }
}

// ===============================
// GLOBAL HELPERS
// ===============================
function togglePlayer(id) {
    const player = document.getElementById(id);
    if (player) player.style.display = player.style.display === 'none' ? 'block' : 'none';
}

function initResponsive() {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");
    if (sidebar && main && window.innerWidth <= 768) {
        sidebar.classList.add("closed");
        main.classList.add("expanded");
    }
}

// Start everything
document.addEventListener("DOMContentLoaded", () => {
    loadSidebar();
    loadResources();
});
