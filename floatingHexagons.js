function injectFloatingHexagons() {
  if (!document.body.classList.contains('home-page')) return;
  if (document.querySelector('.floating-shapes-container')) return;

  const container = document.createElement('div');
  container.className = 'floating-shapes-container';
  container.innerHTML = `
    <svg style="position: absolute; width: 0; height: 0;" aria-hidden="true">
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="var(--retro-emerald-pop)" />
          <stop offset="100%" stop-color="var(--dark-gold-contrast)" />
        </linearGradient>
      </defs>
    </svg>
    <div class="float-hex hex-1"><svg class="" viewBox="0 0 100 100"><polygon points="50,5 90,28 90,72 50,95 10,72 10,28" /></svg></div>
    <svg class="float-hex hex-2" viewBox="0 0 100 100"><polygon points="50,5 90,28 90,72 50,95 10,72 10,28" /></svg>
    <svg class="float-hex hex-3" viewBox="0 0 100 100"><polygon points="50,5 90,28 90,72 50,95 10,72 10,28" /></svg>
  `;

  document.body.appendChild(container);
}

document.addEventListener('DOMContentLoaded', injectFloatingHexagons);