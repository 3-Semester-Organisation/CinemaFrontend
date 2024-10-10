import { initializeViewNavigation } from "./router.js";
import { getMovieSearchFilter } from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
  initializeViewNavigation();

  //TODO ONE OF THESE IS REDUNDANT
  const search = document.getElementById("search-icon")
  search.addEventListener("click", getMovieSearchFilter)
  searchInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
      search.click();
    }
  })
}


// TODO ONE OF THESE IS REDUNDANT
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