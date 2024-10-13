import {initializeViewNavigation} from "./router.js";
import {getMovieSearchFilter} from "./movies.js";

document.addEventListener("DOMContentLoaded", initApp);


function initApp() {
    initializeViewNavigation();

    const searchInput = document.getElementById('movie-search');
    const searchButton = document.getElementById('search-icon');
    searchButton.addEventListener("click", getMovieSearchFilter)

    let debounceTimeout;
    /*
    
    searchInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent the default form submission
            searchButton.click();
        }
    })
        */

    searchInput.addEventListener("keyup", () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            searchButton.click();
        }, 300); // 0.5 seconds delay
    })
}