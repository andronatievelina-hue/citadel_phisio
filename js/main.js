document.addEventListener('DOMContentLoaded', () => {
    // --- Меню ---
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');
    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && e.target !== menuBtn) {
                dropdownMenu.classList.remove('active');
            }
        });
    }

    // --- Панель доступности ---
    const accBtn = document.getElementById('accessibilityBtn');
    const accModal = document.getElementById('accessibilityModal');
    const closeBtn = document.getElementById('closeModal');
    const resetBtn = document.getElementById('resetAll');

    if (accBtn && accModal) {
        // Открытие/закрытие
        accBtn.addEventListener('click', () => accModal.classList.add('active'));
        closeBtn.addEventListener('click', () => accModal.classList.remove('active'));
        accModal.addEventListener('click', (e) => {
            if (e.target === accModal) accModal.classList.remove('active');
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && accModal.classList.contains('active')) {
                accModal.classList.remove('active');
            }
        });

        // Функция применения настроек
        const applySetting = (key, className, element = document.body) => {
            const isEnabled = localStorage.getItem(key) === 'true';
            if (isEnabled) {
                element.classList.add(className);
                const btn = document.getElementById(btnMap[key]);
                if (btn) btn.setAttribute('aria-pressed', 'true');
            } else {
                element.classList.remove(className);
                const btn = document.getElementById(btnMap[key]);
                if (btn) btn.setAttribute('aria-pressed', 'false');
            }
        };

        const btnMap = {
            readableFont: 'btnFontFamily',
            bigCursor: 'btnBigCursor',
            lineHeight: 'btnLineHeight',
            letterSpacing: 'btnLetterSpacing',
            textAlign: 'btnTextAlign',
            fontWeight: 'btnFontWeight',
            themeDark: 'btnThemeDark',
            themeMono: 'btnThemeMono',
            readableLine: 'btnReadableLine',
            readableMask: 'btnReadableMask',
            hideImages: 'btnHideImages',
            highlightContent: 'btnHighlightContent',
            stopAnimation: 'btnStopAnimation',
            highlightLinks: 'btnHighlightLinks'
        };

        const toggleSetting = (key, className) => {
            const current = localStorage.getItem(key) === 'true';
            localStorage.setItem(key, !current);
            applySetting(key, className);
        };

        // Навешиваем обработчики на кнопки
        document.getElementById('btnFontFamily').onclick = () => toggleSetting('readableFont', 'acc-readable-font');
        document.getElementById('btnBigCursor').onclick = () => toggleSetting('bigCursor', 'acc-big-cursor');
        document.getElementById('btnLineHeight').onclick = () => toggleSetting('lineHeight', 'acc-line-height');
        document.getElementById('btnLetterSpacing').onclick = () => toggleSetting('letterSpacing', 'acc-letter-spacing');
        document.getElementById('btnTextAlign').onclick = () => toggleSetting('textAlign', 'acc-text-align');
        document.getElementById('btnFontWeight').onclick = () => toggleSetting('fontWeight', 'acc-font-weight');
        
        // Темы
        const resetThemes = () => {
            document.body.classList.remove('acc-theme-dark', 'acc-theme-mono');
            localStorage.removeItem('themeDark');
            localStorage.removeItem('themeMono');
            document.getElementById('btnThemeDark').setAttribute('aria-pressed', 'false');
            document.getElementById('btnThemeMono').setAttribute('aria-pressed', 'false');
            document.getElementById('btnThemeLight').setAttribute('aria-pressed', 'true');
        };

        document.getElementById('btnThemeLight').onclick = resetThemes;
        document.getElementById('btnThemeDark').onclick = () => {
            resetThemes();
            document.body.classList.add('acc-theme-dark');
            localStorage.setItem('themeDark', 'true');
            document.getElementById('btnThemeDark').setAttribute('aria-pressed', 'true');
        };
        document.getElementById('btnThemeMono').onclick = () => {
            resetThemes();
            document.body.classList.add('acc-theme-mono');
            localStorage.setItem('themeMono', 'true');
            document.getElementById('btnThemeMono').setAttribute('aria-pressed', 'true');
        };

        // Ориентация
        document.getElementById('btnReadableLine').onclick = () => toggleSetting('readableLine', 'acc-readable-line');
        document.getElementById('btnHideImages').onclick = () => toggleSetting('hideImages', 'acc-hide-images');
        document.getElementById('btnHighlightContent').onclick = () => toggleSetting('highlightContent', 'acc-highlight-content');
        document.getElementById('btnStopAnimation').onclick = () => toggleSetting('stopAnimation', 'acc-stop-animation');
        document.getElementById('btnHighlightLinks').onclick = () => toggleSetting('highlightLinks', 'acc-highlight-links');

        // Размер шрифта (отдельная логика)
        const fontSizeBtn = document.getElementById('btnFontSize');
        const sizeSteps = [100, 110, 125, 140];
        let currentSizeIdx = parseInt(localStorage.getItem('fontSizeIdx')) || 0;

        const applyFontSize = () => {
            document.documentElement.style.fontSize = `${sizeSteps[currentSizeIdx]}%`;
            localStorage.setItem('fontSizeIdx', currentSizeIdx);
        };

        fontSizeBtn.querySelector('.acc-plus').onclick = (e) => {
            e.stopPropagation();
            if (currentSizeIdx < sizeSteps.length - 1) {
                currentSizeIdx++;
                applyFontSize();
            }
        };
        fontSizeBtn.querySelector('.acc-minus').onclick = (e) => {
            e.stopPropagation();
            if (currentSizeIdx > 0) {
                currentSizeIdx--;
                applyFontSize();
            }
        };
        fontSizeBtn.querySelector('.acc-default').onclick = (e) => {
            e.stopPropagation();
            currentSizeIdx = 0;
            applyFontSize();
        };

        // Сброс
        resetBtn.onclick = () => {
            localStorage.clear();
            document.body.className = document.body.className.replace(/acc-[\w-]+/g, '');
            document.documentElement.style.fontSize = '100%';
            document.querySelectorAll('.acc-btn').forEach(btn => btn.setAttribute('aria-pressed', 'false'));
            document.getElementById('btnThemeLight').setAttribute('aria-pressed', 'true');
            currentSizeIdx = 0;
        };

        // Инициализация при загрузке
        Object.keys(btnMap).forEach(key => {
            const isActive = localStorage.getItem(key) === 'true';
            if (isActive) applySetting(key, btnMap[key].replace('btn', '').toLowerCase().replace('fontfamily', 'readable-font'));
        });
        applyFontSize();
        
        // Восстановление тем
        if (localStorage.getItem('themeDark') === 'true') document.body.classList.add('acc-theme-dark');
        if (localStorage.getItem('themeMono') === 'true') document.body.classList.add('acc-theme-mono');
    }
});