/**
 * Панель доступности — Цитадель Физио
 */
document.addEventListener('DOMContentLoaded', () => {
    const accBtn   = document.getElementById('accessibilityBtn');
    const accModal = document.getElementById('accessibilityModal');
    const closeBtn = document.getElementById('closeModal');
    const resetBtn = document.getElementById('resetAll');

    if (!accBtn || !accModal) return;

    const openModal = () => {
        accModal.classList.add('active');
        document.body.classList.add('acc-modal-open');
    };
    const closeModal = () => {
        accModal.classList.remove('active');
        document.body.classList.remove('acc-modal-open');
    };

    accBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    accModal.addEventListener('click', (e) => {
        if (e.target === accModal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && accModal.classList.contains('active')) {
            closeModal();
        }
    });

    const SETTINGS = {
        readableFont:     'acc-readable-font',
        bigCursor:        'acc-big-cursor',
        lineHeight:       'acc-line-height',
        letterSpacing:    'acc-letter-spacing',
        textAlign:        'acc-text-align',
        fontWeight:       'acc-font-weight',
        readableLine:     'acc-readable-line',
        readableMask:     'acc-readable-mask',
        hideImages:       'acc-hide-images',
        highlightContent: 'acc-highlight-content',
        stopAnimation:    'acc-stop-animation',
        highlightLinks:   'acc-highlight-links'
    };

    const BTN_TO_KEY = {
        btnFontFamily:       'readableFont',
        btnBigCursor:        'bigCursor',
        btnLineHeight:       'lineHeight',
        btnLetterSpacing:    'letterSpacing',
        btnTextAlign:        'textAlign',
        btnFontWeight:       'fontWeight',
        btnReadableLine:     'readableLine',
        btnReadableMask:     'readableMask',
        btnHideImages:       'hideImages',
        btnHighlightContent: 'highlightContent',
        btnStopAnimation:    'stopAnimation',
        btnHighlightLinks:   'highlightLinks'
    };

    // --- Читаемая линия (горизонтальный указатель) ---
    let lineEl = document.getElementById('accReadingLine');
    if (!lineEl) {
        lineEl = document.createElement('div');
        lineEl.id = 'accReadingLine';
        lineEl.className = 'acc-reading-line';
        lineEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(lineEl);
    }

    // --- Читаемая маска (полупрозрачный прямоугольник) ---
    let maskEl = document.getElementById('accReadingMask');
    if (!maskEl) {
        maskEl = document.createElement('div');
        maskEl.id = 'accReadingMask';
        maskEl.className = 'acc-reading-mask';
        maskEl.setAttribute('aria-hidden', 'true');
        document.body.appendChild(maskEl);
    }

    const placeGuides = (clientY) => {
        const y = typeof clientY === 'number' ? clientY : window.innerHeight / 2;
        if (document.body.classList.contains('acc-readable-line')) {
            lineEl.style.top = y + 'px';
        }
        if (document.body.classList.contains('acc-readable-mask')) {
            maskEl.style.top = y + 'px';
        }
    };

    const onGuideMove = (e) => placeGuides(e.clientY);
    const onGuideTouch = (e) => {
        if (e.touches && e.touches[0]) placeGuides(e.touches[0].clientY);
    };

    let guidesListening = false;
    const syncGuideListeners = () => {
        const need = document.body.classList.contains('acc-readable-line')
            || document.body.classList.contains('acc-readable-mask');
        if (need && !guidesListening) {
            window.addEventListener('mousemove', onGuideMove, { passive: true });
            window.addEventListener('touchmove', onGuideTouch, { passive: true });
            placeGuides(window.innerHeight / 2);
            guidesListening = true;
        } else if (!need && guidesListening) {
            window.removeEventListener('mousemove', onGuideMove);
            window.removeEventListener('touchmove', onGuideTouch);
            guidesListening = false;
        }
    };

    const applyToggle = (key, className) => {
        const enabled = localStorage.getItem(key) === 'true';
        document.body.classList.toggle(className, enabled);

        if (key === 'readableLine' || key === 'readableMask') {
            syncGuideListeners();
            if (enabled) placeGuides(window.innerHeight / 2);
        }

        const btnId = Object.keys(BTN_TO_KEY).find(id => BTN_TO_KEY[id] === key);
        if (btnId) {
            const btn = document.getElementById(btnId);
            if (btn) btn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
        }
    };

    const toggleSetting = (key, className) => {
        const current = localStorage.getItem(key) === 'true';
        localStorage.setItem(key, String(!current));
        applyToggle(key, className);
    };

    Object.entries(BTN_TO_KEY).forEach(([btnId, key]) => {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.addEventListener('click', () => toggleSetting(key, SETTINGS[key]));
        }
    });

    const setTheme = (theme) => {
        document.body.classList.remove('acc-theme-dark', 'acc-theme-mono');
        localStorage.removeItem('themeDark');
        localStorage.removeItem('themeMono');

        document.getElementById('btnThemeLight')?.setAttribute('aria-pressed', 'false');
        document.getElementById('btnThemeDark')?.setAttribute('aria-pressed', 'false');
        document.getElementById('btnThemeMono')?.setAttribute('aria-pressed', 'false');

        if (theme === 'dark') {
            document.body.classList.add('acc-theme-dark');
            localStorage.setItem('themeDark', 'true');
            document.getElementById('btnThemeDark')?.setAttribute('aria-pressed', 'true');
        } else if (theme === 'mono') {
            document.body.classList.add('acc-theme-mono');
            localStorage.setItem('themeMono', 'true');
            document.getElementById('btnThemeMono')?.setAttribute('aria-pressed', 'true');
        } else {
            document.getElementById('btnThemeLight')?.setAttribute('aria-pressed', 'true');
        }
    };

    document.getElementById('btnThemeLight')?.addEventListener('click', () => setTheme('light'));
    document.getElementById('btnThemeDark')?.addEventListener('click',  () => setTheme('dark'));
    document.getElementById('btnThemeMono')?.addEventListener('click',  () => setTheme('mono'));

    const sizeSteps = [100, 110, 125, 140];
    let currentSizeIdx = parseInt(localStorage.getItem('fontSizeIdx'), 10) || 0;
    if (currentSizeIdx < 0 || currentSizeIdx >= sizeSteps.length) currentSizeIdx = 0;

    const applyFontSize = () => {
        document.documentElement.style.fontSize = sizeSteps[currentSizeIdx] + '%';
        localStorage.setItem('fontSizeIdx', currentSizeIdx);
        const label = document.querySelector('#btnFontSize .acc-default-text');
        if (label) {
            label.textContent = currentSizeIdx === 0 ? 'по умолчанию' : sizeSteps[currentSizeIdx] + '%';
        }
    };

    const fontSizeBtn = document.getElementById('btnFontSize');
    if (fontSizeBtn) {
        fontSizeBtn.querySelector('.acc-plus')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSizeIdx < sizeSteps.length - 1) {
                currentSizeIdx++;
                applyFontSize();
            }
        });
        fontSizeBtn.querySelector('.acc-minus')?.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentSizeIdx > 0) {
                currentSizeIdx--;
                applyFontSize();
            }
        });
        fontSizeBtn.querySelector('.acc-default-text')?.addEventListener('click', (e) => {
            e.stopPropagation();
            currentSizeIdx = 0;
            applyFontSize();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            Object.keys(SETTINGS).forEach(k => localStorage.removeItem(k));
            localStorage.removeItem('themeDark');
            localStorage.removeItem('themeMono');
            localStorage.removeItem('fontSizeIdx');

            const keep = Array.from(document.body.classList).filter(c => !c.startsWith('acc-'));
            document.body.className = keep.join(' ');
            syncGuideListeners();

            document.documentElement.style.fontSize = '100%';
            currentSizeIdx = 0;

            document.querySelectorAll('.acc-btn').forEach(btn => {
                btn.setAttribute('aria-pressed', 'false');
            });
            document.getElementById('btnThemeLight')?.setAttribute('aria-pressed', 'true');
            applyFontSize();
        });
    }

    Object.entries(SETTINGS).forEach(([key, className]) => {
        applyToggle(key, className);
    });

    if (localStorage.getItem('themeDark') === 'true') {
        setTheme('dark');
    } else if (localStorage.getItem('themeMono') === 'true') {
        setTheme('mono');
    } else {
        setTheme('light');
    }

    applyFontSize();
});
