
const artwork = document.querySelector(".hero-art");
const satellite = document.querySelector(".art-dot");

const canHover = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
).matches;

const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

if (artwork && satellite && canHover && !reducedMotion) {

    const duration = 9000;

    const orbit = satellite.animate([
        {
            transform: "translate(-50%, -50%) rotate(45deg) translateY(-350%) rotate(-45deg)"
        },
        {
            transform: "translate(-50%, -50%) rotate(405deg) translateY(-350%) rotate(-405deg)"
        }
    ], {
        duration: duration,
        iterations: Infinity,
        easing: "linear",
        fill: "both"
    });

    orbit.pause();

    artwork.addEventListener("pointerenter", () => {
        orbit.playbackRate = 1;
        orbit.play();
    });

    artwork.addEventListener("pointerleave", () => {
        orbit.currentTime = (orbit.currentTime ?? 0) % duration;
        orbit.playbackRate = -2;
        orbit.play();
    });

}
