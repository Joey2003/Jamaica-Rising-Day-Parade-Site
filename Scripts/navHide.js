let navClicked = false;
let scrolled = false;
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        document.querySelector('.hider').classList.add('scrolled');
    });
});
window.addEventListener('wheel', (e) => {
    if (e.deltaY > 50) {
        document.querySelector('.hider').classList.add('scrolled');
    } else if (e.deltaY < -50) {
        document.querySelector('.hider').classList.remove('scrolled');
    }
}, { passive: true });

let startY = 0;

window.addEventListener('touchstart', (e) => {
    if (e.touches && e.touches.length) startY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchmove', (e) => {
    const y = e.touches[0].clientY;
    const deltaY = y - startY; // positive = finger moving down, page moving up
    if (deltaY < 0) {        // user swiped up -> page scrolls down
        document.querySelector('.hider').classList.add('scrolled');
    } else if (deltaY > 0) {
        document.querySelector('.hider').classList.remove('scrolled');
    }
}, { passive: true });