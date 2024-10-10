import {checkForHttpErrors, getDecodedToken, makeOption} from "./util.js";
import {initializeViewNavigation} from "./router.js";

const LOGIN_URL = "http://localhost:8080/api/v1/";


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
        //the jwt_decode only takes strings not js objects. If we did not unwrap it would not work.
        const decodedToken = jwt_decode(jwtToken);
        checkRole(decodedToken);

    } catch (error) {
        alert("Wrong credentials"); //TODO check server response, and handle this better
        history.back(); //TODO this was a quick fix. This should be made better, because when login is clicked it re-directs to adminDashboard
                        //to keep user interaction alive to redirect to login again. So handle click better.
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

    const decodedToken = getDecodedToken();
    const username = decodedToken.sub;


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

        <form class="d-flex mx-auto position-relative">
            <input class="form-control pe-5 me-5" id="movie-search" type="text" placeholder="Enter name..." size="15" aria-label="Movie search">
            <span id="search-icon">
                <img class="search-icon" src="/images/search.png" alt="Search">
            </span>
        </form>

        <!--logout-->
        <ul class="navbar-nav ml-auto">
            <li class="nav-item">
                <a class="nav-link view-link text-white hoverbutton me-2" href="">${username}</a> <!--TODO implement account feature-->
            </li>
            <li class="nav-item">
                <a id="logout-btn" class="nav-link view-link text-white hoverbutton me-2" href="#logout">logout</a>
            </li>
        </ul>
`
    const navbar = document.getElementById("navbar-content");
    navbar.innerHTML = adminNavbarContent;
}

export {initLoginView, setAdminNavbar}