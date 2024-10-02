function initAddMovieView() {
    const addButton = document.getElementById('add');
    if (addButton) {
      addButton.onclick = async () => {
        let movieTitle = document.getElementById('input').value;
        movieTitle = movieTitle.replace(/ /g, "+");
        let movie = await getMovie(movieTitle);
        console.log(movie);
        postMovie(movie);
      };
    } else {
      console.error('Add button not found');
    }
    console.log('Add movie view initialized');
  }

const getMovie = async movieTitle => {
    try {
      // prob should hide api key somehow, but it's free so whatever
        const res = await fetch(`https://www.omdbapi.com/?apikey=7419760&t=${movieTitle}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const movie = await res.json();
        return movie;
    } catch (error) {
        console.error('Problem with fetch operation on getMovie: ', error);
    }
}

// need to make a function that takes the movie object and then sends to post endpoint for movie in backend

const postMovie = async movie => {

}



export { initAddMovieView };