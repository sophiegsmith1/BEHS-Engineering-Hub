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
    initResponsive(); // Initial check
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p style='color:red;'>Sidebar failed to load</p>";
  }
}

// ===============================
// SIDEBAR LOGIC
// ===============================
function initSidebar() {
  // Dropdowns
  document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => {
      const submenu = title.nextElementSibling;
      if (submenu) submenu.classList.toggle("open");
    });
  });

  // Improved Search
  window.searchMenu = function (query) {
    const lowQuery = query.toLowerCase();
    const submenus = document.querySelectorAll(".submenu");

    submenus.forEach(submenu => {
      const links = submenu.querySelectorAll("a");
      let hasMatch = false;

      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        const isMatch = text.includes(lowQuery);
        link.style.display = isMatch ? "block" : "none";
        if (isMatch) hasMatch = true;
      });

      // Auto-open submenu if searching and a match is found
      if (lowQuery !== "") {
        submenu.classList.toggle("open", hasMatch);
        submenu.previousElementSibling.style.display = hasMatch ? "block" : "none";
      } else {
        // Reset to default (closed) when search is cleared
        submenu.classList.remove("open");
        submenu.previousElementSibling.style.display = "block";
      }
    });
  };

  // Active Link Highlight
  const currentPath = window.location.pathname;
  document.querySelectorAll(".submenu a").forEach(link => {
    const href = link.getAttribute("href");
    if (currentPath.endsWith(href) || currentPath === href) {
      link.classList.add("active");
      link.parentElement.classList.add("open");
    }
  });
}

function initToggle() {
  const btn = document.getElementById("menu-toggle");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");
    sidebar.classList.toggle("closed");
    main.classList.toggle("expanded");
  });
}

// Optimized Responsive Logic
let lastWidth = window.innerWidth;
function initResponsive() {
  const sidebar = document.getElementById("sidebar");
  const main = document.querySelector(".main");
  if (!sidebar || !main) return;

  const currentWidth = window.innerWidth;
  // Only trigger logic if crossing the mobile/desktop threshold
  if (lastWidth > 768 && currentWidth <= 768) {
    sidebar.classList.add("closed");
    main.classList.add("expanded");
  } else if (lastWidth <= 768 && currentWidth > 768) {
    sidebar.classList.remove("closed");
    main.classList.remove("expanded");
  }
  lastWidth = currentWidth;
}

window.addEventListener("resize", initResponsive);
document.addEventListener("DOMContentLoaded", loadSidebar);

// ===============================
// LESSON TOGGLE LOGIC
// ===============================
function toggleLessons(id) {
  const list = document.getElementById(id);
  const btn = list.previousElementSibling;

  // Check if it's already open
  const isOpen = list.classList.contains("show");

  // Close all other activity lists (Optional: makes it like an accordion)
  /* document.querySelectorAll('.activity-list').forEach(el => el.classList.remove('show'));
  document.querySelectorAll('.lesson-btn').forEach(el => el.classList.remove('active'));
  */

  // Toggle this specific list
  if (isOpen) {
    list.classList.remove("show");
    btn.classList.remove("active");
  } else {
    list.classList.add("show");
    btn.classList.add("active");
  }
}

// media player function
function togglePlayer(id) {
    const player = document.getElementById(id);
    
    // Close all other players first (optional)
    document.querySelectorAll('.player-container').forEach(el => {
        if (el.id !== id) el.classList.remove('show');
    });

    // Toggle the clicked one
    player.classList.toggle('show');
}

//search filter

function filterResources() {
    let input = document.getElementById('resourceSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('media-card');
    
    for (let card of cards) {
        // This gets the title, the category, and the tags we added to the JSON
        let title = card.querySelector('h3').innerText.toLowerCase();
        let tags = card.getAttribute('data-tags').toLowerCase();
        let category = card.querySelector('.card-image span').innerText.toLowerCase();
        
        if (title.includes(input) || tags.includes(input) || category.includes(input)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    }
}

async function loadResources() {
    const grid = document.getElementById('resource-grid');
    if (!grid) return; // Only run on the resources page

    try {
        // Using the BASE variable for consistency
        const response = await fetch(`${BASE}/articles.json`);
        
        if (!response.ok) {
            throw new Error(`Could not find articles.json (Status: ${response.status})`);
        }

        const articles = await response.json();
      
grid.innerHTML = articles.map(item => `
    <div class="media-card" data-tags="${item.tags}">
        <div class="category-label">${item.category}</div>
        
        <div class="card-image">
            <img src="${BASE}/images/icons/default-icon.png" class="card-icon" alt="icon">
        </div>

        <h3>${item.title}</h3>

        <div class="media-links">
            <a href="${item.articleUrl}" target="_blank" class="media-btn article">📄 Article</a>
            ${item.podcastUrl !== '#' ? `<button class="media-btn podcast" onclick="togglePlayer('audio-${item.id}')">🎙️ Podcast</button>` : ''}
            ${item.videoUrl !== '#' ? `<a href="${item.videoUrl}" target="_blank" class="media-btn video">📺 Video</a>` : ''}
        </div>
        
        <div id="audio-${item.id}" class="player-container" style="display:none;">
            <audio controls><source src="${item.podcastUrl}" type="audio/mpeg"></audio>
        </div>
    </div>
`).join('');
        
        console.log("Resources loaded successfully!");
    } catch (err) {
        console.error("Failed to load resources:", err);
        grid.innerHTML = `<div style="color:red; padding:20px;">
            <h3>Database Load Error</h3>
            <p>${err.message}</p>
            <p>Check if articles.json is in your root folder and named correctly.</p>
        </div>`;
    }
}

// Call it when the page loads
document.addEventListener("DOMContentLoaded", loadResources);
