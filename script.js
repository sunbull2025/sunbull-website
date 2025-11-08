// Final script.js — anchors, i18n, reveal, protections, buy fx+delay, footer robust
document.addEventListener('DOMContentLoaded', () => {
  const BUY_URL = 'https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM';

  // i18n toggles
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e => e.style.display = '');
    zhBlocks.forEach(e => e.style.display = 'none');
    btnEn && btnEn.classList.add('active');
    btnZh && btnZh.classList.remove('active');
  }
  function showZH(){
    enBlocks.forEach(e => e.style.display = 'none');
    zhBlocks.forEach(e => e.style.display = '');
    btnZh && btnZh.classList.add('active');
    btnEn && btnEn.classList.remove('active');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

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

  // smooth scroll with header offset (mobile-friendly)
  function scrollToWithOffset(selector){
    if(!selector) return;
    const el = document.querySelector(selector);
    if(!el) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? Math.round(header.getBoundingClientRect().height) : 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // delegate clicks for [data-anchor] + anchor links
  document.body.addEventListener('click', (e) => {
    const t = e.target.closest('[data-anchor]');
    if(t){
      e.preventDefault();
      const sel = t.getAttribute('data-anchor');
      if(sel) scrollToWithOffset(sel);
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if(a){
      e.preventDefault();
      const href = a.getAttribute('href');
      if(href) scrollToWithOffset(href);
      return;
    }
  }, {passive:false});

  // normalize nav-btns: ensure data-anchor present (compatibility with older markup)
  document.querySelectorAll('.nav-btn').forEach(btn => {
    if(!btn.hasAttribute('data-anchor') && btn.textContent){
      const txt = btn.textContent.trim().toLowerCase();
      if(txt.includes('about')) btn.setAttribute('data-anchor', '#about');
      if(txt.includes('token')) btn.setAttribute('data-anchor', '#tokenomics');
      if(txt.includes('roadmap')) btn.setAttribute('data-anchor', '#roadmap');
      if(txt.includes('list')) btn.setAttribute('data-anchor', '#listings');
      if(txt.includes('how')) btn.setAttribute('data-anchor', '#howto');
    }
  });

  // Protect listing cards: block contextmenu/drag/longpress
  (function protectListings(){
    document.querySelectorAll('.listing-card.blur, .listing-card.protected').forEach(card => {
      card.setAttribute('draggable','false');
      card.addEventListener('contextmenu', e => e.preventDefault());
      card.addEventListener('dragstart', e => e.preventDefault());
      card.addEventListener('mousedown', e => e.preventDefault());
      card.addEventListener('touchstart', e => e.preventDefault(), {passive:false});
    });

    // generic prevention on listings grid
    document.addEventListener('contextmenu', function(e){
      if(e.target.closest && e.target.closest('.listings-grid')) e.preventDefault();
    }, {capture:false});

    // prevent copy selection in listings
    document.addEventListener('copy', function(e){
      const sel = window.getSelection();
      if(!sel) return;
      const node = sel.anchorNode && (sel.anchorNode.nodeType === 3 ? sel.anchorNode.parentElement : sel.anchorNode);
      if(node && node.closest && node.closest('.listings-grid')) e.preventDefault();
    });
  })();

  // Buy effect: show falling suns then open external page (delay)
  function playBuyFXAndOpen(url){
    // small visual burst
    for(let i=0;i<10;i++){
      const el = document.createElement('div');
      el.className = 'coin-fx';
      el.textContent = '☀️';
      el.style.left = (10 + Math.random()*80) + '%';
      el.style.top = '-18px';
      el.style.fontSize = (12 + Math.random()*28) + 'px';
      el.style.opacity = '0.95';
      el.style.zIndex = 9999;
      el.style.transition = 'transform 1.2s cubic-bezier(.2,.8,.2,1), opacity 1.2s linear';
      document.body.appendChild(el);
      requestAnimationFrame(()=> {
        el.style.transform = `translateY(${110 + Math.random()*30}vh) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1400);
    }
    // open after 900ms so user sees it
    setTimeout(()=> { try { window.open(url, '_blank', 'noopener'); } catch(e){ location.href = url; } }, 900);
  }

  // attach buy handler to all .btn-buy (handles <a> or button)
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', function(e){
      // if it's an <a>, prevent immediate navigation
      if(this.tagName.toLowerCase() === 'a'){
        e.preventDefault();
        const href = this.getAttribute('href') || BUY_URL;
        playBuyFXAndOpen(href);
      } else {
        playBuyFXAndOpen(BUY_URL);
      }
    }, {passive:false});
  });

  // footer track: pause on hover (desktop)
  (function footerHoverPause(){
    const trackInner = document.querySelector('.footer-track-inner');
    if(!trackInner) return;
    trackInner.addEventListener('mouseenter', ()=> trackInner.style.animationPlayState = 'paused');
    trackInner.addEventListener('mouseleave', ()=> trackInner.style.animationPlayState = 'running');
  })();

  // phase images responsive fallback: ensure appear larger if space
  function adjustPhaseThumbs(){
    document.querySelectorAll('.phase-thumb').forEach(th => {
      th.style.backgroundSize = 'cover';
      th.style.backgroundPosition = 'center';
    });
  }
  adjustPhaseThumbs();
  window.addEventListener('resize', adjustPhaseThumbs);

  // asset load warning for debugging
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=> console.warn('Missing image:', img.getAttribute('src')||img.src));
  });

  // bg fallback for small screens
  (function bgFallback(){
    const bg = document.querySelector('.bg');
    if(!bg) return;
    if(window.innerWidth <= 980){
      bg.style.backgroundAttachment = 'scroll';
      document.body.style.backgroundAttachment = 'scroll';
    } else {
      bg.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundAttachment = 'fixed';
    }
  })();
  window.addEventListener('resize', bgFallback);
});