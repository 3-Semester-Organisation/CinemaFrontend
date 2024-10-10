import {initAddMovieView} from "./omdb.js";
import {initTicketsView} from "./tickets.js";
import {initSeatView} from "./bookSeat.js";
import {initMoviesView} from "./movies.js";
import {initOptions} from "./addShowing.js";
import {initLoginView, setAdminNavbar} from "./adminLogin.js";
import {initLogoutView} from "./logout.js";
import {initRegister, setCostumerNavbar} from "./register.js";


function initializeViewNavigation() {
    window.addEventListener("hashchange", handleViewChange);
    handleViewChange(); // Set initial view
}






function handleViewChange() {
    let viewName = "home"; // Default view

    if (location.hash) {
        viewName = location.hash.substring(1); // Remove '#' from the hash
        console.log("inside ig in ganle vorw: " + viewName)
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
            // initView(viewName)
            checkAuth(initView, viewName); // inits js for the view
        })
        .catch(error => {
            console.error(error);
            app.innerHTML = `<p>Error loading view.</p>`;
        });
}






async function loadViewWithoutScript(viewName) {
    const app = document.getElementById("app")
    let response = await fetch(`views/${viewName}.html`)
    app.innerHTML = await response.text();
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
        initSeatView();
    } else if (viewName === 'addShowing') {
        initOptions();
    } else if (viewName === 'login') {
        initLoginView();
    } else if (viewName === 'logout') {
        initLogoutView();
    } else if (viewName === 'register') {
        initRegister();
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






function checkAuth(initView, viewName) {
    const token = localStorage.getItem("jwtToken");
    console.log("token : " + token)
    if (!token) {
        // No token, redirect to home
        initView(viewName);
        return;
    }

    try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000; //converts milisec to sec, because jwt uses sec and Date uses milisec.

        // Check if the token is expired
        if (decodedToken.exp < currentTime) {
            initLogoutView("token expired");
            initView('login');
            return;
        }
        // Token is valid, allow user to stay on admin page
        if (decodedToken.role === "ROLE_ADMIN") {
            setAdminNavbar()
            initView(viewName);
        }

        if (decodedToken.role === "ROLE_USER") {
            setCostumerNavbar();

            if (viewName === "adminDashboard") {
                console.log("viewName is admin")
                location.hash = "#home";
                return;
            }

            initView(viewName);
        }

    } catch (error) {
        console.error("Error decoding token: ", error);
        initLogoutView("an error occurred");
    }

}


export {initializeViewNavigation, handleViewChange, loadView, loadViewWithoutScript};