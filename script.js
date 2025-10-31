// script.js — Stable interactions & i18n toggle + reveal + small effects
document.addEventListener('DOMContentLoaded', () => {
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('visible');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  reveals.forEach(r => io.observe(r));

  // Language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){ enBlocks.forEach(e=>e.style.display=''); zhBlocks.forEach(e=>e.style.display='none'); btnEn.classList.add('active'); btnZh.classList.remove('active'); btnEn.setAttribute('aria-pressed','true'); btnZh.setAttribute('aria-pressed','false'); }
  function showZH(){ enBlocks.forEach(e=>e.style.display='none'); zhBlocks.forEach(e=>e.style.display=''); btnZh.classList.add('active'); btnEn.classList.remove('active'); btnZh.setAttribute('aria-pressed','true'); btnEn.setAttribute('aria-pressed','false'); }

  btnEn.addEventListener('click', showEN);
  btnZh.addEventListener('click', showZH);
  showEN();

  // Smooth anchor offset for fixed header
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const el = document.querySelector(href);
      if (!el) return;
      e.preventDefault();
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 80;
      const top = el.getBoundingClientRect().top + window.scrollY - headerHeight + 8;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // Buy button small visual effect (coin rain) — lightweight
  document.querySelectorAll('a[href*="sunpump.meme"]').forEach(btn=>{
    btn.addEventListener('click', () => {
      for (let i=0;i<8;i++){
        const el = document.createElement('div');
        el.className = 'coin-fx';
        el.textContent = '☀️';
        el.style.left = (10 + Math.random()*80) + '%';
        el.style.fontSize = (12 + Math.random()*20) + 'px';
        el.style.position = 'fixed';
        el.style.top = '-10px';
        el.style.zIndex = 9999;
        document.body.appendChild(el);
        requestAnimationFrame(()=> el.style.transform = `translateY(110vh) rotate(${Math.random()*720}deg)`);
        setTimeout(()=> el.remove(), 2200);
      }
    });
  });

  // Ensure images don't block pointer events outside cards (defensive)
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('dragstart', e => e.preventDefault());
  });
});