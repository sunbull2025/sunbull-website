/* -------------------------------------------------------
   SMOOTH SCROLL (nav buttons)
------------------------------------------------------- */
document.querySelectorAll('[data-scroll]').forEach(btn => {
    btn.addEventListener('click', e => {
        const target = document.querySelector(btn.dataset.scroll);
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* -------------------------------------------------------
   REVEAL ON SCROLL
------------------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');

function handleReveal() {
    const triggerPoint = window.innerHeight * 0.85;

    revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < triggerPoint) {
            el.classList.add('visible');
        }
    });
}

window.addEventListener('scroll', handleReveal);
window.addEventListener('load', handleReveal);

/* -------------------------------------------------------
   LANGUAGE SYSTEM
------------------------------------------------------- */

const langPT = document.querySelectorAll("[data-lang='pt']");
const langEN = document.querySelectorAll("[data-lang='en']");
const togglePT = document.getElementById("lang-pt");
const toggleEN = document.getElementById("lang-en");

function setLanguage(lang) {
    if (lang === 'pt') {
        langPT.forEach(el => el.style.display = 'block');
        langEN.forEach(el => el.style.display = 'none');
        togglePT.classList.add("active");
        toggleEN.classList.remove("active");
    } else {
        langEN.forEach(el => el.style.display = 'block');
        langPT.forEach(el => el.style.display = 'none');
        toggleEN.classList.add("active");
        togglePT.classList.remove("active");
    }
    localStorage.setItem("sunbull-lang", lang);
}

togglePT.addEventListener("click", () => setLanguage("pt"));
toggleEN.addEventListener("click", () => setLanguage("en"));

/* Load last selected language */
window.addEventListener("load", () => {
    const saved = localStorage.getItem("sunbull-lang");
    setLanguage(saved || "pt");
});

/* -------------------------------------------------------
   IMAGE PROTECTION (light)
------------------------------------------------------- */

// Disable right-click on specific protected areas
document.querySelectorAll(".protect-overlay").forEach(layer => {
    layer.addEventListener("contextmenu", e => e.preventDefault());
});

// Minimal drag disable
document.querySelectorAll("img").forEach(img => {
    img.setAttribute("draggable", "false");
});

/* -------------------------------------------------------
   MOBILE SCROLL FIX (Safari)
------------------------------------------------------- */
window.addEventListener("load", () => {
    document.body.style.height = "auto";
});

/* -------------------------------------------------------
   BACKGROUND PARALLAX (smooth)
------------------------------------------------------- */
const bg = document.querySelector(".bg");
let lastScroll = 0;

function parallax() {
    const scrollY = window.scrollY;
    if (Math.abs(scrollY - lastScroll) > 1) {
        const offset = scrollY * 0.15;
        bg.style.transform = `translateY(${offset}px)`;
        lastScroll = scrollY;
    }
    requestAnimationFrame(parallax);
}
parallax();