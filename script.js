const brainrots = [
  "🧌 Skibidi",
  "😈 Ohio Final Boss",
  "🤡 Fanum Tax",
  "👁️ Gyatt",
  "🐺 Alpha",
  "🔥 Rizzler",
  "💀 Nah Bro",
  "👹 Grimace Shake",
  "🦍 Sigma"
];

const voiceLines = [
  "brr brr skibidi gyatt",
  "nah bro what",
  "ohio moment",
  "GYATTT",
  "fanum taxed",
  "sigma detected",
  "brainrot overload"
];

const gameArea = document.getElementById("gameArea");
const spawnBtn = document.getElementById("spawnBtn");
const scoreText = document.getElementById("score");
const music = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
music.volume = 0.3;

let score = 0;
let brainrotSpeed = 1; // pixels per frame

// Start musikken på første klik
spawnBtn.onclick = function() {
  if (music.paused) music.play();
  spawnBrainrot();
};

function spawnBrainrot() {
  const brainrot = document.createElement("div");
  brainrot.className = "brainrot";

  const randomText = brainrots[Math.floor(Math.random() * brainrots.length)];
  brainrot.innerText = randomText;

  let x = Math.random() * (gameArea.clientWidth - 120);
  let y = Math.random() * (gameArea.clientHeight - 60);
  brainrot.style.left = x + "px";
  brainrot.style.top = y + "px";

  const isEvil = Math.random() < 0.05;
  if (isEvil) {
    brainrot.classList.add("evil");
    brainrot.innerText = "😈 EVIL " + randomText;
  }

  // Bevæg brainrot
  let dx = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random());
  let dy = (Math.random() < 0.5 ? -1 : 1) * (0.5 + Math.random());
  function move() {
    x += dx * brainrotSpeed;
    y += dy * brainrotSpeed;

    // Bounce off kanter
    if (x < 0 || x > gameArea.clientWidth - 120) dx *= -1;
    if (y < 0 || y > gameArea.clientHeight - 60) dy *= -1;

    brainrot.style.left = x + "px";
    brainrot.style.top = y + "px";

    requestAnimationFrame(move);
  }
  move();

  brainrot.onclick = function() {
    // Play click sound
    clickSound.currentTime = 0;
    clickSound.play();

    // Voice line on screen
    const voice = voiceLines[Math.floor(Math.random() * voiceLines.length)];
    const msg = document.createElement("div");
    msg.className = "voiceLine";
    msg.innerText = voice;
    msg.style.left = x + "px";
    msg.style.top = (y - 30) + "px";
    gameArea.appendChild(msg);
    setTimeout(() => msg.remove(), 1000);

    // Update score
    score += isEvil ? 10 : 5;
    scoreText.innerText = score;

    // Background color change based on score
    const colors = ["#ffffff", "#f0f8ff", "#ffe4e1", "#fafad2", "#d3ffce"];
    document.body.style.backgroundColor = colors[Math.floor(score / 10) % colors.length];

    // Remove brainrot
    brainrot.remove();
  };

  gameArea.appendChild(brainrot);
}
