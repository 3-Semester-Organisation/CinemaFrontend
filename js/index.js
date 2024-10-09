import { initializeViewNavigation } from "./router.js";
import { getMovieSearchFilter } from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
  initializeViewNavigation();
  const search = document.getElementById("movie-search-btn")
  const searchInput = document.getElementById("movie-search")
  search.addEventListener("click", getMovieSearchFilter)
  searchInput.addEventListener("keypress", (event) => {
    if(event.key === "Enter"){
      search.click();
    }
  })
}
