document.addEventListener('DOMContentLoaded', () => {

  // Language toggle
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function toggleLang(lang) {
    if (lang === 'zh') {
      enBlocks.forEach(el => el.style.display = 'none');
      zhBlocks.forEach(el => el.style.display = '');
      btnZh.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      zhBlocks.forEach(el => el.style.display = 'none');
      enBlocks.forEach(el => el.style.display = '');
      btnEn.classList.add('active');
      btnZh.classList.remove('active');
    }
  }
  btnEn.addEventListener('click', () => toggleLang('en'));
  btnZh.addEventListener('click', () => toggleLang('zh'));
  toggleLang('en'); // default EN

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 90;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    });
  });

  // Footer animation restart (for mobile resize)
  const footerTrack = document.querySelector('.footer-track');
  if (footerTrack) {
    footerTrack.addEventListener('mouseenter', () => footerTrack.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', () => footerTrack.style.animationPlayState = 'running');
  }

  // Protect images from copy
  document.querySelectorAll('.listing-card img').forEach(img => {
    img.setAttribute('draggable', 'false');
    img.addEventListener('contextmenu', e => e.preventDefault());
  });
});