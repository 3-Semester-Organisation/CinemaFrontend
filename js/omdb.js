function initAddMovieView() {
    const addButton = document.getElementById('add');
    if (addButton) {
      addButton.onclick = async () => {
        let movieTitle = document.getElementById('input').value;
        movieTitle = movieTitle.replace(/ /g, "+");
        let movie = await getMovie(movieTitle);
        console.log(movie);
      };
    } else {
      console.error('Add button not found');
    }
  }

const getMovie = async movieTitle => {
    try {
        const res = await fetch(`https://www.omdbapi.com/?apikey=7419760&t=${movieTitle}`);
        if (!res.ok) {
            throw new Error('Network response was not ok');
        }
        const movie = await res.json();
        console.log(movie);
        return movie;
    } catch (error) {
        console.error('Problem with fetch operation on getMovie: ', error);
    }
}



/*
document.getElementById('add').onclick = async () => {
    let movieTitle = document.getElementById('input').value;
    movieTitle = movieTitle.replace(/ /g, "+"); // replace all spaces with "+"
    let movie = await getMovie(movieTitle);
    console.log(movie);
};
*/

export { initAddMovieView };