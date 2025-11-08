document.addEventListener('DOMContentLoaded', () => {
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  // language toggle
  function showEN() {
    enBlocks.forEach(e => e.style.display = '');
    zhBlocks.forEach(e => e.style.display = 'none');
    btnEn.classList.add('active');
    btnZh.classList.remove('active');
  }
  function showZH() {
    enBlocks.forEach(e => e.style.display = 'none');
    zhBlocks.forEach(e => e.style.display = '');
    btnZh.classList.add('active');
    btnEn.classList.remove('active');
  }
  btnEn.addEventListener('click', showEN);
  btnZh.addEventListener('click', showZH);
  showEN();

  // smooth scroll for any [data-anchor] or a[href^="#"]
  function smoothScrollTo(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    const offset = document.querySelector('.site-header')?.offsetHeight || 80;
    const top = el.getBoundingClientRect().top + window.scrollY - offset + 5;
    window.scrollTo({ top, behavior: 'smooth' });
  }
  document.body.addEventListener('click', e => {
    const t = e.target.closest('[data-anchor]');
    if (t) {
      e.preventDefault();
      const sel = t.getAttribute('data-anchor');
      if (sel) smoothScrollTo(sel);
    }
  });

  // reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(r => io.observe(r));

  // protect listings from copy or drag
  document.querySelectorAll('.listing-card.blur').forEach(card => {
    card.addEventListener('contextmenu', e => e.preventDefault());
    card.addEventListener('dragstart', e => e.preventDefault());
  });

  // basic coin animation when buying
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', () => {
      for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.textContent = '☀️';
        el.style.position = 'fixed';
        el.style.left = Math.random() * 100 + '%';
        el.style.top = '-10px';
        el.style.fontSize = 12 + Math.random() * 24 + 'px';
        el.style.transition = 'all 2s ease';
        document.body.appendChild(el);
        requestAnimationFrame(() => {
          el.style.transform = `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`;
          el.style.opacity = 0;
        });
        setTimeout(() => el.remove(), 1800);
      }
    });
  });
});