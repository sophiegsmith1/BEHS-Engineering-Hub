/**
 * BEHS ENGINEERING HUB - CORE SCRIPT
 * Handles Head/Sidebar injection and UI interactions.
 */

const BASE = "/BEHS-Engineering-Hub";

// --- 1. COMPONENT INJECTION ---
async function injectComponent(id, path, isHead = false) {
    try {
        const response = await fetch(`${BASE}${path}`);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        const html = await response.text();
        
        if (isHead) {
            document.head.insertAdjacentHTML('afterbegin', html);
        } else {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = html;
                if (id === "sidebar-container") initSidebarLogic();
            }
        }
    } catch (err) {
        console.error("Injection Error:", err);
    }
}

// --- 2. SIDEBAR & UI LOGIC ---
function initSidebarLogic() {
    // Menu Dropdowns
    document.querySelectorAll(".menu-title").forEach(title => {
        title.onclick = () => title.nextElementSibling?.classList.toggle("open");
    });

    // Mobile Toggle
    const toggleBtn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");

    if (toggleBtn && sidebar) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle("closed");
            main?.classList.toggle("expanded");
        };
    }

    // Active Link Highlight
    const currentPath = window.location.pathname;
    document.querySelectorAll(".submenu a").forEach(link => {
        if (currentPath.endsWith(link.getAttribute("href"))) {
            link.classList.add("active");
            link.parentElement.classList.add("open");
        }
    });
}

// --- 3. UTILITIES (Search, Toggles) ---
window.searchMenu = (query) => {
    const lowQuery = query.toLowerCase();
    document.querySelectorAll(".submenu a").forEach(link => {
        const match = link.textContent.toLowerCase().includes(lowQuery);
        link.style.display = match ? "block" : "none";
        if (match && lowQuery !== "") link.parentElement.classList.add("open");
    });
};

window.toggleLessons = (id) => {
    const list = document.getElementById(id);
    list?.classList.toggle("show");
    list?.previousElementSibling?.classList.toggle("active");
};

// --- INITIALIZE ---
document.addEventListener("DOMContentLoaded", () => {
    injectComponent(null, "/components/head.html", true);      // Load Head
    injectComponent("sidebar-container", "/components/sidebar.html"); // Load Sidebar
});
