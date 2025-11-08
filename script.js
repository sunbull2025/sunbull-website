// script.js — i18n, anchors, reveal, protections, buy fx + delayed open, footer robustness
document.addEventListener('DOMContentLoaded', () => {
  const BUY_URL = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e => e.style.display = '');
    zhBlocks.forEach(e => e.style.display = 'none');
    btnEn && btnEn.classList.add('active');
    btnZh && btnZh.classList.remove('active');
    btnEn && btnEn.setAttribute('aria-pressed','true');
    btnZh && btnZh.setAttribute('aria-pressed','false');
  }
  function showZH(){
    enBlocks.forEach(e => e.style.display = 'none');
    zhBlocks.forEach(e => e.style.display = '');
    btnZh && btnZh.classList.add('active');
    btnEn && btnEn.classList.remove('active');
    btnZh && btnZh.setAttribute('aria-pressed','true');
    btnEn && btnEn.setAttribute('aria-pressed','false');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

  // Reveal on scroll using IntersectionObserver
  (function reveal(){
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {threshold: 0.12});
    els.forEach(e => io.observe(e));
  })();

  // Smooth anchors: buttons & links with hash
  document.querySelectorAll('.nav-link, a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || !href.startsWith('#')) return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const headerOffset = 16;
      const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top, behavior: 'smooth' });
    }, {passive:false});
  });

  // Buy effect: falling suns then open external site (delayed)
  function playBuyAndOpen(url){
    for(let i=0;i<12;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (5 + Math.random()*90) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (12 + Math.random()*28) + 'px';
      document.body.appendChild(el);
      requestAnimationFrame(()=> {
        el.style.transform = `translateY(${110 + Math.random()*20}vh) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
        el.style.transition = 'transform 1.6s cubic-bezier(.2,.9,.2,1), opacity 1.6s linear';
      });
      setTimeout(()=> el.remove(), 1700);
    }
    setTimeout(()=> {
      try { window.open(url, '_blank', 'noopener'); } catch(e){ location.href = url; }
    }, 900);
  }

  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const url = btn.getAttribute('href') || BUY_URL;
      playBuyAndOpen(url);
    }, {passive:false});
  });

  // Protect listing images: block contextmenu/drag/longpress & prevent copy (best-effort)
  (function protect(){
    document.querySelectorAll('.listing-card, .listing-card img').forEach(el => {
      el.setAttribute('draggable','false');
      el.addEventListener('contextmenu', (ev) => ev.preventDefault());
      el.addEventListener('dragstart', (ev) => ev.preventDefault());
      el.addEventListener('mousedown', (ev) => { if(ev.target.tagName === 'IMG') ev.preventDefault(); });
      el.addEventListener('touchstart', (ev) => { ev.preventDefault(); }, {passive:false});
    });

    // block contextmenu on images globally
    document.addEventListener('contextmenu', function(e){
      if(e.target && e.target.tagName === 'IMG') e.preventDefault();
    });

    // try to block copy where selection includes listings
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const node = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(node && node.closest && node.closest('.listings-grid')){
        e.preventDefault();
      }
    });
  })();

  // Ensure footer logos loop is seamless: duplicate inner group if necessary
  (function footerLoopSetup(){
    const track = document.querySelector('.footer-track .logos');
    if(!track) return;
    // If not enough width to loop, duplication already in markup; keep as is.
    // Pause on hover (desktop)
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
  })();

  // ensure pre-visible reveals get shown (for clients where IO may not fire immediately)
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      if(el.getBoundingClientRect().top < window.innerHeight) el.classList.add('visible');
    });
  }, 600);

  // debug missing images
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=> console.warn('Missing image:', img.getAttribute('src') || img.src));
  });

  // background fallback for mobile to avoid performance issues
  function bgFallback(){
    const bg = document.querySelector('.bg');
    if(!bg) return;
    if(window.innerWidth <= 980){
      bg.style.backgroundAttachment = 'scroll';
    } else {
      bg.style.backgroundAttachment = 'fixed';
    }
  }
  bgFallback();
  window.addEventListener('resize', bgFallback);
});