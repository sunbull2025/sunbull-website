document.addEventListener('DOMContentLoaded',()=>{
  const btnEn=document.getElementById('btn-en');
  const btnZh=document.getElementById('btn-zh');
  const en=document.querySelectorAll('.lang-en');
  const zh=document.querySelectorAll('.lang-zh');
  const showLang=(enVisible)=>{
    en.forEach(e=>e.style.display=enVisible?'':'none');
    zh.forEach(e=>e.style.display=enVisible?'none':'');
    btnEn.classList.toggle('active',enVisible);
    btnZh.classList.toggle('active',!enVisible);
  };
  btnEn.onclick=()=>showLang(true);
  btnZh.onclick=()=>showLang(false);

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const target=document.querySelector(link.getAttribute('href'));
      if(target){e.preventDefault();window.scrollTo({top:target.offsetTop-80,behavior:'smooth'});}
    });
  });

  // Animate logos continuous loop
  const track=document.querySelector('.footer-track');
  if(track){
    track.addEventListener('mouseenter',()=>track.style.animationPlayState='paused');
    track.addEventListener('mouseleave',()=>track.style.animationPlayState='running');
  }
});