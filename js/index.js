import {initializeViewNavigation} from "./router.js";
import {getMovieSearchFilter} from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
    initializeViewNavigation();

    //TODO ONE OF THESE IS REDUNDANT (this one)
    const searchInput = document.getElementById('movie-search');
    const searchButton = document.getElementById('search-icon');
    const search = document.getElementById("search-icon")
    search.addEventListener("click", getMovieSearchFilter)
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default form submission
            search.click();
            searchButton.click();
        }
    })
}