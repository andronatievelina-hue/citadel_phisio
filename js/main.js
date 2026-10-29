/**
 * Общая логика сайта — меню-бургер
 */
document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const dropdownMenu = document.getElementById('dropdownMenu');

    if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('active');
            menuBtn.setAttribute('aria-expanded', dropdownMenu.classList.contains('active'));
        });

        document.addEventListener('click', (e) => {
            if (!dropdownMenu.contains(e.target) && e.target !== menuBtn && !menuBtn.contains(e.target)) {
                dropdownMenu.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && dropdownMenu.classList.contains('active')) {
                dropdownMenu.classList.remove('active');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }
});

/* --- Scroll reveal + soft hero parallax --- */
document.addEventListener('DOMContentLoaded', () => {
    // Reveal on scroll
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

        reveals.forEach((el) => io.observe(el));
    } else {
        reveals.forEach((el) => el.classList.add('is-visible'));
    }

    // Soft parallax on hero content
    const hero = document.querySelector('.hero');
    const heroInner = document.querySelector('.hero .hero-container');
    if (hero && heroInner && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        let ticking = false;
        const onScroll = () => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const rect = hero.getBoundingClientRect();
                const progress = Math.min(1, Math.max(0, -rect.top / (rect.height || 1)));
                heroInner.style.transform = `translateY(${progress * 40}px)`;
                ticking = false;
            });
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }
});
