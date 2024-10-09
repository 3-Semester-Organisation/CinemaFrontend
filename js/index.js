import { initializeViewNavigation } from "./router.js";
import { getMovieSearchFilter } from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
  initializeViewNavigation();
  const search = document.getElementById("search-icon")
  search.addEventListener("click", getMovieSearchFilter)
}


// press enter for search
document.addEventListener('DOMContentLoaded', (event) => {
  const searchInput = document.getElementById('movie-search');
  const searchButton = document.getElementById('search-icon');

  if (searchInput && searchButton) {
      searchInput.addEventListener('keypress', function(event) {
          if (event.key === 'Enter') {
              event.preventDefault(); // Prevent the default form submission
              searchButton.click(); // Trigger the search button click
          }
      });
  }
});