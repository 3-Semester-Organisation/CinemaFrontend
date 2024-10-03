function initAddMovieView() {
    const addButton = document.getElementById('add');
    if (addButton) {
      addButton.onclick = async () => {
        let movieTitle = document.getElementById('input').value;
        movieTitle = movieTitle.replace(/ /g, "+");
        let movie = await getMovie(movieTitle);
        console.log(movie);
        postMovie(movie);
        alert('Movie added!');
        document.getElementById('input').value = ''; // reset input field
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

  // takes only the first genre for now
  let firstGenre = movie.Genre.split(',')[0].trim().toUpperCase();

  const ratingMap = {
    'G': 0,
    'PG': 0,
    'PG-13': 13,
    'R': 17,
    'NC-17': 17
  }


  // create a new movie object from response
  const newMovie = {
    title: movie.Title,
    description: movie.Plot,
    genre: firstGenre,
    rating: movie.Rated,
    thumbnail: movie.Poster,
    ageLimit: ratingMap[movie.Rated]
  }

  try {
    const res = await fetch('http://localhost:8080/api/v1/movies/addmovie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMovie),
    });
    if (!res.ok) {
    
      throw new Error('Network response was not ok');
      
    }
    console.log(JSON.stringify(newMovie));
    console.log('Movie added');
  } catch (error) {
    console.error('Problem with fetch operation on postMovie: ', error);
  }
  

}

export { initAddMovieView };