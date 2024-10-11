import {initAddMovieViewScript} from "./omdb.js";
import {initTicketsViewScript} from "./tickets.js";
import {initSeatViewScript} from "./bookSeat.js";
import {initMoviesViewScript} from "./movies.js";
import {initAddShowingScript} from "./addShowing.js";
import {initLoginViewScript, setAdminNavbar} from "./adminLogin.js";
import {initLogoutViewScript} from "./logout.js";
import {initRegisterViewScript, setCostumerNavbar} from "./register.js";
import {checkForHttpErrors, getDecodedToken} from "./util.js";
import { initShowingsView } from "./showings.js";


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






async function loadView(viewName) {
    const app = document.getElementById("app");

    try {
        // Fetch the HTML content of the view
        const response = await fetch(`views/${viewName}.html`)
        checkForHttpErrors(response);
        const html = await response.text();
        app.innerHTML = html; // sets the innerHTML of the app div to the fetched html
        checkAuth(initViewScript, viewName);// inits js for the view

    }catch (error) {
        console.error(error)
        app.innerHTML = `<p>Error loading view.</p>`;
    }
}






async function loadViewWithoutScript(viewName) {
    const app = document.getElementById("app")
    let response = await fetch(`views/${viewName}.html`)
    app.innerHTML = await response.text();
}






// helper function for loadView, initializes js for given view
function initViewScript(viewName) {
    if (viewName === 'addMovie') {
        initAddMovieViewScript();
    } else if (viewName === 'tickets') {
        initTicketsViewScript();
    } else if (viewName === 'movies') {
        initMoviesViewScript();
    } else if (viewName === 'bookSeat') {
        initSeatViewScript();
    } else if (viewName === 'addShowing') {
        initAddShowingScript();
    } else if (viewName === 'login') {
        initLoginViewScript();
    } else if (viewName === 'logout') {
        initLogoutViewScript();
    } else if (viewName === 'register') {
        initRegisterViewScript();
    }
    // Initialize other scripts as needed
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






function checkAuth(initView, viewName) {

    const decodedToken = getDecodedToken();
    if (!decodedToken) {
        // No token, just refresh and stay on page
        initView(viewName);
        return;
    }

    try {
        const currentTime = Date.now() / 1000; //converts milisec to sec, because jwt uses sec and Date uses milisec.

        // Check if the token is expired. If it is, lock the person out, and then redirect to login, so they can login and refresh their token.
        if (decodedToken.exp < currentTime) {
            initLogoutViewScript("token expired");
            initView('login');
            return;
        }
        // If token is valid, and has role admin, allow user to stay on admin page
        if (decodedToken.role === "ROLE_ADMIN") {
            setAdminNavbar()
            initView(viewName);
        }

        if (decodedToken.role === "ROLE_USER") {
            setCostumerNavbar();

            //todo sometimes you end up on adminDashbord, even tho you are not logged in as admin, this prevents it.
            //have not pinpointed the reason yet.
            if (viewName === "adminDashboard") {
                location.hash = "#home";
                return;
            }

            initView(viewName);
        }

        updateNavbarActiveLink("#" + viewName);

    } catch (error) {
        console.error("Error decoding token: ", error);
        initLogoutViewScript("an error occurred");
    }

}


export {initializeViewNavigation, handleViewChange, loadView, loadViewWithoutScript};