import {checkForHttpErrors, getDecodedToken, makeOption} from "./util.js";


const REGISTER_URL = "http://localhost:8080/api/v1/register";




function initRegister() {
    const registerBtn = document.getElementById("register-btn");
    registerBtn.addEventListener("click", registerCostumer);
}





function registerCostumer(clickEvent) {
    clickEvent.preventDefault();

    const registedUsername = document.getElementById("register-username").value;
    const registedPassword = document.getElementById("register-password").value;
    const registedFullName = document.getElementById("register-full-name").value;
    const registedEmail = document.getElementById("register-email").value;
    const registedPhoneNumber = document.getElementById("register-phone-number").value;
    const registedBirthday = document.getElementById("register-birthday").value;

    const registerRequest = {
        "username": registedUsername,
        "password": registedPassword,
        "fullName": registedFullName,
        "email": registedEmail,
        "phoneNumber": registedPhoneNumber,
        "birthDate": registedBirthday
    }

    processRegisterRequest(registerRequest);
}





async function processRegisterRequest(request) {
    try {
        const postOption = makeOption("POST", request);
        const response = await fetch(REGISTER_URL, postOption);
        checkForHttpErrors(response);
        const jwtToken = await response.json();
        const token = jwtToken.jwt;

        localStorage.setItem("jwtToken", token);

        setCostumerNavbar();
        alert("Successfully created a account");
        resetRegisterForm();
        location.hash = "#home"; //TODO this was a quick fix, since when the register btn was clicked it wouldnt re-direct to home page.

    }catch (error) {
        console.error(error) //TODO should be made more rebost. Check for the response status
        alert("Username already taken find another one.")
    }
}





function resetRegisterForm() {
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("register-full-name").value = "";
    document.getElementById("register-email").value = "";
    document.getElementById("register-phone-number").value = "";
    document.getElementById("register-birthday").value = "";
}






function setCostumerNavbar() {

    //used to set username in navbar when logged in to make it more interactive
    const decodedToken = getDecodedToken();
    const username = decodedToken.sub;

    const costumerNavbar = `
    <ul class="navbar-nav">
        <li class="nav-item">
            <a class="nav-link view-link hoverbutton" href="#home">Home</a>
        </li>
        <li class="nav-item">
            <a class="nav-link view-link hoverbutton" href="#movies">Movies</a>
        </li>
        <li class="nav-item">
            <a class="nav-link view-link hoverbutton" href="#">My tickets</a> <!-- TODO implement feature-->
        </li>
    </ul>
    
    <form class="d-flex mx-auto position-relative">
        <input class="form-control pe-5 me-5" id="movie-search" type="text" placeholder="Enter name..." size="15" aria-label="Movie search">
            <span id="search-icon">
                <img class="search-icon" src="/images/search.png" alt="Search">
            </span>
    </form>
    
    <ul class="navbar-nav ml-auto">
        <li class="nav-item">
            <a class="nav-link view-link text-white hoverbutton me-2" href="">${username}</a> <!--TODO implement account feature-->
        </li>
        <li class="nav-item">
            <a class="nav-link view-link text-white hoverbutton me-2" href="#logout">logout</a>
        </li>
    </ul>
   `

    const navbar = document.getElementById("navbar-content");
    navbar.innerHTML = costumerNavbar;
}




export {initRegister, setCostumerNavbar}