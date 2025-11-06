// script.js — SunBull v6.5 final
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

  // --- Smooth anchors with header offset ---
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const header = document.querySelector('.site-header');
      const headerH = header ? header.getBoundingClientRect().height : 92;
      // offset a bit more to account for header and spacing
      const top = el.getBoundingClientRect().top + window.scrollY - headerH - 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- Buy buttons: coin FX visual ---
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => coinRain());
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

  // --- Footer: seamless loop (duplicate sets to avoid jump) ---
  (function ensureFooterLoop(){
    const track = document.querySelector('.footer-track');
    const wrap = document.querySelector('.footer-track-wrap');
    if(!track || !wrap) return;
    const initialSet = track.querySelector('.footer-set');
    if(!initialSet) return;

    function fill(){
      track.innerHTML = '';
      // append clones until width >= 2x container width
      let totalW = 0;
      let attempts = 0;
      while(totalW < wrap.clientWidth * 2 && attempts < 12){
        const clone = initialSet.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        attempts++;
      }
      // ensure animation is running
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }
    fill();
    let to;
    window.addEventListener('resize', ()=> { clearTimeout(to); to = setTimeout(fill, 220); });
    // pause/resume
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('touchend', ()=> track.style.animationPlayState = 'running');
  })();

  // --- Protect listing images (best-effort) ---
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

  // --- Image load check (logs missing assets) ---
  (function checkAssets(){
    const imgs = Array.from(document.images);
    imgs.forEach(img=>{
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // disable right-click on images (best-effort)
  document.addEventListener('contextmenu', (e) => {
    if(e.target && e.target.tagName === 'IMG') e.preventDefault();
  });

  // mobile background fallback
  function mobileBgFallback(){
    if(window.innerWidth <= 980){
      document.body.style.backgroundAttachment = 'scroll';
      document.querySelector('.bg') && (document.querySelector('.bg').style.backgroundAttachment = 'scroll');
    } else {
      document.body.style.backgroundAttachment = 'fixed';
      document.querySelector('.bg') && (document.querySelector('.bg').style.backgroundAttachment = 'fixed');
    }
  }
  addEventListener('resize', mobileBgFallback);
  mobileBgFallback();
});