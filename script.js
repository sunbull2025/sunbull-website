// script.js — Final interactions: i18n, anchors, reveal, protections, buy fx + delayed open, footer behavior, parallax
document.addEventListener('DOMContentLoaded', () => {
  const BUY_URL = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n toggle (EN <-> ZH)
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');

  function showLang(lang){
    document.querySelectorAll('.lang-en').forEach(e => e.style.display = lang === 'en' ? '' : 'none');
    document.querySelectorAll('.lang-zh').forEach(e => e.style.display = lang === 'zh' ? '' : 'none');
    document.querySelectorAll('.lang').forEach(b => b.classList.remove('active'));
    if(lang === 'en') btnEn && btnEn.classList.add('active');
    else btnZh && btnZh.classList.add('active');
  }

  btnEn && btnEn.addEventListener('click', () => showLang('en'));
  btnZh && btnZh.addEventListener('click', () => showLang('zh'));
  showLang('en');

  // Reveal on scroll with IntersectionObserver
  (function revealOnScroll(){
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, {threshold:0.12});
    els.forEach(e => io.observe(e));
  })();

  // Smooth anchors for hero nav buttons and any hash links
  document.querySelectorAll('.nav-btn, a[href^="#"]').forEach(el=>{
    el.addEventListener('click', (e) => {
      const target = el.getAttribute('data-target') || el.getAttribute('href');
      if(!target || !target.startsWith('#')) return;
      const dest = document.querySelector(target);
      if(!dest) return;
      e.preventDefault();
      const offset = 12;
      const top = dest.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, {passive:false});
  });

  // BUY: play sun-fx then open new tab (delayed)
  function playBuyAndOpen(url){
    for(let i=0;i<14;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (6 + Math.random()*88) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (12 + Math.random()*28) + 'px';
      document.body.appendChild(el);
      requestAnimationFrame(()=> {
        el.style.transform = `translateY(${110 + Math.random()*20}vh) rotate(${Math.random()*720}deg)`;
        el.style.transition = 'transform 1.5s cubic-bezier(.2,.9,.2,1), opacity 1.5s linear';
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1600);
    }
    setTimeout(()=> {
      try { window.open(url, '_blank', 'noopener'); } catch(e){ location.href = url; }
    }, 800);
  }

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('href') || BUY_URL;
      playBuyAndOpen(url);
    }, {passive:false});
  });

  // Protect listing elements: block contextmenu/drag and touch long-press best-effort
  (function protectListings(){
    document.querySelectorAll('.protected, .listing-card').forEach(el => {
      el.setAttribute('draggable','false');
      el.addEventListener('contextmenu', e => e.preventDefault());
      el.addEventListener('dragstart', e => e.preventDefault());
      el.addEventListener('mousedown', e => { if(e.target.tagName === 'IMG') e.preventDefault(); });
      el.addEventListener('touchstart', e => { /* best-effort: no-op to avoid long-press menu */ }, {passive:true});
    });

    document.addEventListener('contextmenu', (e) => {
      if(e.target && e.target.tagName === 'IMG') e.preventDefault();
    });
  })();

  // Footer loop: pause on hover (desktop)
  (function footerLoopControls(){
    const logos = document.querySelector('.footer-track .logos');
    if(!logos) return;
    logos.addEventListener('mouseenter', ()=> logos.style.animationPlayState = 'paused');
    logos.addEventListener('mouseleave', ()=> logos.style.animationPlayState = 'running');
  })();

  // Background parallax (subtle) — only on desktop for performance
  (function parallaxBg(){
    const bg = document.querySelector('.bg');
    if(!bg) return;
    function update(){
      if(window.innerWidth > 980){
        const y = window.scrollY * 0.06; // subtle movement
        bg.style.transform = `translateY(${y}px)`;
      } else {
        bg.style.transform = '';
      }
    }
    update();
    window.addEventListener('scroll', update, {passive:true});
    window.addEventListener('resize', update);
  })();

  // Fallback: show reveals already on top of viewport after load
  setTimeout(()=> document.querySelectorAll('.reveal').forEach(el=>{
    if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
  }), 600);

  // Debug helper for missing images (prints to console)
  document.querySelectorAll('img').forEach(img => img.addEventListener('error', ()=> console.warn('Missing image:', img.getAttribute('src') || img.src)));
});