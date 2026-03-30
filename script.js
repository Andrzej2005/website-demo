(function(){
  // Burger menu
  const burger=document.getElementById('burger'),menu=document.getElementById('mobileMenu');
  burger.addEventListener('change',()=>menu.classList.toggle('open',burger.checked));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{burger.checked=false;menu.classList.remove('open')}));
  document.addEventListener('click',e=>{
    if(!document.getElementById('navbar').contains(e.target)&&!menu.contains(e.target)){burger.checked=false;menu.classList.remove('open')}
  });

  // Carousel
  const car=document.getElementById('heroCarousel'),track=document.getElementById('carouselTrack');
  const slides=track.querySelectorAll('.carousel-slide'),dots=document.querySelectorAll('.carousel-dot');
  let cur=0,timer;
  const w=()=>car.getBoundingClientRect().width;
  function go(i){
    cur=(i+slides.length)%slides.length;
    track.style.transform='translateX(-'+(cur*w())+'px)';
    dots.forEach((d,j)=>d.classList.toggle('active',j===cur));
  }
  function setW(){
    slides.forEach(s=>s.style.width=w()+'px');
    track.style.transition='none';
    track.style.transform='translateX(-'+(cur*w())+'px)';
    requestAnimationFrame(()=>track.style.transition='transform .6s cubic-bezier(.4,0,.2,1)');
  }
  function auto(){clearInterval(timer);timer=setInterval(()=>go(cur+1),5000)}
  window.addEventListener('resize',setW);
  document.getElementById('carouselPrev').addEventListener('click',()=>{go(cur-1);auto()});
  document.getElementById('carouselNext').addEventListener('click',()=>{go(cur+1);auto()});
  dots.forEach(d=>d.addEventListener('click',()=>{go(+d.dataset.index);auto()}));
  setW();go(0);auto();

  // Search focus
  const wrap=document.getElementById('navSearch'),inp=document.getElementById('searchInput');
  inp.addEventListener('focus',()=>wrap.classList.add('focused'));
  inp.addEventListener('blur',()=>wrap.classList.remove('focused'));
})();