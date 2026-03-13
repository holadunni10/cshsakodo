/* ============================================================
   COMMUNITY SENIOR HIGH SCHOOL – AKODO-OROFUN
   Main JavaScript | main.js
   ============================================================ */

"use strict";

/* ===== NAVBAR: SCROLL STICKY + HAMBURGER ===== */
const navbar    = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu   = document.getElementById("nav-menu");

window.addEventListener("scroll", () => {
  if (window.scrollY > 60) {
    navbar.classList.add("scrolled");
    document.getElementById("back-top").classList.add("show");
  } else {
    navbar.classList.remove("scrolled");
    document.getElementById("back-top").classList.remove("show");
  }
  updateActiveNav();
});

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("open");
  navMenu.classList.toggle("open");
});

/* Close mobile menu when a link is clicked */
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navMenu.classList.remove("open");
  });
});

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
function updateActiveNav() {
  const sections = document.querySelectorAll("section[id], header[id]");
  const links    = navMenu.querySelectorAll("a[href^='#']");
  let current    = "";
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 130) current = sec.id;
  });
  links.forEach(a => {
    a.classList.remove("active");
    if (a.getAttribute("href") === "#" + current) a.classList.add("active");
  });
}

/* ===== BACK TO TOP ===== */
document.getElementById("back-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ===== SCROLL REVEAL ANIMATION ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
    }
  });
}, { threshold: 0.10 });

document.querySelectorAll(".reveal, .reveal-left, .reveal-right").forEach(el => {
  revealObserver.observe(el);
});

/* ===== STAFF PHOTO FALLBACK ===== */
/* If a staff image 404s, show the emoji placeholder */
document.querySelectorAll(".staff-img img, .pb-img-wrap img").forEach(img => {
  img.addEventListener("error", function () {
    this.style.display = "none";
    const ph = this.closest(".staff-img, .pb-img-wrap").querySelector(".staff-ph");
    if (ph) ph.style.display = "flex";
  });
  img.addEventListener("load", function () {
    const ph = this.closest(".staff-img, .pb-img-wrap") && this.closest(".staff-img, .pb-img-wrap").querySelector(".staff-ph");
    if (ph) ph.style.display = "none";
  });
});

/* ===== SCHOOL / NAV LOGO FALLBACK ===== */
document.querySelectorAll(".nav-emblem img, .footer-emblem img").forEach(img => {
  img.addEventListener("error", function () {
    this.style.display = "none";
    const ft = this.parentElement.querySelector(".fallback-text");
    if (ft) ft.style.display = "flex";
  });
});

/* ===== GALLERY ===== */
const galleryData = [
  { file: "assembly.jpg",       label: "Morning Assembly",         cat: "school-life" },
  { file: "sports-day.jpg",     label: "Inter-House Sports Day",   cat: "sports"      },
  { file: "classroom.jpg",      label: "Classroom Learning",       cat: "academic"    },
  { file: "graduation.jpg",     label: "Graduation Ceremony",      cat: "events"      },
  { file: "science-lab.jpg",    label: "Science Laboratory",       cat: "academic"    },
  { file: "cultural-day.jpg",   label: "Cultural Day Celebration", cat: "events"      },
  { file: "pta-meeting.jpg",    label: "PTA Meeting",              cat: "school-life" },
  { file: "library.jpg",        label: "School Library",           cat: "academic"    },
  { file: "sports-field.jpg",   label: "Sports Field",             cat: "sports"      },
  { file: "prize-giving.jpg",   label: "Prize Giving Day",         cat: "events"      },
  { file: "waec-prep.jpg",      label: "WAEC Preparation Class",   cat: "academic"    },
  { file: "school-gate.jpg",    label: "School Premises",          cat: "school-life" },
];

const galleryEmojis = ["🏫","🎒","📚","🏅","🔬","🎭","👨‍👩‍👧","📖","⚽","🏆","✏️","🌳"];
const galleryGrid   = document.getElementById("gallery-grid");
let   activeFilter  = "all";

