import {defaultNavbar} from "./util.js";

function initLogoutView(message) {
    location.hash = "#logout" //switch to logout.html so this script can load.
    logout(message);
}

function logout(message) {
    console.log("inside logout")
    const navbar = document.getElementById("navbar-content");
    navbar.innerHTML = defaultNavbar;

    if (message) {
        const logoutMessage = document.getElementById("logout-message");
        logoutMessage.innerText += message;
    }

    localStorage.removeItem("jwtToken");
    setTimeout(redirectToHome, 1500);
}


function redirectToHome() {
    location.hash = "#home";
}



export {initLogoutView}