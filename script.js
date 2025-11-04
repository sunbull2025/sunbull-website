// script.js — i18n, reveal on scroll, smooth anchors, protections, buy FX, footer behavior
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // Language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=> e.style.display = '');
    zhBlocks.forEach(e=> e.style.display = 'none');
    if(btnEn){ btnEn.classList.add('active'); btnEn.setAttribute('aria-pressed','true'); }
    if(btnZh){ btnZh.classList.remove('active'); btnZh.setAttribute('aria-pressed','false'); }
  }
  function showZH(){
    enBlocks.forEach(e=> e.style.display = 'none');
    zhBlocks.forEach(e=> e.style.display = '');
    if(btnZh){ btnZh.classList.add('active'); btnZh.setAttribute('aria-pressed','true'); }
    if(btnEn){ btnEn.classList.remove('active'); btnEn.setAttribute('aria-pressed','false'); }
  }
  if(btnEn) btnEn.addEventListener('click', showEN);
  if(btnZh) btnZh.addEventListener('click', showZH);
  showEN();

  // Reveal on scroll
  (function(){
    const els = document.querySelectorAll('.reveal, .phase, .listing-card');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.12});
    els.forEach(e=> io.observe(e));
  })();

  // Smooth anchors (header offset)
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
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

  // Buy buttons: open buyUrl in new tab if anchor has href (anchors already do), plus coin FX
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      coinRain();
      // allow default anchor behaviour (opening link), so do not call preventDefault.
    });
  });

  function coinRain(){
    for(let i=0;i<12;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (6 + Math.random()*88) + '%';
      el.style.top = '-20px';
      el.style.fontSize = (12 + Math.random()*28) + 'px';
      el.style.opacity = '0.95';
      el.style.transition = 'transform 1.6s cubic-bezier(.2,.8,.2,1), opacity 1.6s linear';
      document.body.appendChild(el);
      requestAnimationFrame(()=> {
        el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1600);
    }
  }

  // Footer track pause/resume on hover/touch
  const footerTrack = document.querySelector('.footer-track');
  if (footerTrack) {
    footerTrack.addEventListener('mouseenter', () => footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', () => footerTrack.style.animationPlayState = 'running');
    footerTrack.addEventListener('touchstart', () => footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('touchend', () => footerTrack.style.animationPlayState = 'running');
  }

  // Protect listing images & overlays (best-effort)
  (function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      img.addEventListener('mousedown', e => { if(e.target && e.target.tagName === 'IMG') e.preventDefault(); });
      img.addEventListener('touchstart', e => { e.preventDefault(); }, {passive:false});
      img.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    });
    document.querySelectorAll('.protect-overlay').forEach(o=>{
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('mousedown', e => e.preventDefault());
      o.addEventListener('touchstart', e => e.preventDefault());
    });
  })();

  // Console check: list missing images (helps debug if sunperp.png missing)
  (function checkAssets(){
    const imgs = Array.from(document.images);
    imgs.forEach(img=>{
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // prevent right-click on images (best-effort)
  document.addEventListener('contextmenu', (e) => {
    if(e.target && e.target.tagName === 'IMG') e.preventDefault();
  });
});