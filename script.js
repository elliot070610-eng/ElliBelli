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
let brainrotSpeed = 1;

// Start musikken ved første klik
spawnBtn.onclick = function() {
  if (music.paused) music.play();
  spawnBrainrot();
};

// Spawn Brainrot
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
  let rotation = 0;
  function move() {
    x += dx * brainrotSpeed;
    y += dy * brainrotSpeed;
    rotation += dx * 2; // roter brainrot

    // Evil AI: jag musen
    if (isEvil) {
      const mouseX = gameArea.mouseX || x;
      const mouseY = gameArea.mouseY || y;
      dx += (mouseX - x) * 0.01;
      dy += (mouseY - y) * 0.01;
    }

    // Bounce off kanter
    if (x < 0 || x > gameArea.clientWidth - 120) dx *= -1;
    if (y < 0 || y > gameArea.clientHeight - 60) dy *= -1;

    brainrot.style.left = x + "px";
    brainrot.style.top = y + "px";
    brainrot.style.transform = `rotate(${rotation}deg)`;

    requestAnimationFrame(move);
  }
  move();

  // Klik på brainrot
  brainrot.onclick = function() {
    // Play click lyd
    clickSound.currentTime = 0;
    clickSound.play();

    // Voice line på skærmen
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

    // Baggrund farve
    const colors = ["#ffffff","#f0f8ff","#ffe4e1","#fafad2","#d3ffce","#ffe0f0","#f0ffe0"];
    document.body.style.backgroundColor = colors[Math.floor(score/10) % colors.length];

    // Multiplying brainrots
    if (Math.random() < 0.2 && !isEvil) { // 20% chance
      for (let i=0;i<2;i++) spawnBrainrot();
    }

    // Boss brainrot spawn
    if (score % 50 === 0 && score !== 0) spawnBoss();

    // Remove clicked brainrot
    brainrot.remove();
  };

  gameArea.appendChild(brainrot);
}

// Track mus position for evil AI
gameArea.addEventListener("mousemove", e => {
  gameArea.mouseX = e.offsetX;
  gameArea.mouseY = e.offsetY;
});

// Boss brainrot
function spawnBoss() {
  const boss = document.createElement("div");
  boss.className = "brainrot evil";
  boss.style.fontSize = "60px";
  boss.innerText = "👹 BOSS";
  boss.style.left = Math.random()*(gameArea.clientWidth-120) + "px";
  boss.style.top = Math.random()*(gameArea.clientHeight-60) + "px";

  let dx = (Math.random()<0.5?-1:1)*(1+Math.random());
  let dy = (Math.random()<0.5?-1:1)*(1+Math.random());
  let rotation = 0;

  function move() {
    let x = parseFloat(boss.style.left);
    let y = parseFloat(boss.style.top);
    x += dx;
    y += dy;
    rotation += dx*2;

    if(x<0||x>gameArea.clientWidth-120) dx*=-1;
    if(y<0||y>gameArea.clientHeight-60) dy*=-1;

    boss.style.left = x+"px";
    boss.style.top = y+"px";
    boss.style.transform = `rotate(${rotation}deg)`;
    requestAnimationFrame(move);
  }
  move();

  boss.onclick = function() {
    clickSound.currentTime=0;
    clickSound.play();
    score += 50;
    scoreText.innerText=score;
    boss.remove();
    document.body.style.backgroundColor = "#ff69b4"; // boss flash
  }

  gameArea.appendChild(boss);
}
