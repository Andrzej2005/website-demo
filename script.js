(function(){
  // Controllo iniziale e applicazione del tema salvato nel browser
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-theme');
  }

  // Configurazione Carosello Responsivo
  const car = document.getElementById('heroCarousel');
  const track = document.getElementById('carouselTrack');
  const slides = track.querySelectorAll('.carousel-slide');
  const dots = document.querySelectorAll('.carousel-dot');
  let cur = 0;
  let timer;

  const w = () => car.getBoundingClientRect().width;

  function go(i) {
    cur = (i + slides.length) % slides.length;
    track.style.transform = 'translateX(-' + (cur * w()) + 'px)';
    dots.forEach((d, j) => d.classList.toggle('active', j === cur));
  }

  function setW() {
    slides.forEach(s => s.style.width = w() + 'px');
    track.style.transition = 'none';
    track.style.transform = 'translateX(-' + (cur * w()) + 'px)';
    requestAnimationFrame(() => track.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)');
  }

  function auto() {
    clearInterval(timer);
    timer = setInterval(() => go(cur + 1), 5000);
  }

  window.addEventListener('resize', setW);
  
  // Controlli di navigazione (Dots)
  dots.forEach(d => d.addEventListener('click', () => {
    go(+d.dataset.index);
    auto();
  }));

  // Avvio iniziale carosello
  setW();
  go(0);
  auto();

  // Gestione Invio Ricerca tramite tasto Enter
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if(query) {
          console.log("Ricerca avviata per:", query);
        }
      }
    });
  }

  // Switcher della Dark Mode con salvataggio delle preferenze in localStorage
  const themeToggle = document.getElementById('themeToggle');
  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
})();