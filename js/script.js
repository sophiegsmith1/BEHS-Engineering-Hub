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
// COURSE HUB DRILL-DOWN
// ===============================
function toggleElement(id) {
  const content = document.getElementById(id);
  const button = content.previousElementSibling;

  // Toggle the content visibility
  content.classList.toggle("show");
  
  // Toggle the active class on the button for the +/- icon
  button.classList.toggle("active");
}
