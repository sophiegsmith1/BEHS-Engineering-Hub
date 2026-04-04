// ===============================
// SIDEBAR LOADER
// ===============================
async function loadSidebar() {
  const container = document.getElementById("sidebar-container");

  if (!container) return;

  const depth = getDepth();
  const prefix = "../".repeat(depth);

  const path = `${prefix}components/sidebar.html`;

  try {
    const res = await fetch(path);
    const html = await res.text();

    container.innerHTML = html;

    initSidebar();
  } catch (err) {
    console.error("Sidebar failed to load:", err);
    container.innerHTML = "<p style='color:red;'>Sidebar failed to load</p>";
  }
}

// ===============================
function getDepth() {
  const path = window.location.pathname;
  const parts = path.split("/").filter(Boolean);
  const isFile = parts.length && parts[parts.length - 1].includes(".");
  return isFile ? parts.length - 1 : parts.length;
}

// ===============================
// SIDEBAR INTERACTIONS
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
  window.searchMenu = function(query) {
    const links = document.querySelectorAll(".submenu a");

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(query.toLowerCase()) ? "block" : "none";
    });
  };

  // active link
  const current = window.location.pathname;
  document.querySelectorAll(".submenu a").forEach(link => {
    if (current.includes(link.getAttribute("href"))) {
      link.classList.add("active");
      link.parentElement.classList.add("open");
    }
  });
}

// ===============================
// MOBILE SIDEBAR TOGGLE
// ===============================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  if (sidebar) sidebar.classList.toggle("hidden");
}

// ===============================
document.addEventListener("DOMContentLoaded", loadSidebar);