function buildGallery(filter) {
  galleryGrid.innerHTML = "";
  const items = filter === "all" ? galleryData : galleryData.filter(d => d.cat === filter);
  items.forEach((item, i) => {
    const div = document.createElement("div");
    div.className = "gallery-item reveal";
    div.dataset.index = i;
    div.dataset.label = item.label;

    /* Try loading the real image */
    const img = document.createElement("img");
    img.src = "images/gallery/" + item.file;
    img.alt = item.label;
    img.addEventListener("load",  () => { img.classList.add("loaded"); ph.style.display = "none"; });
    img.addEventListener("error", () => { img.style.display = "none"; });

    /* Placeholder */
    const ph = document.createElement("div");
    ph.className = "gallery-ph";
    ph.innerHTML = `<span class="ph-big">${galleryEmojis[i % galleryEmojis.length]}</span><p>${item.label}</p>`;

    /* Overlay */
    const ov = document.createElement("div");
    ov.className = "gallery-overlay";
    ov.innerHTML = `<span>${item.label}</span><small>${categoryLabel(item.cat)}</small>`;

    div.appendChild(img);
    div.appendChild(ph);
    div.appendChild(ov);

    div.addEventListener("click", () => openLightbox(img.src, img.classList.contains("loaded"), item.label));

    galleryGrid.appendChild(div);
  });

  /* Re-observe for reveal animation */
  galleryGrid.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));
}

function categoryLabel(cat) {
  const map = { "school-life": "School Life", "sports": "Sports", "academic": "Academic", "events": "Events" };
  return map[cat] || cat;
}

buildGallery("all");

/* Filter buttons */
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    buildGallery(this.dataset.filter);
  });
});

/* ===== LIGHTBOX ===== */
const lightbox    = document.getElementById("lightbox");
const lbImg       = document.getElementById("lightbox-img");
const lbCaption   = document.getElementById("lightbox-caption");
const lbClose     = document.getElementById("lightbox-close");
const lbPh        = document.getElementById("lb-placeholder");

function openLightbox(src, hasImage, caption) {
  lbCaption.textContent = caption;
  if (hasImage) {
    lbImg.src     = src;
    lbImg.style.display = "block";
    lbPh.style.display  = "none";
  } else {
    lbImg.style.display = "none";
    lbPh.style.display  = "flex";
  }
  lightbox.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
  lbImg.src = "";
}

lbClose.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeLightbox(); });

/* ===== CONTACT FORM ===== */
document.getElementById("contact-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const fname   = document.getElementById("cf-fname").value.trim();
  const lname   = document.getElementById("cf-lname").value.trim();
  const phone   = document.getElementById("cf-phone").value.trim();
  const subject = document.getElementById("cf-subject").value;
  const message = document.getElementById("cf-message").value.trim();

  if (!fname || !lname || !phone || !subject || !message) {
    showFormError("⚠️  Please fill in all fields before sending.");
    return;
  }
  if (!/^[0-9]{10,14}$/.test(phone.replace(/\s/g, ""))) {
    showFormError("⚠️  Please enter a valid phone number.");
    return;
  }

  /* Simulate submission (no backend) */
  const btn = document.getElementById("cf-submit");
  btn.disabled    = true;
  btn.textContent = "Sending…";

  setTimeout(() => {
    document.getElementById("form-success").style.display = "block";
    this.reset();
    btn.disabled    = false;
    btn.textContent = "✉️  Send Message";
    setTimeout(() => { document.getElementById("form-success").style.display = "none"; }, 6000);
  }, 1200);
});

function showFormError(msg) {
  const el = document.getElementById("form-error");
  el.textContent   = msg;
  el.style.display = "block";
  setTimeout(() => { el.style.display = "none"; }, 4000);
}

/* ===== YEAR IN FOOTER ===== */
document.getElementById("footer-year").textContent = new Date().getFullYear();
