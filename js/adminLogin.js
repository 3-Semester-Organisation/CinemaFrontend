import {checkForHttpErrors, makeOption} from "./util.js";
import {initializeViewNavigation} from "./router.js";

const LOGIN_URL = "http://localhost:8080/api/v1/";

const navbar = document.getElementById("navbar-content");
let defaultNavbar = navbar.innerHTML;

function initLoginView() {
    const loginBtn = document.getElementById("sign-in");
    loginBtn.addEventListener("click", adminLogin)

    const app = document.getElementById("app");
    app.addEventListener("keypress", (event) => {
        if (event.key === "enter") {
            event.preventDefault();
            loginBtn.click();
        }
    })
}


async function adminLogin() {
    console.log("inside admin login 1")
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
        let jwtToken = await response.json(); //when .json() is called it return a js object, we dont want that we want only the token, and the token should just be a long string.
        jwtToken = jwtToken.jwt; //unwrap token from js object

        //store the token locally instead of in a cookie. Cookies opens up for csrf.
        localStorage.setItem("jwtToken", jwtToken)
        console.log("inside adming login 2 : " + localStorage.getItem("jwtToken"))
        //the jwt_decode only takes strings not js objects. If we did not unwrap it would not work.
        const decodedToken = jwt_decode(jwtToken);
        checkRole(decodedToken);

    } catch (error) {
        console.error(error)
    }
}


export function checkRole(decodedToken) {

    const role = decodedToken.role;
    if (role === "ROLE_ADMIN") {
        setAdminNavbar();
    }

    initializeViewNavigation();
}


function setAdminNavbar() {
    console.log("inside loadAdminView")

    //add admin content
    const adminNavbarContent =
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
        </ul>

        <!--logout-->
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a id="logout-btn" class="nav-link view-link text-white hoverbutton me-2" href="#logout">logout</a>
            </li>
        </ul>
`
    navbar.innerHTML = adminNavbarContent;
}

export {initLoginView, setAdminNavbar, defaultNavbar}