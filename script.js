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
music.volume = 0.3; // lower volume


let score = 0;


spawnBtn.onclick = spawnBrainrot;


function spawnBrainrot() {
  const brainrot = document.createElement("div");
  brainrot.className = "brainrot";


  const randomText = brainrots[Math.floor(Math.random() * brainrots.length)];
  brainrot.innerText = randomText;


  // random position
  const x = Math.random() * (gameArea.clientWidth - 120);
  const y = Math.random() * (gameArea.clientHeight - 60);
  brainrot.style.left = x + "px";
  brainrot.style.top = y + "px";


  // 5% chance evil
  const isEvil = Math.random() < 0.05;
  if (isEvil) {
    brainrot.classList.add("evil");
    brainrot.innerText = "😈 EVIL " + randomText;
  }


  brainrot.onclick = function() {
    // show voice line on screen
    const voice = voiceLines[Math.floor(Math.random() * voiceLines.length)];
    const msg = document.createElement("div");
    msg.className = "voiceLine";
    msg.innerText = voice;
    msg.style.left = brainrot.style.left;
    msg.style.top = (parseInt(brainrot.style.top) - 30) + "px";
    gameArea.appendChild(msg);


    setTimeout(() => msg.remove(), 1000); // remove after 1s


    // update score
    score += isEvil ? 10 : 5;
    scoreText.innerText = score;


    // remove brainrot
    brainrot.remove();
  };


  gameArea.appendChild(brainrot);
}