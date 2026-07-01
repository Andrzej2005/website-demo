(function(){
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

  // =========================================
  // GESTIONE SWIPE (TOUCH & MOUSE)
  // =========================================
  let isDragging = false;
  let startPos = 0;

  // Touch events
  track.addEventListener('touchstart', touchStart);
  track.addEventListener('touchmove', touchMove);
  track.addEventListener('touchend', touchEnd);

  // Mouse events
  track.addEventListener('mousedown', touchStart);
  track.addEventListener('mousemove', touchMove);
  track.addEventListener('mouseup', touchEnd);
  track.addEventListener('mouseleave', touchEnd);

  function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
  }

  function touchStart(event) {
    isDragging = true;
    startPos = getPositionX(event);
    clearInterval(timer); // Ferma il timer automatico durante il drag
    track.style.transition = 'none'; 
  }

  function touchMove(event) {
    if (!isDragging) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    const moveTranslate = -(cur * w()) + diff;
    track.style.transform = `translateX(${moveTranslate}px)`;
  }

  function touchEnd(event) {
    if(!isDragging) return;
    isDragging = false;
    
    const currentPosition = getPositionX(event.type.includes('mouse') ? event : event.changedTouches[0]);
    const movedBy = currentPosition - startPos;
    
    track.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1)';

    // Valuta la soglia dello swipe (100px)
    if (movedBy < -100) {
      go(cur + 1); // Swipe verso sinistra (prossima immagine)
    } else if (movedBy > 100) {
      go(cur - 1); // Swipe verso destra (immagine precedente)
    } else {
      go(cur); // Ritorna all'immagine corrente se il movimento è troppo corto
    }
    
    auto(); // Fai ripartire l'autoplay
  }

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
})();