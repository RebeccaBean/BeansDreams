document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("confettiCanvas");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confettiCount = 150;
  const confetti = [];

  for (let i = 0; i < confettiCount; i++) {
    confetti.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 4,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`,
      tilt: Math.floor(Math.random() * 10) - 5,
      tiltAngle: 0,
      tiltAngleIncrement: Math.random() * 0.07 + 0.05
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(p => {
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color;
      ctx.moveTo(p.x + p.tilt, p.y);
      ctx.lineTo(p.x, p.y + p.tilt + p.r);
      ctx.stroke();
    });
    updateConfetti();
  }

  function updateConfetti() {
    confetti.forEach(p => {
      p.tiltAngle += p.tiltAngleIncrement;
      p.y += 2;
      p.x += Math.sin(p.tiltAngle) * 2;
      p.tilt = Math.sin(p.tiltAngle) * 15;

      if (p.y > canvas.height) {
        p.y = -10;
        p.x = Math.random() * canvas.width;
      }
    });
  }

  let animationFrame;
  function animateConfetti() {
    drawConfetti();
    animationFrame = requestAnimationFrame(animateConfetti);
  }

  animateConfetti();

  // Stop after 5 seconds
  setTimeout(() => {
    cancelAnimationFrame(animationFrame);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.remove();
  }, 5000);

  // Optional: resize canvas on window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
});
