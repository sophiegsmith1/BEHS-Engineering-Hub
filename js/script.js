  function toggleMenu(element) {
    const submenu = element.nextElementSibling;
    submenu.style.display =
      submenu.style.display === "block" ? "none" : "block";
  }

  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("hidden");
  }

  function searchMenu(query) {
    query = query.toLowerCase();
    const links = document.querySelectorAll(".submenu a");

    links.forEach(link => {
      const text = link.textContent.toLowerCase();
      link.style.display = text.includes(query) ? "block" : "none";
    });
  }

  // ACTIVE LINK HIGHLIGHT
  const links = document.querySelectorAll(".submenu a");
  const current = window.location.pathname;

  links.forEach(link => {
    if (current.includes(link.getAttribute("href"))) {
      link.classList.add("active");
      link.parentElement.style.display = "block";
    }
  });
