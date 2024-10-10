import { pgRatingSelector, getGenres, loadGenres, moviesHTMLFormatter, getAllActiveMovies } from '../js/movies.js';

// Mock fetch for getGenres, loadGenres, and getMovies
global.fetch = jest.fn((url) => {
  if (url.includes('genres')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(["ACTION", "COMEDY"]),
    });
  } else if (url.includes('movies')) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([{
        "id": 1,
        "title": "Alien",
        "description": "After investigating a mysterious transmission of unknown origin, the crew of a commercial spacecraft encounters a deadly lifeform.",
        "genreList": [
          "HORROR",
          "THRILLER"
        ],
        "ageLimit": 15,
        "thumbnail": "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
        "runtime": "117 min"
      },
      {
        "id": 10,
        "title": "Avengers: Endgame",
        "description": "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
        "genreList": [
          "ACTION"
        ],
        "ageLimit": 12,
        "thumbnail": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
        "runtime": "80 min"
      }]),
    });
  }
});

describe('pgRatingSelector', () => {
  test('returns G rating image for age 0', () => {
    expect(pgRatingSelector(0)).toBe('images/MPA_G_RATING.svg.png');
  });

  test('returns PG rating image for age less than 13', () => {
    expect(pgRatingSelector(10)).toBe('images/MPA_PG_RATING.svg.png');
  });

  test('returns PG-13 rating image for age less than 17', () => {
    expect(pgRatingSelector(15)).toBe('images/MPA_PG-13_RATING.svg.png');
  });

  test('returns R rating image for age less than 18', () => {
    expect(pgRatingSelector(17)).toBe('images/MPA_R_RATING.svg.png');
  });

  test('returns NC-17 rating image for age 18 or more', () => {
    expect(pgRatingSelector(18)).toBe('images/MPA_NC-17_RATING.svg.png');
  });
});

describe('getGenres', () => {
  test('fetches genres successfully', async () => {
    const genres = await getGenres();
    expect(genres).toEqual(["ACTION", "COMEDY"]);
  });

  test('handles fetch error', async () => {
    fetch.mockImplementationOnce(() => Promise.reject('API is down'));
    const genres = await getGenres();
    expect(genres).toBeUndefined();
  });
});

describe('loadGenres', () => {
  beforeEach(() => {
    document.body.innerHTML = '<select id="genre-select"></select>';
  });

  test('loads genres and updates the DOM', async () => {
    await loadGenres();
    const genreSelect = document.getElementById('genre-select');
    expect(genreSelect.innerHTML).toContain('<option value="ACTION">ACTION</option>');
    expect(genreSelect.innerHTML).toContain('<option value="COMEDY">COMEDY</option>');
  });
});

describe('moviesHTMLFormatter', () => {
  test('formats movies correctly', () => {
    const movies = [
      {
        id: 1,
        title: 'Movie 1',
        description: 'Description 1',
        genreList: ['Action', 'Comedy'],
        ageLimit: 15,
        thumbnail: 'thumbnail1.jpg',
      },
    ];

    const movieContainer = moviesHTMLFormatter(movies);
    expect(movieContainer.innerHTML).toContain('Movie 1');
    expect(movieContainer.innerHTML).toContain('thumbnail1.jpg');
  });
});

describe('getAllActiveMovies', () => {
    test('fetches movies successfully', async () => {
        const movies = await getAllActiveMovies();
        expect(movies).toEqual([{
            "id": 1,
            "title": "Alien",
            "description": "After investigating a mysterious transmission of unknown origin, the crew of a commercial spacecraft encounters a deadly lifeform.",
            "genreList": [
                "HORROR",
                "THRILLER"
            ],
            "ageLimit": 15,
            "thumbnail": "https://m.media-amazon.com/images/M/MV5BOGQzZTBjMjQtOTVmMS00NGE5LWEyYmMtOGQ1ZGZjNmRkYjFhXkEyXkFqcGdeQXVyMjUzOTY1NTc@._V1_SX300.jpg",
            "runtime": "117 min"
        },
        {
            "id": 10,
            "title": "Avengers: Endgame",
            "description": "After the devastating events of Avengers: Infinity War (2018), the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
            "genreList": [
                "ACTION"
            ],
            "ageLimit": 12,
            "thumbnail": "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_SX300.jpg",
            "runtime": "80 min"
        }]);
    })
});