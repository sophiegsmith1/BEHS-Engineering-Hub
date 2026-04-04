// ===============================
// SIDEBAR LOADER
// ===============================
async function loadSidebar() {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  let path = "components/sidebar.html";

  if (
    window.location.pathname.includes("/courses/") ||
    window.location.pathname.includes("/resources/") ||
    window.location.pathname.includes("/news/") ||
    window.location.pathname.includes("/robotics/")
  ) {
    path = "../components/sidebar.html";
  }

  try {
    const res = await fetch(path);

    if (!res.ok) {
      throw new Error(`Failed to load sidebar: ${res.status}`);
    }

    const html = await res.text();
    container.innerHTML = html;

    initSidebar();

    // ensure correct initial state AFTER load
    initResponsiveSidebar();

  } catch (err) {
    console.error(err);
    container.innerHTML =
      "<p style='color:red;'>Sidebar failed to load</p>";
  }
}

// ===============================
// SIDEBAR INTERACTIONS
// ===============================
function initSidebar() {

  document.querySelectorAll(".menu-title").forEach(title => {
    title.addEventListener("click", () => {
      const submenu = title.nextElementSibling;
      if (submenu) submenu.classList.toggle("open");
    });
  });

  window.searchMenu = function (query) {
    const links = document.querySelectorAll(".submenu a");

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(query.toLowerCase())
        ? "block"
        : "none";
    });
  };

  const current = window.location.pathname;

  document.querySelectorAll(".submenu a").forEach(link => {
    if (current.includes(link.getAttribute("href"))) {
      link.classList.add("active");
      link.parentElement.classList.add("open");
    }
  });
}

// ===============================
// TOGGLE SIDEBAR
// ===============================
function toggleSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const main = document.querySelector(".main");

  if (!sidebar || !main) return;

  sidebar.classList.toggle("closed");
  main.classList.toggle("expanded");
}

// ===============================
// RESPONSIVE INIT STATE
// ===============================
function initResponsiveSidebar() {
  const sidebar = document.querySelector(".sidebar");
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

// optional: handle resize live
window.addEventListener("resize", initResponsiveSidebar);

// ===============================
// INIT
// ===============================
document.addEventListener("DOMContentLoaded", loadSidebar);
