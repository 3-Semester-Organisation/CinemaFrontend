import { initializeViewNavigation } from "./router.js";
import { getMovieSearchFilter } from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
  initializeViewNavigation();
  const search = document.getElementById("movie-search-btn")
  search.addEventListener("click", getMovieSearchFilter)
}
