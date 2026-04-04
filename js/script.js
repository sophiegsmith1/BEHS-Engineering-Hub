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

    if (!res.ok) {
      throw new Error(`Sidebar failed: ${res.status}`);
    }

    const html = await res.text();
    container.innerHTML = html;

    // Initialize AFTER sidebar exists
    initSidebar();
    initToggle();
    initResponsive();

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:red;'>Sidebar failed to load</p>";
  }
}

// ===============================
// SIDEBAR DROPDOWNS + SEARCH + ACTIVE LINK
// ===============================
function initSidebar() {

  // dropdowns
  document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => {
      const submenu = title.nextElementSibling;
      if (submenu) submenu.classList.toggle("open");
    });
  });

  // search
  window.searchMenu = function (query) {
    const links = document.querySelectorAll(".submenu a");

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display =
        text.includes(query.toLowerCase()) ? "block" : "none";
    });
  };

  // active link highlight
  const current = window.location.pathname;

  document.querySelectorAll(".submenu a").forEach(link => {
    const href = link.getAttribute("href");

    if (current.includes(href)) {
      link.classList.add("active");
      link.parentElement.classList.add("open");
    }
  });
}

// ===============================
// TOGGLE SIDEBAR (UPDATED FOR NEW CSS)
// ===============================
function initToggle() {
  const btn = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main-content");

  if (!btn || !sidebar || !main) return;

  btn.addEventListener("click", () => {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      // MOBILE: slide in/out
      sidebar.classList.toggle("open");
    } else {
      // DESKTOP: collapse sidebar
      sidebar.classList.toggle("closed");
    }
  });
}

// ===============================
// RESPONSIVE BEHAVIOR
// ===============================
function initResponsive() {
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main-content");

  if (!sidebar || !main) return;

  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    sidebar.classList.remove("closed");
    sidebar.classList.remove("open");
  } else {
    sidebar.classList.remove("open");
  }
}

window.addEventListener("resize", initResponsive);

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadSidebar);
