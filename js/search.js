const MOVIES_URL = "http://127.0.0.1:8080/api/v1/movies"
//had to manually fetch, rather than utilise the function from "movies.js", as it
//kept creating a "disallowed MIME type" error
async function getAllActiveMovies() {
    try {
        const response = await fetch(MOVIES_URL);
        return await response.json();

    }catch (error) {
        console.error(error)
    }
}
//TODO clean up this mess, so there isn't a fetch in this JS file
//TODO move other search-based functions here

/*
let movieTitles = []
let movies = await getAllActiveMovies()

for (let i = 0; i < movies.length; i++) {
    movieTitles.push(movies[i].title)
}

const searchInput = document.getElementById("movie-search")
const searchResults = document.querySelector(".search-results")

searchInput.onkeyup = function searchInputSuggestion (){
    let result = []
    let input = searchInput.value
    if(input.length){
        result = movieTitles.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase())
        })
        console.log("Autocomplete word search: "+result)
    }
    display(result)
}

function display(result){
    const content = result.map((list)=>{
        return "<li onclick=selectInput(this)>" + list + "</li>"
    })

    searchResults.innerHTML = "<ul>" +content.join("") + "</ul>"
}
//the onclick doesn't work
function selectInput(list){
    console.log("hit")
    searchInput.value = list.innerHTML
    searchResults.innerHTML = ""
}
    */