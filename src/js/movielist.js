import { myDetailsFunction } from './mydetailsfunction';
import { displayMovieRating } from './displayMovieRating';
import { updateLibraryButton, checkLibrary } from './addRemoveCheck';

export async function movielist() {
  const apiKey = '3e7bd78082a78694a13d5e52c5addee0';
  const apiUrl =
    'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=' +
    apiKey;
  const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';
  let query = '';
  let year = '';
  const pathname = window.location.pathname;
  const paginationDiv = document.querySelector('.pagination')
  const isCatalogPage = pathname.includes('catalog');
  const movieGallery = document.getElementById('catalog-movie-gallery');
  const catalogDescContainer = document.querySelector('.catalog-desc-container');
  const prevPageBtn = isCatalogPage
    ? document.getElementById('prevPageBtn')
    : null;
  const nextPageBtn = isCatalogPage
    ? document.getElementById('nextPageBtn')
    : null;
  const pageNumbersContainer = isCatalogPage
    ? document.querySelector('.page-numbers')
    : null;
  const searchButton = isCatalogPage
    ? document.getElementById('searchButton')
    : null;
  const mySelect = isCatalogPage ? document.getElementById('movieYear') : null;
  let currentPage = 1;
  let genreMap = {};
  let totalPages = 100;

  if (isCatalogPage) {
    catalogDescContainer.style.display = 'none';
    
  }else{
    catalogDescContainer.style.display = 'flex';
    paginationDiv.style.display = 'none';
  }

  async function fetchGenres() {
    const genreUrl = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=en-US`;

    try {
      const response = await fetch(genreUrl);
      const data = await response.json();
      genreMap = data.genres.reduce((map, genre) => {
        map[genre.id] = genre.name;
        return map;
      }, {});
    } catch (error) {
      console.error('Error fetching genres:', error);
    }
  }

  async function fetchMovies(page = 1, query = '', year = '') {
    const apiPage = Math.ceil((page * 9) / 20);

    let url = `${apiUrl}&page=${apiPage}`;
    if (query && !year) {
      url = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${apiKey}&page=${apiPage}`;
    } else if (query && year) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&primary_release_year=${year}&page=${apiPage}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();

      if (pathname.includes('catalog')) {
        const startIndex = ((page - 1) % 2) * 9;
        const paginatedResults = data.results.slice(startIndex, startIndex + 9);
        displayMovies(paginatedResults);
      } else {
        const startIndex = ((page - 1) % 2) * 3;
        const paginatedResults = data.results.slice(startIndex, startIndex + 3);
        displayMovies(paginatedResults);
      }

      if (isCatalogPage) {
        totalPages = Math.min(data.total_pages, 1000);
        updatePagination();
      }
      return data;
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  }

  function displayMovies(movies) {
    movieGallery.innerHTML = '';

    movies.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('catalog-movie-card');
      movieCard.dataset.movieId = movie.id;

      const moviePoster = document.createElement('img');
      moviePoster.src = imageBaseUrl + movie.poster_path;
      moviePoster.alt = movie.title;
      moviePoster.classList.add('catalog-movie-poster');

      const movieInfo = document.createElement('div');
      movieInfo.classList.add('catalog-movie-info');

      const movieTitle = document.createElement('h2');
      movieTitle.textContent = movie.title;
      movieTitle.classList.add('catalog-movie-title');

      const movieDetailsRatingDiv = document.createElement('div');
      movieDetailsRatingDiv.classList.add('catalog-movie-details-rating');

      const movieDetails = document.createElement('p');
      const genreNames = movie.genre_ids
        .map(id => genreMap[id] || 'Unknown')
        .filter(Boolean);

      movieDetails.textContent = `${genreNames[0]}, ${genreNames[1]} | ${
        movie.release_date.split('-')[0]
      }`;
      movieDetails.classList.add('catalog-movie-details');

      const movieRating = document.createElement('p');
      movieRating.innerHTML = displayMovieRating(movie.vote_average);
      movieRating.classList.add('catalog-movie-rating');

      movieInfo.appendChild(movieTitle);
      movieDetailsRatingDiv.appendChild(movieDetails);
      movieDetailsRatingDiv.appendChild(movieRating);
      movieInfo.appendChild(movieDetailsRatingDiv);
      movieCard.appendChild(moviePoster);
      movieCard.appendChild(movieInfo);
      movieGallery.appendChild(movieCard);
    });
    const catalogCards = document.querySelectorAll('.catalog-movie-card');
    const popupContainer = document.querySelector('.popup-section-container');
    const body = document.querySelector('body');

    catalogCards.forEach(catalogCard => {
      catalogCard.addEventListener('click', e => {
        const filmId = Number(e.currentTarget.dataset.movieId);
        myDetailsFunction(filmId);
        popupContainer.classList.remove('hidden');
        body.style.overflow = 'hidden';
        const isInLibrary = checkLibrary(filmId);
        updateLibraryButton(isInLibrary, filmId);
      });
    });
  }

  function updatePagination() {
    if (!isCatalogPage) return;
    pageNumbersContainer.innerHTML = '';

    const totalPageLinks = 3;
    const sidePageLinks = 1;

    addPageButton(1);

    if (currentPage > sidePageLinks + 2) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pageNumbersContainer.appendChild(dots);
    }

    const startPage = Math.max(2, currentPage - Math.floor(totalPageLinks / 2));
    const endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(totalPageLinks / 2)
    );

    for (let i = startPage; i <= endPage; i++) {
      addPageButton(i);
    }

    if (currentPage < totalPages - sidePageLinks - 1) {
      const dots = document.createElement('span');
      dots.textContent = '...';
      pageNumbersContainer.appendChild(dots);
    }

    if (totalPages > 1) {
      addPageButton(totalPages);
    }

    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;
  }
  async function addPageButton(pageNum) {
    const pageButton = document.createElement('button');
    pageButton.textContent = pageNum;
    pageButton.classList.add('page-number');

    if (pageNum === currentPage) {
      pageButton.classList.add('active');
    }

    pageButton.addEventListener('click', async () => {
      currentPage = pageNum;
      await fetchMovies(currentPage);
      updatePagination();
    });

    pageNumbersContainer.appendChild(pageButton);
  }

  if (isCatalogPage) {
    prevPageBtn.addEventListener('click', async () => {
      if (currentPage > 1) {
        currentPage--;
        await fetchMovies(currentPage);
        updatePagination();
      }
    });

    nextPageBtn.addEventListener('click', async () => {
      if (currentPage < totalPages) {
        currentPage++;
        await fetchMovies(currentPage);
        updatePagination();
      }
    });
    document.getElementById('movieName').addEventListener('input', () => {
      const movieYearSelect = document.getElementById('movieYear');
      movieYearSelect.innerHTML = '';
      mySelect.style.display = 'none';

      year = '';
    });
    searchButton.addEventListener('click', async () => {
      try {
        query = document.getElementById('movieName').value;
        year = document.getElementById('movieYear').value || '';

        const searchvideos = async (query, year = '') => {
          return await fetchMovies(1, query, year);
        };

        if (isCatalogPage) {
          updatePagination();
        }

        const movies = await searchvideos(query, year);
        if (movies.results.length === 0 || query === '') {
          mySelect.style.display = 'none';
        } else {
          mySelect.style.display = 'block';
        }

        if (Array.isArray(movies.results)) {
          if (!year) {
            const years = movies.results
              .map(movie =>
                movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : null
              )
              .filter(year => year !== null);

            const uniqueYears = [...new Set(years)].sort((a, b) => a - b);
            const movieYearSelect = document.getElementById('movieYear');

            if (movieYearSelect.innerHTML === '') {
              uniqueYears.forEach(year => {
                const option = document.createElement('option');
                option.value = year;
                option.text = year;
                movieYearSelect.appendChild(option);
              });
            }
          }
        } else {
          console.error('Beklenmeyen sonuç: movies bir dizi değil');
        }
      } catch (error) {
        console.error('Film verilerini işlerken hata:', error);
      }
    });
  }

  async function init() {
    await fetchGenres();
    await fetchMovies();
  }

  init();
}
