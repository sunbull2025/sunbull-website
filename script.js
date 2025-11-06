// script.js — final corrections (i18n, smooth scroll, footer loop, protections, effects)
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n
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

  // Logo pulse subtle
  (function(){
    const logo = document.querySelector('.logo-circle');
    if(!logo) return;
    setInterval(()=> logo.classList.toggle('glow'), 3000);
  })();

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
    els.forEach(e => io.observe(e));
  })();

  // Smooth scroll with header offset
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // Delegated anchor handler (works for nav buttons and mobile bar)
  document.body.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-anchor]');
    if(btn){
      ev.preventDefault();
      const sel = btn.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
    }
    // ensure native anchor links with href="#..." also work
    const a = ev.target.closest('a[href^="#"]');
    if(a){ ev.preventDefault(); const href=a.getAttribute('href'); if(href) scrollToWithOffset(href); }
  }, {passive:false});

  // Mobile bar anchors (ensure they exist)
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor'); if(sel) scrollToWithOffset(sel);
    });
  });

  // Buy button effect (visual) — non-blocking
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      for(let i=0;i<9;i++){
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

  // Footer loop: ensure duplication until wider than viewport for smooth loop
  (function footerLoop(){
    const wrap = document.querySelector('.footer-track-wrap');
    const track = document.querySelector('.footer-track');
    if(!wrap || !track) return;
    const baseSet = track.querySelector('.footer-set');
    if(!baseSet) return;

    function build(){
      track.innerHTML = '';
      let totalW = 0;
      let tries = 0;
      // append clones until scrollWidth > 2x viewport (smooth)
      while(totalW < wrap.clientWidth * 2 && tries < 12){
        const clone = baseSet.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        tries++;
      }
      // always ensure at least two sets
      if(track.children.length < 2) track.appendChild(baseSet.cloneNode(true));
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    // Wait images to load
    const imgs = Array.from(baseSet.querySelectorAll('img'));
    let loaded = 0;
    if(imgs.length === 0) build();
    imgs.forEach(img=>{
      if(img.complete) loaded++;
      else img.addEventListener('load', ()=>{ loaded++; if(loaded===imgs.length) build(); });
      img.addEventListener('error', ()=>{ loaded++; if(loaded===imgs.length) build(); });
    });
    setTimeout(build, 700);
    window.addEventListener('resize', ()=> setTimeout(build, 220));
    // pause on hover/touch
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('touchend', ()=> track.style.animationPlayState = 'running');
  })();

  // Protect listings & images (best-effort)
  (function protect(){
    // block right-click on images
    document.addEventListener('contextmenu', (e) => {
      const el = e.target;
      if(el && el.tagName === 'IMG' && el.closest('.listing-card')) e.preventDefault();
    }, {capture:false});

    // block drag and click on listing cards
    document.querySelectorAll('.listing-card').forEach(card => {
      card.setAttribute('draggable','false');
      card.addEventListener('dragstart', e => e.preventDefault());
      const overlay = card.querySelector('.protect-overlay');
      if(overlay){
        overlay.addEventListener('mousedown', e=> e.preventDefault());
        overlay.addEventListener('touchstart', e=> e.preventDefault(), {passive:false});
        overlay.addEventListener('contextmenu', e=> e.preventDefault());
      }
    });

    // intercept copy if selection inside listing
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const anchorNode = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(anchorNode && anchorNode.closest && anchorNode.closest('.listing-card')) e.preventDefault();
    });
  })();

  // Image load check (console warnings)
  (function assetCheck(){
    Array.from(document.images).forEach(img => {
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // Mobile background fallback for browsers that ignore fixed
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