(() => {
    'use strict';

    const root = document.documentElement;
    const navigation = document.getElementById('navigation');
    const menuButton = document.querySelector('.menu-toggle');
    const languageSwitch = document.querySelector('.language-switch');
    const mobile = window.matchMedia('(max-width: 760px)');
    const translated = document.querySelectorAll('[data-pt][data-en]');
    const labels = document.querySelectorAll('[data-pt-label][data-en-label]');
    let language = 'pt';

    const metadata = {
        pt: {
            title: 'Dellanio Alencar — Liderança de engenharia',
            description: 'Dellanio Alencar. Gestão de engenharia e arquitetura de software, com mais de 15 anos de experiência e atuação internacional em bancos, saúde e sistemas corporativos.',
            social: 'Engenharia com visão de negócio. Liderança próxima das pessoas.',
            open: 'Abrir menu', close: 'Fechar menu'
        },
        en: {
            title: 'Dellanio Alencar — Engineering leadership',
            description: 'Dellanio Alencar. Engineering management and software architecture, with over 15 years of experience and international projects in banking, healthcare, and enterprise systems.',
            social: 'Engineering with business perspective. Leadership that puts people first.',
            open: 'Open menu', close: 'Close menu'
        }
    };

    function updateMenuLabel() {
        menuButton.setAttribute('aria-label', metadata[language][menuButton.getAttribute('aria-expanded') === 'true' ? 'close' : 'open']);
    }

    function setMenu(open) {
        navigation.classList.toggle('is-open', open);
        menuButton.setAttribute('aria-expanded', String(open));
        updateMenuLabel();
    }

    function applyLanguage(next, persist = false) {
        language = next === 'en' ? 'en' : 'pt';
        root.lang = language === 'pt' ? 'pt-BR' : 'en';
        translated.forEach(element => { element.textContent = element.dataset[language]; });
        labels.forEach(element => { element.setAttribute('aria-label', element.getAttribute('data-' + language + '-label')); });
        languageSwitch.querySelectorAll('button').forEach(button => {
            button.setAttribute('aria-pressed', String(button.dataset.language === language));
        });
        document.title = metadata[language].title;
        document.querySelector('meta[name="description"]').content = metadata[language].description;
        document.querySelector('meta[property="og:title"]').content = metadata[language].title;
        document.querySelector('meta[property="og:description"]').content = metadata[language].social;
        document.querySelector('meta[property="og:locale"]').content = language === 'pt' ? 'pt_BR' : 'en_US';
        updateMenuLabel();
        if (persist) {
            try { localStorage.setItem('dellanio-language', language); } catch { /* Navigation remains usable without storage. */ }
        }
    }

    let preferred;
    try { preferred = localStorage.getItem('dellanio-language'); } catch { /* Use browser language when storage is unavailable. */ }
    if (preferred !== 'pt' && preferred !== 'en') {
        preferred = (navigator.language || 'pt').toLowerCase().startsWith('en') ? 'en' : 'pt';
    }
    applyLanguage(preferred);
    root.classList.add('js');
    languageSwitch.hidden = false;
    menuButton.hidden = false;

    languageSwitch.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => applyLanguage(button.dataset.language, true));
    });
    menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
    navigation.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            setMenu(false);
            if (mobile.matches) {
                const section = document.querySelector(link.getAttribute('href'));
                section.tabIndex = -1;
                section.focus({ preventScroll: true });
            }
        });
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuButton.focus();
        }
    });
    document.addEventListener('click', event => {
        if (!event.target.closest('.header-inner')) setMenu(false);
    });
    mobile.addEventListener('change', () => setMenu(false));
    document.getElementById('year').textContent = String(new Date().getFullYear());
})();
