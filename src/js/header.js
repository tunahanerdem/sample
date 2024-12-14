export function header() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll("#header-links a");
  const menuButton = document.querySelector(".menu-button");
  const overlay = document.querySelector('.responsive-overlay');
  const responsiveMenu = document.querySelector('.responsive-menu');
  const body = document.querySelector('body');
  
  let isMenuOpen = false;

  menuButton.addEventListener('click', () => {
    responsiveMenu.classList.add('active-responsive-menu');
    overlay.classList.add('active-overlay');
    body.style.overflow = 'hidden';
    isMenuOpen = true;
  });

  document.addEventListener('click', (event) => {
    if (
      isMenuOpen &&
      !responsiveMenu.contains(event.target) &&
      !menuButton.contains(event.target)
    ) {
      responsiveMenu.classList.remove('active-responsive-menu');
      overlay.classList.remove('active-overlay');
      body.style.overflow = 'auto';
      isMenuOpen = false;
    }
  });


  window.addEventListener('resize', () => {

    if (isMenuOpen) { 
    responsiveMenu.classList.remove('active-responsive-menu');
    overlay.classList.remove('active-overlay');
    body.style.overflow = 'auto';
    isMenuOpen = false;
  }
  });


  links.forEach(link => {
    const linkHref = new URL(link.getAttribute('href'), window.location.origin).pathname;
    if ("/cinemania"+linkHref === currentPath) {
      link.classList.add('active-link');
    }
  });
}