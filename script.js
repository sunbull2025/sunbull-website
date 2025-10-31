// script.js — Final interactions (i18n toggle, reveal, coin effect, footer pause)

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  // Language toggle functions
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
  showEN(); // default

  // Scroll reveal
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

  // Smooth anchor offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const el = document.querySelector(href);
      if(!el) return;
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 84;
      const top = el.getBoundingClientRect().top + window.scrollY - headerH + 12;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Footer marquee pause on hover (desktop) and always moving on mobile
  const footerTrack = document.querySelector('.footer-track');
  if(footerTrack){
    footerTrack.addEventListener('mouseenter', () => footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', () => footerTrack.style.animationPlayState = 'running');
  }

  // Coin rain effect on buy buttons
  document.querySelectorAll('a[href*="sunpump.meme"]').forEach(btn => {
    btn.addEventListener('click', () => {
      for(let i=0;i<10;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.position = 'fixed';
        el.style.left = (10 + Math.random()*80) + '%';
        el.style.top = '-20px';
        el.style.zIndex = 9999;
        el.style.fontSize = (12 + Math.random()*24) + 'px';
        el.style.opacity = '0.95';
        el.style.transition = 'transform 1.6s linear, opacity 1.6s linear';
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = `translateY(${110 + Math.random()*30}vh) rotate(${Math.random()*720}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(()=> el.remove(), 1800);
      }
    });
  });

  // Prevent image drag
  document.querySelectorAll('img').forEach(img => img.addEventListener('dragstart', e => e.preventDefault()));
});