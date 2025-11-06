// script.js — SunBull v6.8 (universal data-anchor handling, footer loop robust)
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // --- i18n toggle (default EN) ---
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=> e.style.display = '');
    zhBlocks.forEach(e=> e.style.display = 'none');
    btnEn && btnEn.classList.add('active');
    btnZh && btnZh.classList.remove('active');
  }
  function showZH(){
    enBlocks.forEach(e=> e.style.display = 'none');
    zhBlocks.forEach(e=> e.style.display = '');
    btnZh && btnZh.classList.add('active');
    btnEn && btnEn.classList.remove('active');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

  // --- Reveal on scroll ---
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

  // --- universal smooth anchor handler (listens to any element with data-anchor) ---
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    setTimeout(()=> {
      window.scrollBy({ top: -headerH - 12, left: 0, behavior: 'smooth' });
    }, 260);
  }

  document.body.addEventListener('click', (ev) => {
    // handle any click on element with data-anchor attribute
    let t = ev.target;
    // climb up if child element clicked (e.g. img inside button)
    while(t && t !== document.body){
      if(t.hasAttribute && t.hasAttribute('data-anchor')){
        ev.preventDefault();
        const sel = t.getAttribute('data-anchor');
        if(sel) scrollToWithOffset(sel);
        return;
      }
      t = t.parentNode;
    }
  }, {passive:false});

  // Attach mobile bar anchors (they are buttons with data-anchor)
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor'); if(sel) scrollToWithOffset(sel);
    });
  });

  // --- Buy buttons: coin FX visual (non-blocking) ---
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      for(let i=0;i<10;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.left = (6 + Math.random()*88) + '%';
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
      // default anchor open in new tab
    });
  });

  // --- Footer: seamless loop (clone until width >= 2x wrap) ---
  (function ensureFooterLoop(){
    const track = document.querySelector('.footer-track');
    const wrap = document.querySelector('.footer-track-wrap');
    if(!track || !wrap) return;
    const initialSet = track.querySelector('.footer-set');
    if(!initialSet) return;

    function fill(){
      track.innerHTML = '';
      let totalW = 0;
      let attempts = 0;
      // append clones until track width >= wrap.clientWidth * 2.2 (safe margin)
      while(totalW < wrap.clientWidth * 2.2 && attempts < 12){
        const clone = initialSet.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        attempts++;
      }
      // safety fallback
      if(track.children.length < 2) track.appendChild(initialSet.cloneNode(true));
      // ensure animation set
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    // run fill after images load to get accurate widths
    const imgs = track.querySelectorAll('img');
    let loaded = 0;
    if(imgs.length === 0) fill();
    imgs.forEach(img => {
      if(img.complete) { loaded++; }
      else img.addEventListener('load', ()=> { loaded++; if(loaded === imgs.length) fill(); });
      img.addEventListener('error', ()=> { loaded++; if(loaded === imgs.length) fill(); });
    });
    // fallback if images never fire
    setTimeout(fill, 700);

    // re-fill on resize
    let to; window.addEventListener('resize', ()=> { clearTimeout(to); to = setTimeout(fill, 260); });

    // pause/resume on hover/touch
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('touchend', ()=> track.style.animationPlayState = 'running');
  })();

  // --- Protect listing backgrounds: no right-click, no drag, no selection ---
  (function protectListings(){
    // backgrounds cannot be right-clicked as images, but we still guard
    document.addEventListener('contextmenu', (e) => {
      if(e.target && (e.target.classList && (e.target.classList.contains('listing-card') || e.target.closest && e.target.closest('.listing-card')))){
        e.preventDefault();
      }
    }, {capture:false});

    // block copy keyboard shortcuts over listings (best-effort)
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const anchor = sel.anchorNode && sel.anchorNode.parentElement;
      if(anchor && anchor.closest && anchor.closest('.listing-card')){
        e.preventDefault();
      }
    });
  })();

  // --- Image load check (logs missing assets) ---
  (function checkAssets(){
    const imgs = Array.from(document.images);
    imgs.forEach(img=>{
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // mobile background fallback
  function mobileBgFallback(){
    if(window.innerWidth <= 980){
      document.body.style.backgroundAttachment = 'scroll';
      const bg = document.querySelector('.bg'); if(bg) bg.style.backgroundAttachment = 'scroll';
    } else {
      document.body.style.backgroundAttachment = 'fixed';
      const bg = document.querySelector('.bg'); if(bg) bg.style.backgroundAttachment = 'fixed';
    }
  }
  addEventListener('resize', mobileBgFallback);
  mobileBgFallback();
});