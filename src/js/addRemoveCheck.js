export function addToLibrary(filmId) {
  let library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  if (!library.includes(filmId)) {
    library.push(filmId);
    localStorage.setItem('myLibrary', JSON.stringify(library));
    updateLibraryButton(true, filmId);
  }
}
export function removeFromLibrary(filmId) {
  const pathname = window.location.pathname;
  let library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  library = library.filter(id => id !== filmId);
  localStorage.setItem('myLibrary', JSON.stringify(library));
  updateLibraryButton(false, filmId);

  if (pathname.includes('mylibrary.html')) {
    removeMovieFromUI(filmId);
    closeModal();
  }
}

function removeMovieFromUI(filmId) {
  const movieCard = document.querySelector(`[data-movie-id="${filmId}"]`);
  if (movieCard) {
    movieCard.remove();
  }
  const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  const mylibraryContainer = document.querySelector('#catalog-movie-gallery');

  if (library.length === 0) {
    mylibraryContainer.innerHTML = '<div class="removed-message-container"><h1 class="removed-message">You Successfully Removed All Movies From Your Library</h1></div>';
  }
}

function closeModal() {
  const modal = document.querySelector('.popup-section-container');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

export function checkLibrary(filmId) {
  const library = JSON.parse(localStorage.getItem('myLibrary')) || [];
  return library.includes(filmId);
}
export function updateLibraryButton(isInLibrary, filmId) {
  const addBtn = document.querySelectorAll('.add-btn');
  const removeBtn = document.querySelectorAll('.remove-btn');

  if (isInLibrary) {
    addBtn.forEach(btn => btn.classList.add('hidden'));
    removeBtn.forEach(btn => btn.classList.remove('hidden'));
  } else {
    addBtn.forEach(btn => btn.classList.remove('hidden'));
    removeBtn.forEach(btn => btn.classList.add('hidden'));
  }
  addBtn.forEach(btn => (btn.onclick = () => addToLibrary(filmId)));
  removeBtn.forEach(btn => (btn.onclick = () => removeFromLibrary(filmId)));
}

export function updateLibraryUpcomingButton(filmId) {
  const addBtnUpcoming = document.getElementById('upcoming-add-btn');
  const removeBtnUpcoming = document.getElementById('upcoming-remove-btn');

  function refreshButtons() {
    const isInLibrary = checkLibrary(filmId);
    if (isInLibrary) {
      addBtnUpcoming.classList.add('hidden');
      removeBtnUpcoming.classList.remove('hidden');
    } else {
      addBtnUpcoming.classList.remove('hidden');
      removeBtnUpcoming.classList.add('hidden');
    }
  }

  addBtnUpcoming.onclick = () => {
    addToLibrary(filmId);
    refreshButtons(); // Butonları güncelle
  };

  
  removeBtnUpcoming.onclick = () => {
    removeFromLibrary(filmId);
    refreshButtons();
  };

  refreshButtons();
}
