export function initAnimations() {
  gsap.registerPlugin(ScrollTrigger);

  // Intro sequence (boot-up feel)
  const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
  intro
    .from("#hero h1", { y: 36, opacity: 0, duration: 1.1 })
    .from("#typewriter", { opacity: 0, filter: "blur(8px)", duration: 0.8 }, "-=0.5")
    .from(".btn-neon, .btn-ghost", {
      y: 12,
      opacity: 0,
      stagger: 0.12,
      duration: 0.65
    }, "-=0.35")
    .from("#automican-core-canvas", {
      opacity: 0,
      scale: 0.9,
      duration: 1.2
    }, "-=1.0");

  // Glitch-style reveal for sections
  gsap.utils.toArray(".section-reveal").forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 45,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });

    gsap.from(section.querySelector(".section-title"), {
      textShadow: "0 0 18px rgba(0,242,255,0.9)",
      duration: 0.45,
      repeat: 1,
      yoyo: true,
      scrollTrigger: {
        trigger: section,
        start: "top 80%"
      }
    });
  });
}
