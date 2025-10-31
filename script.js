// script.js — Final (explosive) interactions, i18n, reveal, protection, coin fx

document.addEventListener('DOMContentLoaded', () => {
  // --- language toggle ---
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=>e.style.display='');
    zhBlocks.forEach(e=>e.style.display='none');
    btnEn.classList.add('active'); btnEn.setAttribute('aria-pressed','true');
    btnZh.classList.remove('active'); btnZh.setAttribute('aria-pressed','false');
  }
  function showZH(){
    enBlocks.forEach(e=>e.style.display='none');
    zhBlocks.forEach(e=>e.style.display='');
    btnZh.classList.add('active'); btnZh.setAttribute('aria-pressed','true');
    btnEn.classList.remove('active'); btnEn.setAttribute('aria-pressed','false');
  }

  btnEn.addEventListener('click', showEN);
  btnZh.addEventListener('click', showZH);
  showEN();

  // --- reveal on scroll (IntersectionObserver) ---
  const reveals = document.querySelectorAll('.reveal, .phase, .listing-card');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));

  // --- smooth anchor offset for fixed header ---
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 88;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH + 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // --- coin rain effect on buy buttons (lightweight) ---
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // coin rain but non-blocking
      for(let i=0;i<10;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.position = 'fixed';
        el.style.left = (10 + Math.random()*80) + '%';
        el.style.top = '-30px';
        el.style.zIndex = 9999;
        el.style.fontSize = (12 + Math.random()*28) + 'px';
        el.style.opacity = '0.95';
        el.style.transition = 'transform 1.4s cubic-bezier(.2,.8,.2,1), opacity 1.4s linear';
        document.body.appendChild(el);
        requestAnimationFrame(()=> {
          el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(()=> el.remove(), 1500);
      }
      // do not prevent default: link opens
    });
  });

  // --- footer track pause on hover (already CSS), mobile continues ---
  const footerTrack = document.querySelector('.footer-track');
  if(footerTrack){
    // ensure continuous loop by resetting animation if necessary (defensive)
    footerTrack.addEventListener('animationiteration', () => {
      // no-op, just keep it smooth
    });
  }

  // --- protect images in listing: prevent right-click, drag and copy ---
  document.querySelectorAll('.listing-card img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
    img.addEventListener('contextmenu', e => e.preventDefault());
    // intercept clicks to prevent opening in new tab via long-press on mobile
    img.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // protect overlay contextmenu / mousedown (blocks copy/select)
  document.querySelectorAll('.protect-overlay').forEach(o => {
    o.addEventListener('contextmenu', (e) => e.preventDefault());
    o.addEventListener('mousedown', (e) => e.preventDefault());
    o.addEventListener('touchstart', (e) => e.preventDefault());
  });

  // global: prevent image copy via clipboard (best-effort)
  document.addEventListener('copy', (e) => {
    // try to remove images from selection (best effort)
    const sel = window.getSelection ? window.getSelection() : null;
    if(sel && sel.rangeCount){
      // do nothing special, but prevent complex clipboard includes
    }
  });

  // disable general image dragging & selection
  document.querySelectorAll('img').forEach(img => {
    img.setAttribute('draggable','false');
  });

  // small: animate logo pulse heavier (explosive)
  const logo = document.querySelector('.logo-round');
  if(logo){
    setInterval(()=> {
      logo.animate([
        { transform: 'scale(1) rotate(0deg)' },
        { transform: 'scale(1.06) rotate(-1deg)' },
        { transform: 'scale(1) rotate(0deg)' }
      ], { duration: 2400, easing: 'cubic-bezier(.22,.9,.2,1)' });
    }, 2600);
  }

});