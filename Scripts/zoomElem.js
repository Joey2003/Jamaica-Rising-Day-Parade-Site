gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

// Helper to create a pinned + scrubbed zoom section
function makeZoom(section, scale, endPercent) {
    gsap.to(section, {
        scale,
        ease: "circ.in",
        scrollTrigger: {
            trigger: section,
            start: "top top",
            end: `+=${endPercent}`, // e.g. "+=300%"
            scrub: true,
            pin: true,
            toggleClass: { targets: section, className: "showing" }
            // markers: true
        }
    });
}

mm.add("(min-width: 768px)", () => {
    // Keep zooms centered
    gsap.set(["#one", "#two", "#three", "#four", "#video_01"], {
        transformOrigin: "50% 50%"
    });

    // Replicate your scenes
    makeZoom("#one", 100, "300%");
    makeZoom("#two", 100, "300%");
    makeZoom("#three", 100, "300%");
    makeZoom("#four", 6, "100%");

    // Bottom threshold toggle (replaces your scroll/bottomPoint code)
    const emailLink = document.querySelector("#four a");
    if (emailLink) {
        const computeBottomPoint = () =>
            document.documentElement.scrollHeight - window.innerHeight * 1.5;

        ScrollTrigger.create({
            start: () => computeBottomPoint(),
            end: () => computeBottomPoint() + 1, // acts like a switch
            onEnter: () => emailLink.classList.add("email-showing"),
            onLeaveBack: () => emailLink.classList.remove("email-showing")
        });

        // Keep threshold correct on resize/content shifts
        window.addEventListener("resize", () => ScrollTrigger.refresh());
    }
});

