// script.js — robust anchors, i18n, reveal, protections
document.addEventListener('DOMContentLoaded', () => {
  // i18n
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  const enBlocks = document.querySelectorAll('.lang-en');
  const zhBlocks = document.querySelectorAll('.lang-zh');

  function showEN(){
    enBlocks.forEach(e=>e.style.display='');
    zhBlocks.forEach(e=>e.style.display='none');
    btnEn && btnEn.classList.add('active');
    btnZh && btnZh.classList.remove('active');
  }
  function showZH(){
    enBlocks.forEach(e=>e.style.display='none');
    zhBlocks.forEach(e=>e.style.display='');
    btnZh && btnZh.classList.add('active');
    btnEn && btnEn.classList.remove('active');
  }
  btnEn && btnEn.addEventListener('click', showEN);
  btnZh && btnZh.addEventListener('click', showZH);
  showEN();

  // smooth scroll handler (works for buttons, anchors & mobile)
  function smoothScrollTo(selector){
    if(!selector) return;
    const el = document.querySelector(selector);
    if(!el) return;
    const header = document.querySelector('.site-header');
    const headerH = header ? header.getBoundingClientRect().height : 92;
    const top = el.getBoundingClientRect().top + window.scrollY - headerH - 8;
    window.scrollTo({ top, behavior: 'smooth' });
  }

  // delegate clicks for elements carrying data-anchor or anchor links
  document.body.addEventListener('click', function(e){
    const t = e.target.closest('[data-anchor]');
    if(t){
      e.preventDefault();
      const sel = t.getAttribute('data-anchor');
      if(sel) smoothScrollTo(sel);
      return;
    }
    const a = e.target.closest('a[href^="#"]');
    if(a){
      e.preventDefault();
      const href = a.getAttribute('href');
      if(href) smoothScrollTo(href);
      return;
    }
    // support nav-btn (older markup): check if button.nav-btn with data-target or innerText mapping
    const nb = e.target.closest('.nav-btn');
    if(nb && nb.dataset && nb.dataset.anchor){
      e.preventDefault();
      smoothScrollTo(nb.dataset.anchor);
    }
  }, {passive:false});

  // ensure nav buttons (if plain buttons) also get data-anchor from markup if missing
  document.querySelectorAll('.nav-btn').forEach(btn=>{
    if(!btn.hasAttribute('data-anchor') && btn.textContent){
      const txt = btn.textContent.trim().toLowerCase();
      if(txt.includes('about')) btn.setAttribute('data-anchor', '#about');
      if(txt.includes('token') || txt.includes('tokenomics')) btn.setAttribute('data-anchor', '#tokenomics');
      if(txt.includes('roadmap')) btn.setAttribute('data-anchor', '#roadmap');
      if(txt.includes('list')) btn.setAttribute('data-anchor', '#listings');
      if(txt.includes('how')) btn.setAttribute('data-anchor', '#howto');
    }
  });

  // reveal on scroll
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

  // protect listing cards (block context menu, drag, selection)
  document.querySelectorAll('.listing-card.blur, .listing-card.protected').forEach(card=>{
    card.addEventListener('contextmenu', e => e.preventDefault());
    card.addEventListener('dragstart', e => e.preventDefault());
    card.addEventListener('mousedown', e => { /* no-op */ });
    // touch longpress protection
    card.addEventListener('touchstart', e => { /* no-op */ }, {passive:true});
  });

  // buy visual fx (non-blocking)
  document.querySelectorAll('.btn-buy').forEach(btn=>{
    btn.addEventListener('click', () => {
      for(let i=0;i<8;i++){
        const el = document.createElement('div');
        el.textContent = '☀️';
        el.style.position = 'fixed';
        el.style.left = (5 + Math.random()*90) + '%';
        el.style.top = '-20px';
        el.style.zIndex = 9999;
        el.style.fontSize = (12 + Math.random()*26) + 'px';
        el.style.transition = 'transform 1.6s cubic-bezier(.2,.8,.2,1), opacity 1.6s linear';
        document.body.appendChild(el);
        requestAnimationFrame(()=> {
          el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
          el.style.opacity = '0';
        });
        setTimeout(()=> el.remove(), 1600);
      }
    }, {passive:true});
  });

  // asset load console hints (optional)
  document.querySelectorAll('img').forEach(img=>{
    img.addEventListener('error', ()=> console.warn('Missing image:', img.getAttribute('src')||img.src));
  });

  // bg attachment fallback for mobile
  function bgFallback(){
    const bg = document.querySelector('.bg');
    if(!bg) return;
    if(window.innerWidth <= 980){
      bg.style.backgroundAttachment = 'scroll';
      document.body.style.backgroundAttachment = 'scroll';
    } else {
      bg.style.backgroundAttachment = 'fixed';
      document.body.style.backgroundAttachment = 'fixed';
    }
  }
  window.addEventListener('resize', bgFallback);
  bgFallback();
});