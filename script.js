// === LANGUAGE SWITCH ===
const translations = {
  en: {
    title: "SunBull - The SunPump Mascot",
    subtitle: "SunPump · SunSwap · SunPerp — TRON Ecosystem",
    hero: "Forged from TRON’s iconic Bull mascot and the unstoppable energy of the SunPump community — a tribute to Justin Sun and the SUN family.",
    buy: "Buy $SUNBULL",
    story: "Read the Story",
    roadmap: "Roadmap",
    tokenomics: "Tokenomics",
    listings: "Listings",
    follow: "Follow on X",
  },
  zh: {
    title: "SunBull - SunPump 吉祥物",
    subtitle: "SunPump · SunSwap · SunPerp — 波场生态系统",
    hero: "由波场（TRON）的传奇公牛吉祥物与 SunPump 社区的无尽能量融合而成 —— 向 Justin Sun 和 SUN 家族致敬。",
    buy: "购买 $SUNBULL",
    story: "阅读故事",
    roadmap: "路线图",
    tokenomics: "代币经济",
    listings: "上市信息",
    follow: "关注 X",
  }
};

let currentLang = "en";

function toggleLang() {
  currentLang = currentLang === "en" ? "zh" : "en";
  applyLang();
}

function applyLang() {
  const t = translations[currentLang];
  document.querySelector(".title").textContent = t.title;
  document.querySelector(".subtitle").textContent = t.subtitle;
  document.querySelector(".lead").textContent = t.hero;
  document.querySelector(".btn-buy").textContent = t.buy;
  document.querySelector(".btn-story").textContent = t.story;
  document.querySelector(".btn-roadmap").textContent = t.roadmap;
  document.querySelector(".btn-tokenomics").textContent = t.tokenomics;
  document.querySelector(".btn-listings").textContent = t.listings;
  document.querySelector(".btn-follow").textContent = t.follow;
}

// === BUTTON ACTIONS ===
document.addEventListener("DOMContentLoaded", () => {
  const buyUrl = "https://sunpump.meme/token/TAt4ufXFaHZAEV44ev7onThjTnF61SEaEM?utm_source=tokenpocket";

  document.querySelector(".btn-buy")?.addEventListener("click", () => {
    window.open(buyUrl, "_blank", "noopener");
  });

  document.querySelector(".btn-follow")?.addEventListener("click", () => {
    window.open("https://x.com/SunBullOfficial", "_blank", "noopener");
  });

  document.querySelector(".lang-toggle")?.addEventListener("click", toggleLang);

  // === SCROLL ANIMATIONS ===
  const elements = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.1 });
  elements.forEach((el) => observer.observe(el));
});

// === ANIMATION CLASSES ===
document.addEventListener("DOMContentLoaded", () => {
  const fadeEls = document.querySelectorAll(".fade-in");
  fadeEls.forEach((el, i) => {
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 200 * i);
  });
});