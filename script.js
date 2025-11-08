// script.js — final (i18n, smooth scroll, protections, reveal)
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n toggles (EN <-> ZH) : full content blocks are duplicated in HTML
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=>e.style.display='');
    zhBlocks.forEach(e=>e.style.display='none');
    btnEn && btnEn.classList.add('active'); btnEn && btnEn.setAttribute('aria-pressed','true');
    btnZh && btnZh.classList.remove('active'); btnZh && btnZh.setAttribute('aria-pressed','false');
  }
  function showZH(){
    enBlocks.forEach(e=>e.style.display='none');
    zhBlocks.forEach(e=>e.style.display='');
    btnZh && btnZh.classList.add('active'); btnZh && btnZh.setAttribute('aria-pressed','true');
    btnEn && btnEn.classList.remove('active'); btnEn && btnEn.setAttribute('aria-pressed','false');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

  // logo glow pulse
  (function logoPulse(){
    const logo = document.querySelector('.logo-circle');
    if(!logo) return;
    setInterval(()=> logo.classList.toggle('glow'), 3000);
  })();

  // reveal on scroll
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

  // smooth scroll with header offset
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // delegated click handling for nav & mobile buttons
  document.body.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-anchor]');
    if(btn){
      ev.preventDefault();
      const sel = btn.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
      return;
    }
    const a = ev.target.closest('a[href^="#"]');
    if(a){ ev.preventDefault(); const href=a.getAttribute('href'); if(href) scrollToWithOffset(href); }
  }, {passive:false});

  // mobile bar anchors
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor'); if(sel) scrollToWithOffset(sel);
    });
  });

  // Buy FX (visual) - non-blocking
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      for(let i=0;i<8;i++){
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
    }, {passive:true});
  });

  // Protect listings & images (best-effort)
  (function protect(){
    // disable right-click on listing area
    document.addEventListener('contextmenu', (e) => {
      if(e.target.closest && e.target.closest('.listings-grid')) e.preventDefault();
    }, {capture:false});

    // block drag/longpress on protected cards
    document.querySelectorAll('.protected').forEach(card => {
      card.setAttribute('draggable','false');
      card.addEventListener('dragstart', e => e.preventDefault());
      const overlay = card.querySelector('.protect-overlay');
      if(overlay){
        overlay.addEventListener('mousedown', e=> e.preventDefault());
        overlay.addEventListener('touchstart', e=> e.preventDefault(), {passive:false});
        overlay.addEventListener('contextmenu', e=> e.preventDefault());
      }
    });

    // intercept copy selection inside listings
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const anchorNode = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(anchorNode && anchorNode.closest && anchorNode.closest('.listings-grid')) e.preventDefault();
    });
  })();

  // asset load warning
  (function assetCheck(){
    Array.from(document.images).forEach(img => {
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // bg fallback for mobile
  function bgFallback(){
    const bg = document.querySelector('.bg');
    if(!bg) return;
    if(window.innerWidth <= 980){
      bg.style.backgroundAttachment = 'scroll';
    } else {
      bg.style.backgroundAttachment = 'fixed';
    }
  }
  addEventListener('resize', bgFallback);
  bgFallback();

}); // DOMContentLoaded