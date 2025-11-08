(function () {
    const openBtn = document.getElementById('hamburgerBtn');    // external opener
    const overlay = document.getElementById('menuOverlay');     // the dark backdrop
    const drawer = document.getElementById('mainMenu');        // the sliding panel
    const closeBtn = document.getElementById('menuToggleBtn');   // internal closer
    const nav = document.querySelector('.nav');

    if (!overlay || !drawer) {
        console.warn('[menu] Missing #menuOverlay or #mainMenu');
        return;
    }

    // --- internals ---
    function enableBodyLock() {
        document.body.classList.add('body-locked');
        if (nav) nav.classList.remove('hider');
    }
    function disableBodyLock() {
        document.body.classList.remove('body-locked');
        if (nav) nav.classList.add('hider');
    }

    function reallyHide() {
        overlay.hidden = true;
        disableBodyLock();
        overlay.removeAttribute('data-hiding');
    }

    function showMenu() {
        overlay.hidden = false;
        // force reflow so the transition applies after class add
        void overlay.offsetHeight;
        overlay.classList.add('open');
        overlay.setAttribute('aria-hidden', 'false');
        openBtn?.setAttribute('aria-expanded', 'true');
        enableBodyLock();

        // focus first item
        const first = drawer.querySelector('[role="menuitem"], a, button');
        first?.focus({ preventScroll: true });
    }

    function hideMenu() {
        // If already hidden or in the middle of hiding, ignore
        if (overlay.hidden || overlay.getAttribute('data-hiding') === '1') return;
        overlay.setAttribute('data-hiding', '1');

        overlay.classList.remove('open');
        overlay.setAttribute('aria-hidden', 'true');
        openBtn?.setAttribute('aria-expanded', 'false');

        // If there's a transition, wait for it; otherwise, fallback in 300ms
        let done = false;
        const onEnd = (e) => {
            if (done) return;
            // Only finalize when the opacity transition ends (avoid child transitions)
            if (e.target === overlay && (e.propertyName === 'opacity' || e.propertyName === '')) {
                done = true;
                overlay.removeEventListener('transitionend', onEnd);
                reallyHide();
                openBtn?.focus({ preventScroll: true });
            }
        };
        overlay.addEventListener('transitionend', onEnd);

        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
            if (!done) {
                overlay.removeEventListener('transitionend', onEnd);
                reallyHide();
            }
        }, 300);
    }

    

    // --- wire up events ---
    openBtn?.addEventListener('click', showMenu);
    closeBtn?.addEventListener('click', hideMenu);

    // Click on the backdrop closes (but clicks inside the drawer do not)
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) hideMenu();
    });

    // document.querySelector('#contact-information').addEventListener('click', (e) => {
    //     hideMenu();
    // });

    // Esc to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !overlay.hidden) hideMenu();
    });

    // Expose globally so inline HTML can call them
    window.showMenu = showMenu;
    window.hideMenu = hideMenu;
})();
