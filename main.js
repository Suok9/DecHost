/* =====================
   AUDIO (PLAY ONCE)
===================== */
const music = document.getElementById("music");
let played = false;

/* =====================
   CANVAS SETUP
===================== */
const canvas = document.getElementById("effects");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let particles = [];
let confettiActive = false;

/* =====================
   HELPERS
===================== */
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

/* =====================
   FIREWORKS
===================== */
function firework(x, y) {
  for (let i = 0; i < 120; i++) {
    particles.push({
      x,
      y,
      vx: rand(-6, 6),
      vy: rand(-6, 6),
      life: 80,
      size: 3,
      color: `hsl(${rand(0, 360)}, 100%, 60%)`
    });
  }
}

/* =====================
   CONTINUOUS CONFETTI
===================== */
function spawnConfetti() {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: rand(0, canvas.width),
      y: -10,
      vx: rand(-1.5, 1.5),
      vy: rand(2, 5),
      life: 9999,
      size: rand(3, 6),
      color: `hsl(${rand(0, 360)}, 100%, 50%)`
    });
  }
}

/* =====================
   ANIMATION LOOP
===================== */
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (confettiActive) spawnConfetti();

  particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;

    ctx.fillStyle = p.color;
    ctx.fillRect(p.x, p.y, p.size, p.size);

    if (p.y > canvas.height) {
      p.y = -10;
      p.x = rand(0, canvas.width);
    }

    if (p.life-- <= 0) particles.splice(i, 1);
  });

  requestAnimationFrame(animate);
}
animate();

/* =====================
   GIFT BOX CLICK
===================== */
document.getElementById("box").addEventListener("click", () => {
  if (!played) {
    music.currentTime = 0;
    music.play().catch(() => {});
    played = true;
  }

  document.body.classList.add("open");
  document.getElementById("message").style.opacity = 1;

  confettiActive = true;

  for (let i = 0; i < 6; i++) {
    firework(
      rand(200, canvas.width - 200),
      rand(100, 400)
    );
  }
});