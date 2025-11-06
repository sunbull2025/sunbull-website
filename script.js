// script.js — SunBull final (i18n, scroll, protections, footer loop, effects)
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n buttons
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=> e.style.display = '');
    zhBlocks.forEach(e=> e.style.display = 'none');
    btnEn && btnEn.classList.add('active'); btnEn && btnEn.setAttribute('aria-pressed','true');
    btnZh && btnZh.classList.remove('active'); btnZh && btnZh.setAttribute('aria-pressed','false');
  }
  function showZH(){
    enBlocks.forEach(e=> e.style.display = 'none');
    zhBlocks.forEach(e=> e.style.display = '');
    btnZh && btnZh.classList.add('active'); btnZh && btnZh.setAttribute('aria-pressed','true');
    btnEn && btnEn.classList.remove('active'); btnEn && btnEn.setAttribute('aria-pressed','false');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

  // Logo pulse
  (function logoPulse(){
    const logo = document.querySelector('.logo-circle');
    if(!logo) return;
    setInterval(()=> logo.classList.toggle('glow'), 2800);
  })();

  // Reveal on scroll
  (function revealOnScroll(){
    const els = document.querySelectorAll('.reveal, .phase, .listing-card');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if(en.isIntersecting){
          en.target.classList.add('visible');
          obs.unobserve(en.target);
        }
      });
    }, {threshold: 0.12});
    els.forEach(e => io.observe(e));
  })();

  // Universal anchor handler using delegation
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  document.body.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-anchor]');
    if(btn){
      ev.preventDefault();
      const sel = btn.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
    }
  }, {passive:false});

  // Mobile bar anchors
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor'); if(sel) scrollToWithOffset(sel);
    });
  });

  // Buy button visual coins effect (non-blocking)
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      // allow default navigation to buyUrl; just also show coins
      for(let i=0;i<12;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.left = (8 + Math.random()*84) + '%';
        el.style.top = '-20px';
        el.style.fontSize = (12 + Math.random()*26) + 'px';
        el.style.opacity = '0.95';
        el.style.transition = 'transform 1.6s cubic-bezier(.2,.8,.2,1), opacity 1.6s linear';
        document.body.appendChild(el);
        requestAnimationFrame(()=> {
          el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(()=> el.remove(), 1600);
      }
    });
  });

  // Footer track: clone until width sufficient for a smooth loop
  (function footerLoop(){
    const wrap = document.querySelector('.footer-track-wrap');
    const track = document.querySelector('.footer-track');
    if(!wrap || !track) return;
    const initial = track.querySelector('.footer-set');
    if(!initial) return;

    function fill(){
      track.innerHTML = '';
      let totalW = 0;
      let attempts = 0;
      while(totalW < wrap.clientWidth * 2.2 && attempts < 12){
        const clone = initial.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        attempts++;
      }
      if(track.children.length < 2) track.appendChild(initial.cloneNode(true));
      // ensure animation applied (CSS handles it via keyframes)
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    // Wait for images to load
    const imgs = Array.from(initial.querySelectorAll('img'));
    let loaded = 0;
    if(imgs.length === 0) fill();
    imgs.forEach(img=>{
      if(img.complete) loaded++;
      else img.addEventListener('load', ()=> { loaded++; if(loaded === imgs.length) fill(); });
      img.addEventListener('error', ()=> { loaded++; if(loaded === imgs.length) fill(); });
    });
    setTimeout(fill, 700);

    let to; window.addEventListener('resize', ()=> { clearTimeout(to); to = setTimeout(fill, 260); });

    // pause on hover/touch
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('touchend', ()=> track.style.animationPlayState = 'running');
  })();

  // Protect listings: block contextmenu/drag and prevent click open (best effort)
  (function protectListings(){
    document.addEventListener('contextmenu', (e) => {
      const target = e.target;
      if(target && (target.classList && (target.classList.contains('listing-card') || target.closest && target.closest('.listing-card')))){
        e.preventDefault();
      }
    }, {capture:false});

    const imgs = document.querySelectorAll('.listing-card');
    imgs.forEach(img=>{
      img.setAttribute('draggable','false');
      // block pointer events handled by CSS (pointer-events:none on blur), also protect overlay interactions
      const overlay = img.querySelector('.protect-overlay');
      if(overlay){
        overlay.addEventListener('contextmenu', e=> e.preventDefault());
        overlay.addEventListener('mousedown', e=> e.preventDefault());
        overlay.addEventListener('touchstart', e=> e.preventDefault(), {passive:false});
      }
    });

    // block copy if selection inside listing (best-effort)
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const anchorNode = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(anchorNode && anchorNode.closest && anchorNode.closest('.listing-card')){
        e.preventDefault();
      }
    });
  })();

  // Disable right click on images globally (best-effort)
  document.addEventListener('contextmenu', (e) => {
    const el = e.target;
    if(el && el.tagName === 'IMG') e.preventDefault();
  });

  // Asset check (console warnings)
  (function checkAssets(){
    const imgs = Array.from(document.images);
    imgs.forEach(img=>{
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // Mobile background fallback: some mobile browsers ignore background-attachment:fixed
  function bgFallback(){
    const bg = document.querySelector('.bg');
    if(window.innerWidth <= 980){
      if(bg) bg.style.backgroundAttachment = 'scroll';
    } else {
      if(bg) bg.style.backgroundAttachment = 'fixed';
    }
  }
  addEventListener('resize', bgFallback);
  bgFallback();
});