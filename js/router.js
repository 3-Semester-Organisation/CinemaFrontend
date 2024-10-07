import { initAddMovieView } from "./omdb.js";
import { initTicketsView } from "./tickets.js";
import { initSeatView } from "./bookSeat.js";
import { initShowingsView } from "./showings.js";
import { initMoviesView } from "./movies.js";
import { initOptions } from "./addShowing.js";


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
      app.innerHTML = html; // sets the innerHTML of the app div to the fetched html
      initView(viewName); // inits js for the view
    })
    .catch(error => {
      console.error(error);
      app.innerHTML = `<p>Error loading view.</p>`;
    });
}

// helper function for loadView, initializes js for given view
function initView(viewName) {
  if (viewName === 'addMovie') {
    initAddMovieView();
  } else if (viewName === 'tickets') {
    initTicketsView();
  } else if (viewName === 'movies') {
    initMoviesView();
  } else if (viewName === 'bookSeat') {
    initSeatView()
  } else if (viewName === 'addShowing') {
    initOptions();
  }
  // Initialize other views as needed
}

function updateNavbarActiveLink(view) {
  // Update the active class on the navbar links
  // necessary for hoverbutton functionality
  document.querySelectorAll(".view-link").forEach(link => {
    if (link.getAttribute("href") === view) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

export { initializeViewNavigation };