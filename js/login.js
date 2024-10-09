import {checkForHttpErrors, makeOption} from "./util.js";
import {initializeViewNavigation} from "./router.js";

const LOGIN_URL = "http://localhost:8080/api/v1/";

const loginBtn = document.getElementById("sign-in");
loginBtn.addEventListener("click", login)






async function login() {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const loginRequest = {
        "username": username,
        "password": password
    }

    const postOption = makeOption("POST", loginRequest);
    try {
        const response = await fetch(LOGIN_URL + "login", postOption);
        checkForHttpErrors(response);
        const jwtToken = await response.json();

        const decodedToken = jwt_decode(jwtToken);
        checkRole(decodedToken);

    } catch (error) {
        console.error(error)
    }
}






function checkRole(decodedToken) {

    const role = decodedToken.role;
    if (role === "ADMIN"){
        loadAdminView();
    }

    initializeViewNavigation();
}





function loadAdminView() {
    const navbar = document.getElementById("navbar-content")
    navbar.innerHTML = ""; //remove all the default content

    //add admin content
    navbar.innerHTML =
    `<ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link view-link hoverbutton" href="#tickets">Tickets</a>
        </li>
        <li>
            <a class="nav-link view-link hoverbutton" href="#addMovie">Add Movie</a>
        </li>
        <li>
            <a class="nav-link view-link hoverbutton" href="#addShowing">Create Showing</a>
        </li>
    </ul>`


    //change the home view to reflect admin view
    const pNode = document.getElementById("home-p-node");
    pNode.innerText = "Admin dashboard"

    initializeViewNavigation();
}