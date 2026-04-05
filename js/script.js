/**
 * BEHS ENGINEERING HUB - CORE SCRIPT
 * Version 2.0: Optimized for Subfolder Navigation & Performance
 */

// 1. SMART PATHING: Automatically handles GitHub Pages vs Localhost
const BASE = window.location.hostname.includes("github.io") 
    ? "/BEHS-Engineering-Hub" 
    : "";

// --- 2. COMPONENT INJECTION ---
async function injectComponent(id, path, isHead = false) {
    try {
        const response = await fetch(`${BASE}${path}`);
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${path}`);
        const html = await response.text();
        
        if (isHead) {
            // Inserts fonts/meta tags before other styles to prevent "flashing"
            document.head.insertAdjacentHTML('afterbegin', html);
        } else {
            const container = document.getElementById(id);
            if (container) {
                container.innerHTML = html;
                initSidebarLogic();
            }
        }
    } catch (err) {
        console.error("Critical Injection Error:", err);
    }
}

// --- 3. SIDEBAR & UI LOGIC ---
function initSidebarLogic() {
    const sidebar = document.getElementById("sidebar");
    const toggleBtn = document.getElementById("menu-toggle");
    const main = document.querySelector(".main");

    // Menu Dropdowns (Accordion style)
    document.querySelectorAll(".menu-title").forEach(title => {
        title.onclick = (e) => {
            const submenu = title.nextElementSibling;
            if (submenu) {
                const isOpen = submenu.classList.contains("open");
                // Close other open submenus for a cleaner look (Optional)
                // document.querySelectorAll('.submenu').forEach(s => s.classList.remove('open'));
                submenu.classList.toggle("open", !isOpen);
            }
        };
    });

    // Mobile/Desktop Toggle
    if (toggleBtn && sidebar) {
        toggleBtn.onclick = () => {
            sidebar.classList.toggle("closed");
            main?.classList.toggle("expanded");
        };
    }

    // Smart Active Link Highlight
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".submenu a").forEach(link => {
        const linkHref = link.getAttribute("href").split("/").pop();
        if (currentFile === linkHref) {
            link.classList.add("active");
            link.closest(".submenu")?.classList.add("open");
        }
    });
}

// --- 4. UTILITIES ---

// Search functionality with "Clear" logic
window.searchMenu = (query) => {
    const lowQuery = query.toLowerCase().trim();
    document.querySelectorAll(".submenu").forEach(submenu => {
        let hasMatch = false;
        submenu.querySelectorAll("a").forEach(link => {
            const match = link.textContent.toLowerCase().includes(lowQuery);
            link.style.display = match ? "block" : "none";
            if (match) hasMatch = true;
        });

        // Open/Close groups based on search results
        if (lowQuery !== "") {
            submenu.classList.toggle("open", hasMatch);
        }
    });
};

// Lesson Accordion Toggle
window.toggleLessons = (id) => {
    const list = document.getElementById(id);
    if (!list) return;

    // Optional: Close other open lessons in the same unit
    // document.querySelectorAll('.activity-list.show').forEach(el => {
    //    if(el !== list) el.classList.remove('show');
    // });

    list.classList.toggle("show");
    list.previousElementSibling?.classList.toggle("active");
};

// --- 5. INITIALIZE ---
// Run immediately if DOM is already ready, otherwise wait
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        injectComponent(null, "/components/head.html", true);
        injectComponent("sidebar-container", "/components/sidebar.html");
    });
} else {
    injectComponent(null, "/components/head.html", true);
    injectComponent("sidebar-container", "/components/sidebar.html");
}
