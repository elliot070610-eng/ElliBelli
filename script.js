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
const scoreText = document.getElementById("score");
const music = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

music.volume = 0.3;

let score = 0;
let brainrotSpeed = 1;
let spawnInterval = 2000; // starter 2 sek
let spawnTimer;
let countdownTimer;
let countdown = 10;
let activeBrainrots = [];

music.play(); // start musik automatisk

// Spawn brainrots automatisk
function startSpawning() {
  spawnTimer = setInterval(() => {
    spawnBrainrot();
    // Accelerer spawn rate
    if (spawnInterval > 300) {
      spawnInterval -= 20;
      clearInterval(spawnTimer);
      startSpawning();
    }
  }, spawnInterval);
}

// Brainrot spawn funktion
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
    rotation += dx * 2;

    if(x<0||x>gameArea.clientWidth-120) dx*=-1;
    if(y<0||y>gameArea.clientHeight-60) dy*=-1;

    brainrot.style.left = x+"px";
    brainrot.style.top = y+"px";
    brainrot.style.transform = `rotate(${rotation}deg)`;

    requestAnimationFrame(move);
  }
  move();

  // klik brainrot
  brainrot.onclick = function() {
    clickSound.currentTime=0;
    clickSound.play();

    const voice = voiceLines[Math.floor(Math.random()*voiceLines.length)];
    const msg = document.createElement("div");
    msg.className = "voiceLine";
    msg.innerText = voice;
    msg.style.left = x+"px";
    msg.style.top = (y-30)+"px";
    gameArea.appendChild(msg);
    setTimeout(()=>msg.remove(),1000);

    score += isEvil?10:5;
    scoreText.innerText = score;

    // Baggrunds farver
    const colors=["#ffffff","#f0f8ff","#ffe4e1","#fafad2","#d3ffce","#ffe0f0","#f0ffe0"];
    document.body.style.backgroundColor = colors[Math.floor(score/10)%colors.length];

    // Fjern brainrot og fra active liste
    brainrot.remove();
    activeBrainrots = activeBrainrots.filter(b=>b!==brainrot);

    // Stop countdown hvis alle brainrots er væk
    if(activeBrainrots.length===0) stopCountdown();
  };

  gameArea.appendChild(brainrot);
  activeBrainrots.push(brainrot);

  // Hvis der er brainrots på skærmen, start countdown
  if(countdownTimer==null) startCountdown();
}

// Countdown hvis brainrots ikke bliver klikket
function startCountdown() {
  countdown = 10;
  countdownTimer = setInterval(()=>{
    countdown--;
    if(countdown<=0){
      endGame();
    }
  },1000);
}

function stopCountdown() {
  clearInterval(countdownTimer);
  countdownTimer=null;
}

// Game over
function endGame() {
  clearInterval(spawnTimer);
  stopCountdown();
  gameOverScreen.style.display="flex";
}

// Restart
restartBtn.onclick = function(){
  gameOverScreen.style.display="none";
  activeBrainrots.forEach(b=>b.remove());
  activeBrainrots=[];
  score=0;
  scoreText.innerText=score;
  spawnInterval=2000;
  brainrotSpeed=1;
  startSpawning();
}

startSpawning();
