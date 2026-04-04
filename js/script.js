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
// TOGGLE SIDEBAR (FIXED)
// ===============================
function initToggle() {
  const btn = document.getElementById("menu-toggle");

  if (!btn) return;

  btn.addEventListener("click", () => {
    const sidebar = document.getElementById("sidebar");
    const main = document.querySelector(".main");

    if (!sidebar || !main) return;

    sidebar.classList.toggle("closed");
    main.classList.toggle("expanded");
  });
}

// ===============================
// RESPONSIVE BEHAVIOR
// ===============================
function initResponsive() {
  const sidebar = document.getElementById("sidebar");
  const main = document.querySelector(".main");

  if (!sidebar || !main) return;

  if (window.innerWidth <= 768) {
    sidebar.classList.add("closed");
    main.classList.add("expanded");
  } else {
    sidebar.classList.remove("closed");
    main.classList.remove("expanded");
  }
}

window.addEventListener("resize", initResponsive);

document.querySelectorAll(".accordion").forEach(button => {
  button.addEventListener("click", () => {
    const panel = button.nextElementSibling;

    if (panel.style.display === "flex" || panel.style.display === "block") {
      panel.style.display = "none";
    } else {
      panel.style.display = "flex";
    }
  });
});

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadSidebar);
