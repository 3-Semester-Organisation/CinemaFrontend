import {defaultNavbar} from "./adminLogin.js";

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
    window.location.href = 'http://localhost:63342/CinemaFrontend/index.html?_ijt=sl3tgeje30eisstrtta395t5av&_ij_reload=RELOAD_ON_SAVE#home';
}
export {initLogoutView}