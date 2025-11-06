// script.js — SunBull v6.6 final (Android fixes + footer improvements + blur touch)
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

  // --- Smooth anchors with header offset (robust for Android) ---
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    // use scrollIntoView then offset by header height (works well on Android)
    el.scrollIntoView({behavior:'smooth', block:'start'});
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    // after a short delay, adjust for header (Android sometimes needs more time)
    setTimeout(()=> {
      window.scrollBy({ top: -headerH - 12, left: 0, behavior: 'smooth' });
    }, 260);
  }

  // attach to header nav buttons (use data-anchor attribute)
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      const sel = btn.getAttribute('data-anchor');
      if(sel) {
        e.preventDefault();
        scrollToWithOffset(sel);
      }
    });
  });

  // attach mobile bar buttons
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', ()=> {
      const sel = b.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
    });
  });

  // attach CTA ghost buttons that used data-anchor (hero)
  document.querySelectorAll('[data-anchor]').forEach(el=>{
    // already handled above; this ensures any additional element works
  });

  // --- Buy buttons: coin FX visual + open in new tab (safe) ---
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      // create coin fx
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
      // let link open normally (anchor/href). do not block default if anchor exists
    });
  });

  // --- Footer: seamless loop improvement (duplicate until track >= 3x wrap width) ---
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
      // append clones until track width >= 3x container width (gives smoother loop)
      while(totalW < wrap.clientWidth * 3 && attempts < 12){
        const clone = initialSet.cloneNode(true);
        track.appendChild(clone);
        totalW = track.scrollWidth;
        attempts++;
      }
      // safety: if still small, append one more
      if(track.children.length < 2) track.appendChild(initialSet.cloneNode(true));
      // begin animation
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    // initial fill & update on resize
    fill();
    let to;
    window.addEventListener('resize', ()=> { clearTimeout(to); to = setTimeout(fill, 220); });

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
      // on touchstart remove blur class 'clear' for 1500ms
      card.addEventListener('touchstart', (e)=>{
        e.stopPropagation();
        card.classList.add('clear');
        if(clearTimeoutId) clearTimeout(clearTimeoutId);
        clearTimeoutId = setTimeout(()=> card.classList.remove('clear'), 1500);
      }, {passive:false});
      // on mouseenter remove on desktop hover (already handled by CSS hover)
      card.addEventListener('click', (e)=> { e.preventDefault(); e.stopPropagation(); }); // protect from clicks
    });
  })();

  // --- Protect listing images (best-effort) but don't block nav gestures ---
  (function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      img.addEventListener('mousedown', e => { if(e.target && e.target.tagName === 'IMG') e.preventDefault(); });
      // touchstart handled above for blur clear; keep passive:false where we prevent default
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