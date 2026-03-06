const canvas = document.getElementById("car-canvas");
const context = canvas.getContext("2d");
const loader = document.getElementById("loader");
const progressFill = document.getElementById("progress");
const loadStatus = document.getElementById("load-status");

const frameCount = 240;
const currentFrame = index => (
    `frames/ezgif-frame-${index.toString().padStart(3, '0')}.jpg`
);

const images = [];
const car = {
    frame: 0
};


let loadedCount = 0;
for (let i = 1; i <= frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    img.onload = () => {
        loadedCount++;
        const progress = Math.round((loadedCount / frameCount) * 100);
        progressFill.style.width = `${progress}%`;
        loadStatus.innerText = `${progress}%`;

        if (loadedCount === frameCount) {
            setTimeout(() => {
                loader.style.opacity = "0";
                setTimeout(() => loader.style.display = "none", 500);
                render();
            }, 500);
        }
    };
    images.push(img);
}


function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    context.scale(dpr, dpr);
    render();
}

window.addEventListener('resize', resize);
resize();


function render() {
    const img = images[car.frame];
    if (!img) return;

    const w = window.innerWidth;
    const h = window.innerHeight;


    const drawWidth = img.width;
    const drawHeight = img.height;


    const offsetX = (w - drawWidth) / 2;
    const offsetY = (h - drawHeight) / 2;


    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';


    context.filter = 'contrast(1.05) brightness(1.02)';

    context.clearRect(0, 0, w, h);
    context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);


    context.filter = 'none';
}


const hudElements = {
    heading: document.getElementById("hud-heading"),
    desc: document.getElementById("hud-desc"),
    panels: document.querySelectorAll(".hud-panel")
};

const storyPoints = [
    {
        threshold: 0,
        heading: "PURE PERFORMANCE",
        desc: "Precision engineered for the circuit. Every line, every curve, optimized for velocity."
    },
    {
        threshold: 0.2,
        heading: "V8 DYNAMICS",
        desc: "A 4.0-litre twin-turbocharged V8 engine delivering over 500 bhp of raw, unfiltered power."
    },
    {
        threshold: 0.5,
        heading: "AERO EFFICIENCY",
        desc: "Advanced downforce package featuring a rear wing and front splitter for maximum grip in the corners."
    },
    {
        threshold: 0.8,
        heading: "RACING PEDIGREE",
        desc: "Built to dominate. The Vantage GT4 represents the pinnacle of Aston Martin's GT racing legacy."
    }
];

function updateHUD(progress) {
    let activePoint = storyPoints[0];
    for (const point of storyPoints) {
        if (progress >= point.threshold) {
            activePoint = point;
        }
    }

    if (hudElements.heading.innerText !== activePoint.heading) {
        hudElements.heading.style.opacity = "0";
        hudElements.desc.style.opacity = "0";

        setTimeout(() => {
            hudElements.heading.innerText = activePoint.heading;
            hudElements.desc.innerText = activePoint.desc;
            hudElements.heading.style.opacity = "1";
            hudElements.desc.style.opacity = "1";
        }, 300);
    }


    hudElements.panels.forEach((panel, index) => {
        if (progress > 0.05) {
            panel.classList.add("active");
        } else {
            panel.classList.remove("active");
        }
    });
}


const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("reveal");
        }
    });
}, observerOptions);

document.querySelectorAll(".section-container").forEach(container => {
    observer.observe(container);
});


window.addEventListener("scroll", () => {
    const sequenceSection = document.querySelector(".visual-sequence-section");
    const trigger = document.querySelector(".sequence-trigger");

    if (!sequenceSection || !trigger) return;

    const sectionRect = sequenceSection.getBoundingClientRect();
    const triggerRect = trigger.getBoundingClientRect();


    const start = window.pageYOffset + sectionRect.top;
    const end = window.pageYOffset + triggerRect.bottom - window.innerHeight;
    const current = window.pageYOffset;

    const scrollFraction = Math.max(0, Math.min(1, (current - start) / (end - start)));


    const hud = document.getElementById("hud");
    if (scrollFraction > 0.98 || current > end + 100) {
        hud.style.opacity = "0";
        hud.style.pointerEvents = "none";
    } else {
        hud.style.opacity = "1";
        hud.style.pointerEvents = "all";
    }


    const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
    );

    car.frame = frameIndex;
    requestAnimationFrame(render);
    updateHUD(scrollFraction);
});
