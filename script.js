// script.js — interactions, i18n, reveal, protections, footer loop duplication
document.addEventListener('DOMContentLoaded', () => {

  /* --------- Language toggle (EN / 中文) -----------
     Works for elements with classes .lang-en and .lang-zh
  --------------------------------------------------*/
  const btnEn = document.getElementById('btn-en');
  const btnZh = document.getElementById('btn-zh');
  function showLang(lang){
    document.querySelectorAll('.lang-en').forEach(el => el.style.display = lang === 'en' ? '' : 'none');
    document.querySelectorAll('.lang-zh').forEach(el => el.style.display = lang === 'zh' ? '' : 'none');
    if(lang === 'en'){ btnEn.classList.add('active'); btnZh.classList.remove('active'); }
    else { btnZh.classList.add('active'); btnEn.classList.remove('active'); }
  }
  btnEn?.addEventListener('click', () => showLang('en'));
  btnZh?.addEventListener('click', () => showLang('zh'));
  // default
  showLang('en');

  /* --------- Smooth scroll for internal nav links (header offset) --------- */
  const HEADER_OFFSET = 92;
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e){
      // allow external new-tab links (href starting with http) to go through
      const href = this.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* --------- IntersectionObserver reveal on scroll --------- */
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        en.target.classList.add('visible');
        obs.unobserve(en.target);
      }
    });
  }, {threshold: 0.12});
  revealEls.forEach(el => io.observe(el));

  /* --------- Coin / Sun effect on BUY (visual) --------- */
  function sunBurstOnce(){
    for(let i=0;i<14;i++){
      const el = document.createElement('div');
      el.textContent = '☀️';
      el.style.position = 'fixed';
      el.style.left = (10 + Math.random()*80) + '%';
      el.style.top = '-24px';
      el.style.fontSize = (14 + Math.random()*28) + 'px';
      el.style.zIndex = 99999;
      el.style.pointerEvents = 'none';
      el.style.opacity = '1';
      document.body.appendChild(el);
      requestAnimationFrame(() => {
        el.style.transition = 'transform 1400ms cubic-bezier(.2,.8,.2,1), opacity 1400ms linear';
        el.style.transform = `translateY(${110 + Math.random()*40}vh) rotate(${Math.random()*720}deg)`;
        el.style.opacity = '0';
      });
      setTimeout(()=> el.remove(), 1500);
    }
  }
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // visual effect, let link open after small delay
      e.preventDefault();
      sunBurstOnce();
      const href = btn.getAttribute('href');
      setTimeout(() => {
        // open in new tab preserving target attr
        if(href) window.open(href, '_blank', 'noopener');
      }, 420);
    });
  });

  /* --------- Protect listing images (best-effort) --------- */
  function protectImages(){
    const imgs = document.querySelectorAll('.listing-card img, .phase img, .logo-round img, .footer-row img');
    imgs.forEach(img => {
      img.setAttribute('draggable','false');
      img.addEventListener('contextmenu', e => e.preventDefault());
      img.addEventListener('dragstart', e => e.preventDefault());
      // touch hold protection for mobile
      img.addEventListener('touchstart', e => { /* no-op to reduce default long-press */ }, {passive:true});
    });

    // protect overlay blocks clicks on blurred listings
    document.querySelectorAll('.protect-overlay').forEach(o => {
      o.addEventListener('contextmenu', e => e.preventDefault());
      o.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); });
      o.addEventListener('touchstart', e => { e.preventDefault(); e.stopPropagation(); }, {passive:false});
    });

    // disable overall image right-click (best-effort)
    document.addEventListener('contextmenu', (ev) => {
      if(ev.target && ev.target.tagName === 'IMG') ev.preventDefault();
    });
  }
  protectImages();

  /* --------- Footer loop: duplicate row for smooth infinite scroll --------- */
  (function buildFooterLoop(){
    const footerTrack = document.querySelector('.footer-track');
    if(!footerTrack) return;
    // move existing images into a wrapper row and duplicate it
    const imgs = Array.from(footerTrack.querySelectorAll('img'));
    // clear and build two repeated rows
    footerTrack.innerHTML = '';
    const row = document.createElement('div'); row.className = 'footer-row';
    imgs.forEach(i => { const clone = i.cloneNode(true); clone.removeAttribute('id'); row.appendChild(clone); });
    const rowDup = row.cloneNode(true);
    const wrapper = document.createElement('div'); wrapper.className = 'footer-row-wrap';
    wrapper.appendChild(row); wrapper.appendChild(rowDup);
    footerTrack.appendChild(wrapper);

    // pause/resume on hover for desktop
    footerTrack.addEventListener('mouseenter', () => wrapper.style.animationPlayState = 'paused');
    footerTrack.addEventListener('mouseleave', () => wrapper.style.animationPlayState = 'running');
  })();

  /* --------- Accessibility: focus styles --------- */
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Tab') document.body.classList.add('user-tabbing');
  });

});