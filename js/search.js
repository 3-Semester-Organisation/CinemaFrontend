import { getAllActiveMovies } from "./movies";

let movieTitles = []

for (let i = 0; i < getAllActiveMovies.length; i++) {
    movieTitles.push(getAllActiveMovies[i].title)
}

const searchInput = document.getElementById("movie-search")
const searchResults = document.querySelector(".search-results")

function searchInputSuggestion (){
    console.log("hit")
    let result = []
    let input = searchInput.value
    if(input.length){
        result = movieTitles.filter((keyword)=>{
            return keyword.toLowerCase().includes(input.toLowerCase())
        })
        console.log(result)
    }
}

export {searchInputSuggestion}