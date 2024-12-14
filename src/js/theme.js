export default function theme() {
  document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.classList.add(currentTheme);

    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      document.body.classList.toggle('dark-theme');

      const newTheme = document.body.classList.contains('dark-theme')
        ? 'dark-theme'
        : 'light-theme';
      localStorage.setItem('theme', newTheme);
    });
  });
}
