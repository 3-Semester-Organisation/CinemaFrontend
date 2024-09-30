function initializeViewNavigation() {
  window.addEventListener("hashchange", handleViewChange);
  handleViewChange(); // Set initial view
}

function handleViewChange() {
  let viewName = "home"; // Default view

  if (location.hash) {
    viewName = location.hash.substring(1); // Remove '#' from the hash
  }

  loadView(viewName);
  updateNavbarActiveLink(`#${viewName}`); // Update active link in navbar
}

function loadView(viewName) {
  const app = document.getElementById("app");
  
  // Fetch the HTML content of the view
  fetch(`views/${viewName}.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Could not load ${viewName}.html`);
      }
      return response.text();
    })
    .then(html => {
      app.innerHTML = html;
    })
    .catch(error => {
      console.error(error);
      app.innerHTML = `<p>Error loading view.</p>`;
    });
}

function updateNavbarActiveLink(view) {
  // Update the active class on the navbar links
  document.querySelectorAll(".view-link").forEach(link => {
    if (link.getAttribute("href") === view) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

export { initializeViewNavigation };
