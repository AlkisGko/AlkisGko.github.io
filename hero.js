
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

/* Copy contact email */

const copyEmailButton = document.querySelector(".contact-copy-email");
const copyFeedback = document.querySelector(".copy-feedback");

if (copyEmailButton && copyFeedback) {
    copyEmailButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(
                copyEmailButton.dataset.email
            );

            copyFeedback.textContent = "Copied!";
        } catch {
            copyFeedback.textContent = "Copy unavailable";
        }
    });
}

/* Geometric celebration for CV downloads */

const cvSelector = document.querySelector(".cv-selector");

if (cvSelector) {

    const cvSummary = cvSelector.querySelector("summary");
    const downloadIcon = cvSummary.querySelector("svg");

    const particleColors = [
        "#A18A6C", // Antique gold
        "#23696B", // Teal
        "#701222", // Burgundy
        "#081B1B"  // Deep ink
    ];

    function celebrateDownload() {

        // Respect reduced-motion preferences
        if (window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches) {
            return;
        }

        // Animate the download icon
        downloadIcon.animate([
            { transform: "translateY(0)" },
            { transform: "translateY(5px)" },
            { transform: "translateY(-3px)" },
            { transform: "translateY(0)" }
        ], {
            duration: 800,
            easing: "ease-out"
        });

        // Find the icon's screen position
        const rect = downloadIcon.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Create 12 triangular particles
        for (let i = 0; i < 12; i++) {

            const particle = document.createElement("span");

            particle.className = "cv-particle";
            particle.setAttribute("aria-hidden", "true");

            particle.style.backgroundColor =
                particleColors[i % particleColors.length];

            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;

            document.body.appendChild(particle);

            // Spread particles in different directions
            const angle = (i / 12) * Math.PI * 2;
            const distance = 35 + (i % 3) * 14;

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            const rotation = i % 2 === 0 ? 180 : -180;

            const animation = particle.animate([
                {
                    transform:
                        "translate(-50%, -50%) rotate(0deg) scale(0.8)",
                    opacity: 1
                },
                {
                    transform:
                        `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg) scale(0.3)`,
                    opacity: 0
                }
            ], {
                duration: 1100,
                easing: "cubic-bezier(0.2, 0.8, 0.3, 1)",
                fill: "forwards"
            });

            // Remove each particle after its animation
            animation.addEventListener("finish", () => {
                particle.remove();
            }, { once: true });
        }
    }

    // Trigger on either CV selection
    cvSelector.querySelectorAll(".cv-option").forEach(link => {

        link.addEventListener("click", () => {

            celebrateDownload();

            // Close the dropdown without interrupting download
            requestAnimationFrame(() => {
                cvSelector.open = false;
                cvSummary.focus({ preventScroll: true });
            });

        });

    });
}

/* Track CV download selections */

const trackingEndpoint =
    "https://script.google.com/macros/s/AKfycbxyGHeYjCj323C_75iuaUISS7fXwGldl03xL89GgdsXLoPQvJaPAiuIUxn6RGQ-hsjS/exec";

document.querySelectorAll(".cv-option").forEach(link => {

    link.addEventListener("click", () => {

        const cvType = link.dataset.cv;

        if (!["crm", "analytics"].includes(cvType)) {
            return;
        }

        const eventData = new URLSearchParams({
            event_name: "cv_download_click",
            cv_type: cvType,
            source: "hero"
        });

        navigator.sendBeacon(trackingEndpoint, eventData);

    });

});
