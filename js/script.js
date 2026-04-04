// ===============================
// SIDEBAR LOADER
// ===============================
async function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  // Always correct for GitHub Pages
  let path = "components/sidebar.html";

  // If we're inside a folder (courses/, resources/, etc.)
  if (window.location.pathname.includes("/courses/") ||
      window.location.pathname.includes("/resources/") ||
      window.location.pathname.includes("/news/") ||
      window.location.pathname.includes("/robotics/")) {
    path = "../components/sidebar.html";
  }

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Failed to load sidebar: ${res.status} at ${path}`);
    }

    const html = await res.text();
    container.innerHTML = html;

    initSidebar();

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:red;'>Sidebar failed to load (GitHub Pages path issue)</p>";
  }
}

// ===============================
function getDepth() {
  const path = window.location.pathname; 
  // remove leading slash and split by /
  const parts = path.replace(/^\/+/, "").split("/"); 
  // last part is file name if it contains a dot
  const isFile = parts[parts.length - 1].includes(".");
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
  const main = document.querySelector(".main");

  sidebar.classList.toggle("closed");
  main.classList.toggle("expanded");
}

// ===============================
document.addEventListener("DOMContentLoaded", loadSidebar);

// =========================
// Start Up Behavior
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main");

  if (!sidebar || !main) return;

  if (window.innerWidth <= 768) {
    sidebar.classList.add("closed");
    main.classList.add("expanded");
  }
});
