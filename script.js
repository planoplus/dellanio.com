// ===== Language Toggle =====
let currentLang = 'en';

const langToggleBtn = document.getElementById('langToggle');
const langLabel = document.getElementById('langLabel');
const langAlt = document.getElementById('langAlt');

function applyLanguage(lang) {
    currentLang = lang;
    const attr = lang === 'en' ? 'data-en' : 'data-pt';

    document.querySelectorAll('[data-en]').forEach(el => {
        const text = el.getAttribute(attr);
        if (text) el.innerHTML = text;
    });

    // Update nav lang display
    if (lang === 'en') {
        langLabel.textContent = 'EN';
        langAlt.textContent = 'PT';
    } else {
        langLabel.textContent = 'PT';
        langAlt.textContent = 'EN';
    }

    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
}

langToggleBtn.addEventListener('click', () => {
    applyLanguage(currentLang === 'en' ? 'pt' : 'en');
});

// ===== Sticky Nav =====
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
}, { passive: true });

// ===== Hamburger menu =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
});

// Close mobile menu when clicking a link
mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===== Fade-in on scroll =====
const fadeEls = document.querySelectorAll('.fade-in');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

fadeEls.forEach(el => observer.observe(el));

// ===== Smooth active nav link highlighting =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 120) {
            current = sec.id;
        }
    });
    navLinks.forEach(link => {
        link.style.color = link.getAttribute('href') === `#${current}`
            ? 'var(--accent)'
            : '';
    });
}, { passive: true });
