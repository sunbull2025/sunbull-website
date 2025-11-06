// script.js — SunBull v7.0 (final)
document.addEventListener('DOMContentLoaded', () => {
  const buyUrl = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n toggle
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

  // logo pulse
  (function logoPulse(){
    const logo = document.querySelector('.logo-round');
    if(!logo) return;
    setInterval(()=> logo.classList.toggle('glow'), 2800);
  })();

  // reveal on scroll
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

  // universal anchor handler (any element with data-anchor)
  function scrollToWithOffset(selector){
    const el = document.querySelector(selector);
    if(!el) return;
    el.scrollIntoView({behavior:'smooth', block:'start'});
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    setTimeout(()=> {
      window.scrollBy({ top: -headerH - 10, left: 0, behavior: 'smooth' });
    }, 260);
  }

  document.body.addEventListener('click', (ev) => {
    let t = ev.target;
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

  // mobile bar anchors
  document.querySelectorAll('.mobile-bar .btn').forEach(b=>{
    b.addEventListener('click', (e)=>{
      const sel = b.getAttribute('data-anchor'); if(sel) scrollToWithOffset(sel);
    });
  });

  // buy button coin fx (visual)
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (ev) => {
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

  // footer loop: clone sets until width >= wrap * 2.2
  (function footerLoop(){
    const track = document.querySelector('.footer-track');
    const wrap = document.querySelector('.footer-track-wrap');
    if(!track || !wrap) return;
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
      track.style.animation = `scroll var(--footer-speed) linear infinite`;
    }

    // wait for images to load to measure properly
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

  // protect listing backgrounds and disable contextmenu on them
  (function protectListings(){
    document.addEventListener('contextmenu', (e) => {
      const target = e.target;
      if(target && (target.classList && (target.classList.contains('listing-card') || target.closest && target.closest('.listing-card')))){
        e.preventDefault();
      }
    }, {capture:false});

    // block copy if selection inside listing (best effort)
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const anchorNode = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(anchorNode && anchorNode.closest && anchorNode.closest('.listing-card')){
        e.preventDefault();
      }
    });
  })();

  // check for missing assets (console)
  (function checkAssets(){
    const imgs = Array.from(document.images);
    imgs.forEach(img=>{
      if(!img.complete || (img.complete && img.naturalWidth === 0)){
        console.warn('Image missing or failed to load:', img.getAttribute('src') || img.src);
      }
    });
  })();

  // mobile bg fallback
  function bgFallback(){
    if(window.innerWidth <= 980){
      document.body.style.backgroundAttachment = 'scroll';
      const bg = document.querySelector('.bg'); if(bg) bg.style.backgroundAttachment = 'scroll';
    } else {
      document.body.style.backgroundAttachment = 'fixed';
      const bg = document.querySelector('.bg'); if(bg) bg.style.backgroundAttachment = 'fixed';
    }
  }
  addEventListener('resize', bgFallback);
  bgFallback();
});