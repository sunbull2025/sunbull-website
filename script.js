// script.js — Final interactions (i18n, reveal on scroll, protection, effects)
document.addEventListener('DOMContentLoaded', () => {
  // language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e => e.style.display = '');
    zhBlocks.forEach(e => e.style.display = 'none');
    btnEn.classList.add('active'); btnEn.setAttribute('aria-pressed','true');
    btnZh.classList.remove('active'); btnZh.setAttribute('aria-pressed','false');
  }
  function showZH(){
    enBlocks.forEach(e => e.style.display = 'none');
    zhBlocks.forEach(e => e.style.display = '');
    btnZh.classList.add('active'); btnZh.setAttribute('aria-pressed','true');
    btnEn.classList.remove('active'); btnEn.setAttribute('aria-pressed','false');
  }

  btnEn.addEventListener('click', showEN);
  btnZh.addEventListener('click', showZH);
  // default language: English
  showEN();

  // reveal on scroll (IntersectionObserver)
  const reveals = document.querySelectorAll('.reveal, .phase, .listing-card');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, {threshold: 0.12});
  reveals.forEach(r => io.observe(r));

  // smooth anchor with header offset
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 92;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH + 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // coin rain effect on buy (visual only)
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      for(let i=0;i<10;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.position = 'fixed';
        el.style.left = (10 + Math.random()*80) + '%';
        el.style.top = '-20px';
        el.style.zIndex = 9999;
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

  // footer track behavior: pause on hover
  const footerTrack = document.querySelector('.footer-track');
  if(footerTrack){
    footerTrack.addEventListener('mouseenter', () => footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', () => footerTrack.style.animationPlayState = 'running');
  }

  // Protect listing images (best-effort)
  function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      img.addEventListener('mousedown', e => e.preventDefault());
      img.addEventListener('touchstart', e => {
        // block long-press open image on mobile
        e.preventDefault();
      }, {passive:false});
      img.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
    });
    const overlays = document.querySelectorAll('.protect-overlay');
    overlays.forEach(o => {
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('mousedown', e => e.preventDefault());
      o.addEventListener('touchstart', e => e.preventDefault());
    });
  }
  protectImages();

  // disable general image right-click
  document.addEventListener('contextmenu', (e) => {
    const el = e.target;
    if(el && el.tagName === 'IMG') e.preventDefault();
  });

});