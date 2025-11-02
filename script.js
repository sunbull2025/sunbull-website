// script.js — i18n, reveal on scroll, anchor offset, protections, footer control, buy effects

document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  // language toggle functions
  function showEN(){
    enBlocks.forEach(e=> e.style.display = '');
    zhBlocks.forEach(e=> e.style.display = 'none');
    if(btnEn) { btnEn.classList.add('active'); btnEn.setAttribute('aria-pressed','true'); }
    if(btnZh) { btnZh.classList.remove('active'); btnZh.setAttribute('aria-pressed','false'); }
  }
  function showZH(){
    enBlocks.forEach(e=> e.style.display = 'none');
    zhBlocks.forEach(e=> e.style.display = '');
    if(btnZh) { btnZh.classList.add('active'); btnZh.setAttribute('aria-pressed','true'); }
    if(btnEn) { btnEn.classList.remove('active'); btnEn.setAttribute('aria-pressed','false'); }
  }
  if(btnEn) btnEn.addEventListener('click', showEN);
  if(btnZh) btnZh.addEventListener('click', showZH);
  showEN(); // default

  // reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal, .phase, .listing-card');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));

  // smooth anchor offset (account for fixed header)
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 92;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // buy buttons open link (anchors with href take precedence)
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // If element is <a href="..."> then default navigation will handle it.
      const tag = btn.tagName.toLowerCase();
      if(tag === 'a'){
        // anchor with href -> let it open and show fx
        coinRain();
        return;
      }
      // otherwise open buy URL
      window.open(buyUrl, '_blank', 'noopener');
      coinRain();
    });
  });

  // coin rain effect (visual only)
  function coinRain(){
    for(let i=0;i<10;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (10 + Math.random()*80) + '%';
      el.style.top = '-20px';
      el.style.fontSize = (12 + Math.random()*26) + 'px';
      el.style.opacity = '0.95';
      el.style.transform = 'translateY(0) rotate(0deg)';
      document.body.appendChild(el);
      requestAnimationFrame(()=> {
        el.style.transition = 'transform 1.6s cubic-bezier(.2,.8,.2,1), opacity 1.6s linear';
        el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1600);
    }
  }

  // footer track pause for touch & hover devices
  const footerTrack = document.querySelector('.footer-track');
  if(footerTrack){
    footerTrack.addEventListener('touchstart', ()=> footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('touchend', ()=> footerTrack.style.animationPlayState = 'running');
    footerTrack.addEventListener('mouseenter', ()=> footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', ()=> footerTrack.style.animationPlayState = 'running');
  }

  // protect listing images best-effort
  function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      img.addEventListener('mousedown', e => { if(e.target && e.target.tagName === 'IMG') e.preventDefault(); });
      img.addEventListener('touchstart', e => { e.preventDefault(); }, {passive:false});
      img.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    });
    document.querySelectorAll('.protect-overlay').forEach(o => {
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('mousedown', e => e.preventDefault());
      o.addEventListener('touchstart', e => e.preventDefault());
    });
  }
  protectImages();

  // global prevent right-click on images (best-effort)
  document.addEventListener('contextmenu', (e) => {
    if(e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  // layout tweak on resize to avoid huge listing cards
  function fixListingsLayout(){
    document.querySelectorAll('.listing-card').forEach(card => {
      if(window.innerWidth > 1400){
        card.style.maxWidth = '180px';
      } else {
        card.style.maxWidth = '';
      }
    });
  }
  window.addEventListener('resize', fixListingsLayout);
  fixListingsLayout();

});