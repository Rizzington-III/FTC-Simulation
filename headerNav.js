// Mobile heading bar: toggles the navigation drawer on small screens.
function initHeaderNav() {
  const toggle = document.querySelector('.hamburger-btn');
  const nav = document.getElementById('headerNav');
  if (!toggle || !nav) return;

  const setOpen = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  };

  toggle.addEventListener('click', () => {
    setOpen(!nav.classList.contains('is-open'));
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setOpen(false);
      toggle.focus();
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeaderNav);
} else {
  initHeaderNav();
}
