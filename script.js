(() => {
    'use strict';

    const root = document.documentElement;
    const nav = document.getElementById('navigation');
    const menu = document.querySelector('.menu-toggle');
    const languageSwitch = document.querySelector('.language-switch');
    const effectsButton = document.querySelector('.effects-toggle');
    const mobile = matchMedia('(max-width: 800px)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const stages = [...document.querySelectorAll('.stage')];
    const stageLinks = [...document.querySelectorAll('.stage-nav a')];
    const readStorage = key => { try { return localStorage.getItem(key); } catch { return null; } };
    const saveStorage = (key, value) => { try { localStorage.setItem(key, value); } catch { /* Preferences remain optional. */ } };
    let language = readStorage('dellanio-language');
    if (!['pt', 'en'].includes(language)) language = (navigator.language || 'pt').startsWith('en') ? 'en' : 'pt';
    let effectPreference = readStorage('dellanio-effects');
    let effects = effectPreference === null ? !reducedMotion.matches : effectPreference === 'on';
    let currentStage = 0;
    let sceneTarget = 0;
    let sceneValue = 0;
    let pointerX = 0;
    let pointerY = 0;
    let pointerCurrentX = 0;
    let pointerCurrentY = 0;
    let heroScroll = 0;
    let mediumPosts = null;

    const copy = {
        pt: {
            title: 'Dellanio Alencar — Engenharia & liderança',
            description: 'Dellanio Alencar. Liderança de engenharia, arquitetura de software e experiência internacional em sistemas críticos. Pessoas no centro. Engenharia em escala.',
            social: 'Pessoas no centro. Engenharia em escala. Conheça minha trajetória em liderança e arquitetura de software.',
            open: 'Abrir menu', close: 'Fechar menu', effectsOn: 'Ativar efeitos', effectsOff: 'Desativar efeitos',
            modes: ['Conectar pessoas', 'Desenhar arquitetura', 'Sustentar a entrega'],
            dimensions: ['Um time. Direção compartilhada.', 'Decisões que se conectam.', 'Da estratégia à operação.']
        },
        en: {
            title: 'Dellanio Alencar — Engineering & leadership',
            description: 'Dellanio Alencar. Engineering leadership, software architecture, and international experience with critical systems. People at the center. Engineering at scale.',
            social: 'People at the center. Engineering at scale. Explore my work in leadership and software architecture.',
            open: 'Open menu', close: 'Close menu', effectsOn: 'Enable effects', effectsOff: 'Disable effects',
            modes: ['Connect people', 'Design architecture', 'Support delivery'],
            dimensions: ['One team. A shared direction.', 'Decisions that connect.', 'From strategy to operations.']
        }
    };

    function updateControlLabels() {
        menu.setAttribute('aria-label', copy[language][menu.getAttribute('aria-expanded') === 'true' ? 'close' : 'open']);
        const effectLabel = copy[language][effects ? 'effectsOff' : 'effectsOn'];
        effectsButton.setAttribute('aria-label', effectLabel);
        effectsButton.title = effectLabel;
        effectsButton.setAttribute('aria-pressed', String(effects));
    }
    function setMenu(open) {
        nav.classList.toggle('is-open', open);
        menu.setAttribute('aria-expanded', String(open));
        updateControlLabels();
    }
    function setStage(index) {
        currentStage = index;
        document.querySelector('.system-mode').textContent = copy[language].modes[index];
        document.querySelector('.system-dimension').textContent = copy[language].dimensions[index];
        document.querySelector('.system-count').textContent = '0' + (index + 1) + ' / 03';
        document.querySelectorAll('.system-dots i').forEach((dot, i) => dot.classList.toggle('active', i === index));
        stageLinks.forEach((link, i) => {
            if (i === index) link.setAttribute('aria-current', 'step');
            else link.removeAttribute('aria-current');
        });
    }
    function applyLanguage(next, persist = false) {
        language = next;
        root.lang = language === 'pt' ? 'pt-BR' : 'en';
        document.querySelectorAll('[data-pt][data-en]').forEach(element => { element.textContent = element.dataset[language]; });
        document.querySelectorAll('[data-pt-label][data-en-label]').forEach(element => {
            element.setAttribute('aria-label', element.getAttribute('data-' + language + '-label'));
        });
        languageSwitch.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
        document.title = copy[language].title;
        document.querySelector('meta[name="description"]').content = copy[language].description;
        document.querySelector('meta[property="og:title"]').content = copy[language].title;
        document.querySelector('meta[property="og:description"]').content = copy[language].social;
        document.querySelector('meta[property="og:locale"]').content = language === 'pt' ? 'pt_BR' : 'en_US';
        updateControlLabels();
        setStage(currentStage);
        if (mediumPosts) renderMediumArticles(mediumPosts);
        if (persist) saveStorage('dellanio-language', language);
    }

    applyLanguage(language);
    root.classList.add('js');
    root.classList.toggle('motion-off', !effects);
    languageSwitch.hidden = false;
    menu.hidden = false;
    effectsButton.hidden = false;
    document.querySelector('.stage-nav').hidden = false;
    document.getElementById('year').textContent = String(new Date().getFullYear());
    languageSwitch.querySelectorAll('button').forEach(button => button.addEventListener('click', () => {
        applyLanguage(button.dataset.language, true);
        requestFrame();
    }));
    menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
        setMenu(false);
        const destination = document.querySelector(link.getAttribute('href'));
        destination.tabIndex = -1;
        destination.focus({ preventScroll: true });
    }));
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menu.focus();
        }
    });
    document.addEventListener('click', event => { if (!event.target.closest('.header-inner')) setMenu(false); });
    mobile.addEventListener('change', () => { setMenu(false); requestFrame(); });

    const countryButtons = [...document.querySelectorAll('[data-country]')];
    function selectCountry(country) {
        countryButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.country === country)));
        document.querySelectorAll('.country-panel').forEach(panel => { panel.hidden = panel.id !== 'country-' + country; });
        document.querySelectorAll('[data-map-country]').forEach(marker => marker.classList.toggle('active', marker.dataset.mapCountry === country));
    }
    document.querySelector('.country-controls').hidden = false;
    selectCountry('br');
    countryButtons.forEach(button => button.addEventListener('click', () => selectCountry(button.dataset.country)));

    // Medium integration for @dellanio
    const MEDIUM_USER = 'dellanio';
    const MEDIUM_FEED_API = 'https://api.rss2json.com/v1/api.json?rss_url=' + encodeURIComponent(`https://medium.com/feed/@${MEDIUM_USER}`);

    function stripHtml(html, maxLength = 175) {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = (doc.body.textContent || '').replace(/\s+/g, ' ').trim();
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength).replace(/[,.;:!\s]+$/, '') + '…';
    }

    function formatPubDate(rawDate, targetLang) {
        try {
            const date = new Date(rawDate.replace(' ', 'T') + (rawDate.includes('Z') ? '' : 'Z'));
            if (isNaN(date.getTime())) return rawDate;
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return date.toLocaleDateString(targetLang === 'pt' ? 'pt-BR' : 'en-US', options).toLowerCase();
        } catch {
            return rawDate;
        }
    }

    function renderMediumArticles(items) {
        const container = document.getElementById('articles-list');
        if (!container || !Array.isArray(items) || items.length === 0) return;

        const latest = items.slice(0, 2);
        container.innerHTML = latest.map(item => {
            const title = item.title ? item.title.trim() : '';
            const link = item.link || `https://medium.com/@${MEDIUM_USER}`;
            const ptDate = formatPubDate(item.pubDate, 'pt');
            const enDate = formatPubDate(item.pubDate, 'en');
            const currentDate = language === 'pt' ? ptDate : enDate;
            const snippet = item.snippet || stripHtml(item.description || item.content || '');
            const iso = item.pubDate ? item.pubDate.split(' ')[0].split('T')[0] : '';
            const ctaPt = 'Ler artigo completo';
            const ctaEn = 'Read full article';
            const ctaText = language === 'pt' ? ctaPt : ctaEn;

            return `
                <article class="article-card">
                    <a class="article-card-link" href="${link}" target="_blank" rel="noopener noreferrer" aria-label="${title} (Medium)" data-pt-label="${title} (abre no Medium)" data-en-label="${title} (opens on Medium)">
                        <div class="article-meta">
                            <span class="article-source">Medium</span>
                            <span class="article-separator" aria-hidden="true">•</span>
                            <time class="article-date" datetime="${iso}" data-pt="${ptDate}" data-en="${enDate}">${currentDate}</time>
                        </div>
                        <h3 class="article-title">${title}</h3>
                        <p class="article-snippet">${snippet}</p>
                        <div class="article-action-row">
                            <span class="article-cta">
                                <span data-pt="${ctaPt}" data-en="${ctaEn}">${ctaText}</span>
                                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6"/></svg>
                            </span>
                        </div>
                    </a>
                </article>
            `;
        }).join('');
    }

    async function loadMediumArticles() {
        try {
            const localRes = await fetch('assets/articles.json');
            if (localRes.ok) {
                const localData = await localRes.json();
                if (Array.isArray(localData) && localData.length > 0) {
                    mediumPosts = localData;
                    renderMediumArticles(mediumPosts);
                    return;
                }
            }
        } catch { /* Continue to remote feed */ }

        try {
            const res = await fetch(MEDIUM_FEED_API);
            if (!res.ok) return;
            const data = await res.json();
            if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
                mediumPosts = data.items;
                renderMediumArticles(mediumPosts);
            }
        } catch {
            // Pre-rendered HTML cards in index.html remain intact
        }
    }

    loadMediumArticles();

    // Three matching point sets let the same structure transform with the story.
    const count = 240;
    const points = Array.from({ length: count }, (_, i) => {
        const y = 1 - (i / (count - 1)) * 2;
        const radius = Math.sqrt(1 - y * y);
        const theta = i * Math.PI * (3 - Math.sqrt(5));
        const layer = Math.floor(i / 80);
        const cell = i % 80;
        const t = (i % 80) / 79;
        return [
            [Math.cos(theta) * radius, y, Math.sin(theta) * radius],
            [((cell % 10) / 9 - .5) * 1.7, (layer - 1) * .64, (Math.floor(cell / 10) / 7 - .5) * 1.7],
            [(t - .5) * 2.4, Math.sin(t * Math.PI * 4 + layer * 2.1) * .3 + (layer - 1) * .53, Math.cos(t * Math.PI * 4 + layer * 2.1) * .45]
        ];
    });
    const edges = [];
    for (let i = 0; i < count; i++) {
        for (let j = i + 1; j < count; j++) {
            const a = points[i][0], b = points[j][0];
            const sphere = Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) < .265;
            const sameLayer = Math.floor(i / 80) === Math.floor(j / 80);
            const grid = sameLayer && (j - i === 10 || (j - i === 1 && Math.floor(i / 10) === Math.floor(j / 10)));
            const bridge = j - i === 80 && i % 17 === 0;
            const flow = sameLayer && (j - i === 1 || j - i === 5);
            if (sphere || grid || bridge || flow) edges.push({ i, j, weights: [sphere ? 1 : 0, grid || bridge ? 1 : 0, flow ? 1 : 0] });
        }
    }

    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const mix = (a, b, t) => a + (b - a) * t;
    const visuals = ['hero-canvas', 'system-canvas'].map(id => {
        const canvas = document.getElementById(id);
        const context = canvas.getContext('2d');
        if (!context) return null;
        return { canvas, context, width: 0, height: 0, visible: true };
    }).filter(Boolean);
    if (visuals.some(v => v.canvas.id === 'system-canvas')) document.querySelector('.system-frame').classList.add('canvas-ready');

    function resizeVisual(visual, width, height) {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        visual.width = width;
        visual.height = height;
        visual.canvas.width = Math.round(width * dpr);
        visual.canvas.height = Math.round(height * dpr);
        visual.context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function draw(visual, scene, rotation, tilt) {
        const { context: ctx, width: w, height: h } = visual;
        if (!w || !h || (!visual.visible && visual.hasDrawn)) return;
        visual.hasDrawn = true;
        ctx.clearRect(0, 0, w, h);
        const base = Math.floor(Math.min(scene, 1.9999));
        const blend = scene >= 2 ? 1 : scene - base;
        const scale = Math.min(w, h) * (visual.canvas.id === 'hero-canvas' ? .39 : .34);
        const cy = Math.cos(rotation), sy = Math.sin(rotation), cx = Math.cos(tilt), sx = Math.sin(tilt);
        const projected = points.map(sets => {
            const a = sets[base], b = sets[base + 1];
            const x = mix(a[0], b[0], blend), y = mix(a[1], b[1], blend), z = mix(a[2], b[2], blend);
            const rx = x * cy + z * sy, rz = -x * sy + z * cy;
            const ry = y * cx - rz * sx, depth = y * sx + rz * cx;
            const perspective = 3.6 / (3.6 + depth);
            return { x: w / 2 + rx * scale * perspective, y: h / 2 + ry * scale * perspective, depth };
        });
        ctx.lineWidth = .65;
        edges.forEach(edge => {
            const weight = mix(edge.weights[base], edge.weights[base + 1], blend);
            if (weight < .015) return;
            const a = projected[edge.i], b = projected[edge.j];
            const opacity = clamp((.34 - (a.depth + b.depth) * .09) * weight, 0, .6);
            ctx.strokeStyle = 'rgba(131,217,237,' + opacity + ')';
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        });
        projected.forEach((p, i) => {
            const highlight = i % 29 === 0;
            const opacity = clamp(.65 - p.depth * .24, .22, 1);
            const radius = highlight ? 2.6 : clamp(1.3 - p.depth * .5, .6, 2);
            ctx.fillStyle = highlight ? 'rgba(231,189,131,' + opacity + ')' : 'rgba(172,230,249,' + opacity + ')';
            ctx.beginPath(); ctx.arc(p.x, p.y, radius, 0, Math.PI * 2); ctx.fill();
            if (highlight) {
                ctx.strokeStyle = 'rgba(231,189,131,' + opacity * .2 + ')';
                ctx.beginPath(); ctx.arc(p.x, p.y, 6, 0, Math.PI * 2); ctx.stroke();
            }
        });
        if (visual.canvas.id === 'hero-canvas') {
            ctx.strokeStyle = 'rgba(131,217,237,.22)';
            ctx.lineWidth = .7;
            ctx.beginPath(); ctx.ellipse(w / 2, h / 2, scale * 1.3, scale * .42, -.5 + rotation * .1, 0, Math.PI * 2); ctx.stroke();
        }
    }

    let frame = null;
    let lastFrame = 0;
    const started = performance.now();
    function requestFrame() {
        if (frame === null && !document.hidden) frame = requestAnimationFrame(update);
    }
    function update(now) {
        frame = null;
        const elapsed = clamp((now - lastFrame) / 16.67, .1, 3);
        lastFrame = now;
        // Batch layout reads before updating styles or canvases.
        const viewport = innerHeight;
        const heroRect = document.getElementById('hero').getBoundingClientRect();
        const rects = stages.map(stage => stage.getBoundingClientRect());
        const stickyRect = document.querySelector('.system-sticky').getBoundingClientRect();
        const pageHeight = root.scrollHeight - viewport;
        const bandRect = document.querySelector('.perspective-band').getBoundingClientRect();
        const viewpoint = mobile.matches && viewport > 600 ? Math.max(viewport * .66, stickyRect.bottom + 90) : viewport * .53;
        const centers = rects.map(rect => rect.top + rect.height * .42);
        if (viewpoint <= centers[0]) sceneTarget = 0;
        else if (viewpoint >= centers[2]) sceneTarget = 2;
        else if (viewpoint < centers[1]) sceneTarget = (viewpoint - centers[0]) / (centers[1] - centers[0]);
        else sceneTarget = 1 + (viewpoint - centers[1]) / (centers[2] - centers[1]);
        const nextStage = Math.round(sceneTarget);
        if (nextStage !== currentStage) setStage(nextStage);
        if (!effects) sceneTarget = nextStage;

        root.style.setProperty('--reading', String(pageHeight > 0 ? clamp(scrollY / pageHeight, 0, 1) : 0));
        const bandProgress = clamp((viewport - bandRect.top) / (viewport + bandRect.height), 0, 1);
        document.querySelector('.perspective-type').style.setProperty('--band-shift', effects ? (-3 - bandProgress * 15) + '%' : '-8%');
        heroScroll = effects ? clamp(-heroRect.top / Math.max(heroRect.height, 1), 0, 1) : 0;
        const smoothing = effects ? 1 - Math.pow(.86, elapsed) : 1;
        sceneValue = mix(sceneValue, sceneTarget, smoothing);
        pointerCurrentX = mix(pointerCurrentX, effects ? pointerX : 0, smoothing);
        pointerCurrentY = mix(pointerCurrentY, effects ? pointerY : 0, smoothing);
        const intro = effects ? clamp((now - started) / 1400, 0, 1) : 1;
        for (const visual of visuals) {
            const isHero = visual.canvas.id === 'hero-canvas';
            draw(visual, isHero ? 0 : sceneValue, (isHero ? .4 + heroScroll * 2 + (1 - intro) * .6 : -.4 + sceneValue * .35) + pointerCurrentX * .16, .25 + pointerCurrentY * .1);
        }
        const moving = Math.abs(sceneValue - sceneTarget) > .001 || Math.abs(pointerCurrentX - (effects ? pointerX : 0)) > .001 || Math.abs(pointerCurrentY - (effects ? pointerY : 0)) > .001;
        if (effects && (moving || intro < 1)) requestFrame();
    }

    const resizeObserver = new ResizeObserver(entries => {
        for (const entry of entries) {
            const visual = visuals.find(item => item.canvas === entry.target);
            if (visual) resizeVisual(visual, entry.contentRect.width, entry.contentRect.height);
        }
        requestFrame();
    });
    visuals.forEach(visual => resizeObserver.observe(visual.canvas));
    const visibilityObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
            const visual = visuals.find(item => item.canvas === entry.target);
            if (visual) visual.visible = entry.isIntersecting;
        }
        requestFrame();
    }, { rootMargin: '80px' });
    visuals.forEach(visual => visibilityObserver.observe(visual.canvas));

    document.querySelectorAll('.hero-art, .system-frame').forEach(surface => {
        surface.addEventListener('pointermove', event => {
            if (!effects || event.pointerType === 'touch') return;
            const rect = surface.getBoundingClientRect();
            pointerX = ((event.clientX - rect.left) / rect.width - .5) * 2;
            pointerY = ((event.clientY - rect.top) / rect.height - .5) * 2;
            requestFrame();
        }, { passive: true });
        surface.addEventListener('pointerleave', () => { pointerX = pointerY = 0; requestFrame(); });
    });
    effectsButton.addEventListener('click', () => {
        effects = !effects;
        effectPreference = effects ? 'on' : 'off';
        saveStorage('dellanio-effects', effectPreference);
        root.classList.toggle('motion-off', !effects);
        updateControlLabels();
        requestFrame();
    });
    reducedMotion.addEventListener('change', () => {
        if (effectPreference === null) {
            effects = !reducedMotion.matches;
            root.classList.toggle('motion-off', !effects);
            updateControlLabels();
            requestFrame();
        }
    });
    addEventListener('scroll', requestFrame, { passive: true });
    addEventListener('resize', requestFrame, { passive: true });
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && frame !== null) { cancelAnimationFrame(frame); frame = null; }
        else requestFrame();
    });
    document.fonts.ready.then(requestFrame);
    requestFrame();
})();
