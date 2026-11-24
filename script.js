/**
 * Doğu - Kişisel Web Sitesi JavaScript
 * - Menü bağlantılarını ilgili bölüme yumuşakça kaydırır
 * - Aktif gezinme bağlantısını takip eder
 * - Hareketi azaltmayı seçen kullanıcılarda geçiş animasyonlarını devre dışı bırakır
 */

document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section[id]');
    const header = document.querySelector('.site-header');

    // Yumuşak kaydırma ve menü tıklaması
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href.startsWith('#')) return;

            e.preventDefault();
            const targetSection = document.querySelector(href);

            if (targetSection) {
                const headerHeight = header ? header.offsetHeight : 0;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - (headerHeight + 16);

                window.scrollTo({
                    top: offsetPosition,
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });

                // URL hash güncellemesi
                if (history.pushState) {
                    history.pushState(null, null, href);
                } else {
                    location.hash = href;
                }
            }
        });
    });

    // Kaydırma sırasında aktif menü bağlantısını güncelleme
    function updateActiveLink() {
        const scrollPosition = window.pageYOffset + (header ? header.offsetHeight : 0) + 50;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('aktif');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('aktif');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
});
