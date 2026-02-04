const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const area = document.getElementById("area");
const modal = document.getElementById("modal");
const canvas = document.getElementById("confetti");
const ctx = canvas.getContext("2d");
let flag = 0;
function setflag() {
    flag = 1;
}
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* Sounds */
const moveSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-game-click-1114.mp3");
const winSound = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3");

/* Helpers */
function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
}

function center(el) {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}

/* Smart avoidance */
function moveNoSmart(cx, cy) {
    const areaRect = area.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const c = center(noBtn);

    const dx = c.x - cx;
    const dy = c.y - cy;
    const dist = Math.hypot(dx, dy);

    const DANGER_RADIUS = 120;

    if (dist < DANGER_RADIUS) {
        const escape = 260;

        let x = noBtn.offsetLeft + (dx / dist) * escape;
        let y = noBtn.offsetTop + (dy / dist) * escape;

        x = clamp(x, 0, areaRect.width - btnRect.width);
        y = clamp(y, 0, areaRect.height - btnRect.height);

        noBtn.style.left = x + "px";
        noBtn.style.top = y + "px";

        /* Smooth size illusion */
        noBtn.style.transform = "scale(0.6)";
        yesBtn.style.transform = "scale(1.25)";
        noBtn.style.background = "#6d6e7680";
        yesBtn.style.background = "#f07bd7a6";

        moveSound.currentTime = 0;
        moveSound.play().catch(() => { });
    }
}

/* Desktop */
area.addEventListener("mousemove", e => {
    moveNoSmart(e.clientX, e.clientY);
});

/* Mobile */
area.addEventListener("touchmove", e => {
    const t = e.touches[0];
    moveNoSmart(t.clientX, t.clientY);
});

/* Reset sizes */
area.addEventListener("mouseleave", resetButtons);
area.addEventListener("touchend", resetButtons);

function resetButtons() {
    noBtn.style.transform = "scale(1)";
    yesBtn.style.transform = "scale(1)";
    noBtn.style.background = "#6d6e76";
    yesBtn.style.background = "#f07bd7";
}

function hoverYes() {
    yesBtn.style.transform = "scale(1)";
    yesBtn.style.background = "#f07bd7";
}

/* Confetti */
let particles = [];
function launchConfetti() {
    particles = Array.from({ length: 140 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 5 + 3,
        dx: Math.random() * 3 - 1.5,
        dy: Math.random() * 4 + 2,
        c: `hsl(${Math.random() * 360},100%,50%)`
    }));
    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
    });
    requestAnimationFrame(animate);
}

/* Yes click */
const imgContainer = document.getElementById("successImg");

noBtn.addEventListener("click", () => {
    if(flag === 0) {
    modal.style.display = "flex";
    imgContainer.src = "/imgs/img2" + ".jpg";
    winSound.play().catch(() => { });
    launchConfetti();
    }
});

yesBtn.addEventListener("click", () => {
    modal.style.display = "flex";
    winSound.play().catch(() => { });
    launchConfetti();
});

yesBtn.addEventListener("pointerenter", () => {
    yesBtn.style.transform = "scale(1)";
    yesBtn.style.background = "#ff9de2";
});

yesBtn.addEventListener("pointerleave", () => {
    yesBtn.style.transform = "scale(1)";
    yesBtn.style.background = "#f07bd7";
});

const images = ["0", "0", "0"];
const randomIndex = Math.floor(Math.random() * images.length);
imgContainer.src = "/imgs/img" + images[randomIndex] + ".jpg";