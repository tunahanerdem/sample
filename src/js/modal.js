const popupSection = document.querySelector('.popup-section');
const popupSectionContainer = document.querySelector('.popup-section-container');
const closeBtn = document.querySelector('.close-btn');
const body = document.querySelector('body');



let isModalOpen = false;

export function openModal() {
  if (isModalOpen) return;  // Açık bir modal varken tekrar açılmasını önle
  isModalOpen = true;
  popupSectionContainer.classList.remove('hidden');
  body.style.overflow = 'hidden';
  

  addEventListeners();
}

export function closeModal() {
  if (!isModalOpen) return;  // Modal kapalıysa tekrar kapatma işlemini engelle
  isModalOpen = false;
  popupSectionContainer.classList.add('hidden');
  body.style.overflow = 'auto';
  removeEventListeners();
}

function addEventListeners() {
  document.addEventListener('click', handleOutsideClick);
  document.addEventListener('keydown', handleEscapePress);
  closeBtn.addEventListener('click', closeModal);
}

function removeEventListeners() {
  document.removeEventListener('click', handleOutsideClick);
  document.removeEventListener('keydown', handleEscapePress);
  closeBtn.removeEventListener('click', closeModal);
}

function handleOutsideClick(e) {
  if (!popupSection.contains(e.target)) {
    closeModal();
  }
}

function handleEscapePress(e) {
  if (e.key === 'Escape') {
    closeModal();
  }
}
