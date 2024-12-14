import { myDetailsFunction, myTrailerFunction } from './mydetailsfunction.js';
import { displayMovieRating } from './displayMovieRating.js';
import { checkLibrary, updateLibraryButton } from './addRemoveCheck.js';

export function hero() {
  const api_key = '3e7bd78082a78694a13d5e52c5addee0';
  const pathname = window.location.pathname;
  const popupTrailer = document.querySelector('.popup-trailer');
  const imageContainer = document.getElementById('movies-image-container');
  const descriptionContainer = document.getElementById(
    'movies-description-container'
  );
  const popupContainer = document.querySelector('.popup-section-container');
  const body = document.querySelector('body');

  const initialContent = () => {
    if (pathname.includes('/') || pathname.includes('catalog.html')) {
      imageContainer.innerHTML =
        '<img class="image" src="./img/stranger_things.jpeg"/>';
      descriptionContainer.innerHTML = `
        <h1 class="hero-movie-title">Let's Make Your Own Cinema</h1>
        <div class="desc-button-container">
          <p class="hero-movie-desc">Is a guide to creating a personalized movie theater experience. You'll need a projector, screen, and speakers. Decorate your space, choose your films, and stock up on snacks for the full experience.</p>
          <div class="hero-movie-buttons">
            <button class="orange-button btn-hero trailer">Get Started</button>
          </div>
        </div>
      `;
    } else {
      imageContainer.innerHTML = '<img class="image" src="./img/seats.png"/>';
      descriptionContainer.innerHTML = `
        <h1 class="hero-movie-title">Create Your Dream Cinema</h1>
        <div class="desc-button-container">
          <p class="hero-movie-desc"> Is a guide to designing a personalized movie theater experience with the right equipment, customized decor, and favorite films. This guide helps you bring the cinema experience into your own home with cozy seating, dim lighting, and movie theater snacks.</p>
        </div>
      `;
    }
  };

  const fetchTrendingByDay = async () => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/movie/week?api_key=${api_key}&language=en-US`
      );

      if (!res.ok) {
        initialContent();
        throw new Error('Failed to fetch trending movies');
      }

      const data = await res.json();
      const movies = data.results;
      const filteredMovies = movies.filter(movie => {
        const releaseYear = new Date(movie.release_date).getFullYear();
        return releaseYear >= 2024;
      });
      const randomMovie =
        filteredMovies[Math.floor(Math.random() * filteredMovies.length)];
      displayMovie(randomMovie);
    } catch (error) {
      console.error('Error fetching trending movies:', error);
    }
  };

  const displayMovie = async movie => {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/images?&api_key=${api_key}&language=en&language=null`
      );
      const imageData = await res.json();
      const movieImage =
        imageData.backdrops[
          Math.floor(Math.random() * imageData.backdrops.length)
        ];
      const movieOverview = movie.overview.split(' ').slice(0, 40).join(' ');

      const screenWidth = window.innerWidth;

      // Görüntü URL'sini belirle
      const imagePath = movieImage.file_path;
      let imageUrl = '';

      // 700 pikselden büyükse orijinal boyut, küçükse w500 boyutu
      if (screenWidth > 700) {
        imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
      } else {
        imageUrl = `https://image.tmdb.org/t/p/w500${imagePath}`;
      }

      // HTML içeriğini güncelle
      imageContainer.innerHTML = `<img class="image" src="${imageUrl}" alt="${movie.title}" /> <div class="gradient"></div>`;

      descriptionContainer.innerHTML = `
        <h1 class="hero-movie-title">${movie.title}</h1>
        <div class="stars-container" id="starsContainer"></div>
        <div class="desc-button-container">
          <p class="hero-movie-desc">${movieOverview}...</p>
          <div class="hero-movie-buttons">
            <button id="trailer" class="orange-button btn-hero trailer">Watch trailer</button>
            <button id="details" class="white-button btn-hero details">More details</button>
          </div>
        </div>
      `;
     

      starsContainer.innerHTML = displayMovieRating(movie.vote_average);
      const trailerButton = document.getElementById('trailer');
      const detailsButton = document.getElementById('details');


      detailsButton.addEventListener('click', () => {
        popupContainer.classList.remove('hidden');
        body.style.overflow = 'hidden';
        const movieID = movie.id;
        myDetailsFunction(movieID);
        const isInLibrary = checkLibrary(movieID);
        updateLibraryButton(isInLibrary, movieID);
      });

      trailerButton.addEventListener('click', async () => {
        popupContainer.classList.remove('hidden');
        body.style.overflow = 'hidden';
        popupTrailer.innerHTML = '';
        myTrailerFunction(movie.id);
      });
    } catch (error) {
      console.error('Error displaying movie:', error);
    }
  };

  fetchTrendingByDay();
}
