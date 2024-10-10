import {defaultNavbar} from "./util.js";

function initLogoutView(message) {
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
    setTimeout(redirectToHome, 3500);
}


function redirectToHome() {
    location.hash = "#home";
}
export {initLogoutView}