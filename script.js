const brainrots = ["🧌 Skibidi","😈 Ohio","🤡 Fanum","👁️ Gyatt","🐺 Alpha","🔥 Rizzler","💀 Nah","👹 Grimace","🦍 Sigma"];
const voiceLines = ["brr brr skibidi","GYATT","nah bro","fanum taxed","sigma moment"];

const gameArea = document.getElementById("gameArea");
const scoreText = document.getElementById("score");
const timerText = document.getElementById("timer");
const music = document.getElementById("bgMusic");
const clickSound = document.getElementById("clickSound");
const gameOverScreen = document.getElementById("gameOver");
const restartBtn = document.getElementById("restartBtn");

let score = 0;
let spawnInterval = 2000;
let spawnTimer;
let countdown = 10;
let countdownTimer = null;
let activeBrainrots = [];

// Musik starter ved første klik på siden
document.body.addEventListener("click", () => {
  if(music.paused) music.play();
},{once:true});

// Spawn loop
function startSpawning(){
  spawnTimer = setInterval(()=>{
    spawnBrainrot();
    if(spawnInterval > 400){
      spawnInterval -= 20;
      clearInterval(spawnTimer);
      startSpawning();
    }
  }, spawnInterval);
}

function spawnBrainrot(){
  const b = document.createElement("div");
  b.className = "brainrot";

  const txt = brainrots[Math.floor(Math.random()*brainrots.length)];
  b.innerText = txt;

  let x = Math.random()*(gameArea.clientWidth-120);
  let y = Math.random()*(gameArea.clientHeight-60);
  b.style.left = x+"px";
  b.style.top = y+"px";

  const isEvil = Math.random()<0.05;
  if(isEvil){
    b.classList.add("evil");
    b.innerText = "😈 EVIL "+txt;
  }

  let dx=(Math.random()<0.5?-1:1)*(1+Math.random());
  let dy=(Math.random()<0.5?-1:1)*(1+Math.random());
  let rot=0;

  function move(){
    x+=dx; y+=dy; rot+=dx*2;
    if(x<0||x>gameArea.clientWidth-120) dx*=-1;
    if(y<0||y>gameArea.clientHeight-60) dy*=-1;
    b.style.left=x+"px";
    b.style.top=y+"px";
    b.style.transform=`rotate(${rot}deg)`;
    requestAnimationFrame(move);
  }
  move();

  b.onclick=function(){
    clickSound.currentTime=0;
    clickSound.play();

    const v=document.createElement("div");
    v.className="voiceLine";
    v.innerText=voiceLines[Math.floor(Math.random()*voiceLines.length)];
    v.style.left=x+"px";
    v.style.top=(y-25)+"px";
    gameArea.appendChild(v);
    setTimeout(()=>v.remove(),1000);

    score+=isEvil?10:5;
    scoreText.innerText=score;

    b.remove();
    activeBrainrots=activeBrainrots.filter(o=>o!==b);

    if(activeBrainrots.length<=3) stopCountdown();
  };

  gameArea.appendChild(b);
  activeBrainrots.push(b);

  if(activeBrainrots.length>3 && countdownTimer==null){
    startCountdown();
  }
}

function startCountdown(){
  countdown=10;
  timerText.innerText="Timer: "+countdown;
  countdownTimer=setInterval(()=>{
    countdown--;
    timerText.innerText="Timer: "+countdown;
    if(countdown<=0) endGame();
  },1000);
}

function stopCountdown(){
  clearInterval(countdownTimer);
  countdownTimer=null;
  timerText.innerText="Timer: --";
}

function endGame(){
  clearInterval(spawnTimer);
  stopCountdown();
  gameOverScreen.style.display="flex";
}

restartBtn.onclick=function(){
  gameOverScreen.style.display="none";
  activeBrainrots.forEach(b=>b.remove());
  activeBrainrots=[];
  score=0;
  scoreText.innerText=score;
  spawnInterval=2000;
  startSpawning();
}

startSpawning();
