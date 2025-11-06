// script.js — SunBull v6.7 final
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

  // --- Robust smooth anchor with header offset (Android-friendly) ---
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    // adjust after short delay
    setTimeout(()=> {
      window.scrollBy({ top: -headerH - 12, left: 0, behavior: 'smooth' });
    }, 260);
  }

  // attach to header nav buttons (data-anchor)
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const sel = btn.getAttribute('data-anchor');
      if(sel){
        e.preventDefault();
        scrollToWithOffset(sel);
      }
    });
  });

  // attach mobile bar anchors
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
    });
  });

  // hero ghost buttons also use data-anchor (already handled by nav-btn selector when present)
  document.querySelectorAll('[data-anchor]').forEach(el=>{
    // they are handled above (nav-btn / mobile bar). This ensures consistency.
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
      // allow default link behavior to open the href in a new tab
    });
  });

  // --- Footer: seamless loop improvement (3x fill) ---
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
      // append clones until track width >= 3x container width
      while(totalW < wrap.clientWidth * 3 && attempts < 12){
        const clone = initialSet.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        attempts++;
      }
      // safety
      if(track.children.length < 2) track.appendChild(initialSet.cloneNode(true));
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    fill();
    let to;
    window.addEventListener('resize', ()=> { clearTimeout(to); to = setTimeout(fill, 260); });

    // pause/resume on hover/touch
    track.addEventListener('mouseenter', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('mouseleave', ()=> track.style.animationPlayState = 'running');
    track.addEventListener('touchstart', ()=> track.style.animationPlayState = 'paused');
    track.addEventListener('touchend', ()=> track.style.animationPlayState = 'running');
  })();

  // --- Listing blur: touch -> clear blur temporarily (mobile) ---
  (function listingTouchClear(){
    const cards = document.querySelectorAll('.listing-card.blur');
    cards.forEach(card=>{
      let clearTimeoutId = null;
      card.addEventListener('touchstart', (e)=>{
        e.stopPropagation();
        card.classList.add('clear');
        if(clearTimeoutId) clearTimeout(clearTimeoutId);
        clearTimeoutId = setTimeout(()=> card.classList.remove('clear'), 1500);
      }, {passive:false});
      // protect from clicks
      card.addEventListener('click', (e)=> { e.preventDefault(); e.stopPropagation(); });
    });
  })();

  // --- Protect listing images (best-effort, without blocking gestures) ---
  (function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      // avoid preventing touch gestures; keep passive where possible
      img.addEventListener('touchstart', e => { /* no-op to avoid interfering */ }, {passive:true});
      img.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    });
    document.querySelectorAll('.protect-overlay').forEach(o=>{
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('mousedown', e => e.preventDefault());
      o.addEventListener('touchstart', e => e.preventDefault(), {passive:false});
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

  // mobile background fallback (disable fixed on many mobile browsers)
  function mobileBgFallback(){
    if(window.innerWidth <= 980){
      document.body.style.backgroundAttachment = 'scroll';
      const bg = document.querySelector('.bg');
      if(bg) bg.style.backgroundAttachment = 'scroll';
    } else {
      document.body.style.backgroundAttachment = 'fixed';
      const bg = document.querySelector('.bg');
      if(bg) bg.style.backgroundAttachment = 'fixed';
    }
  }
  addEventListener('resize', mobileBgFallback);
  mobileBgFallback();
});