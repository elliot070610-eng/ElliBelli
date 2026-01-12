import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

// 🔥 Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD4a5ennKqkdpq2b-pHp5zVySk7XKq_pBM",
  authDomain: "ellibelligame.firebaseapp.com",
  databaseURL: "https://ellibelligame-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ellibelligame",
  storageBucket: "ellibelligame.firebasestorage.app",
  messagingSenderId: "90652680256",
  appId: "1:90652680256:web:64d24715523b3601567fa5"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// UI
const gameArea=document.getElementById("gameArea");
const scoreText=document.getElementById("score");
const leaderboardBtn=document.getElementById("leaderboardBtn");
const leaderboard=document.getElementById("leaderboard");
const leaderList=document.getElementById("leaderList");
const closeLB=document.getElementById("closeLB");
const gameOver=document.getElementById("gameOver");
const restartBtn=document.getElementById("restartBtn");

const nameScreen=document.getElementById("nameScreen");
const gameUI=document.getElementById("gameUI");
const startBtn=document.getElementById("startBtn");
const nameInput=document.getElementById("playerNameInput");

const music=document.getElementById("bgMusic");
const clickSound=document.getElementById("clickSound");

let score=0;
let playerName="";

startBtn.onclick=()=>{
  if(nameInput.value.trim()=="") return;
  playerName=nameInput.value;
  nameScreen.style.display="none";
  gameUI.style.display="block";
  music.play();
  startGame();
};

function startGame(){
  setInterval(spawnBrainrot,1000);
  setTimeout(endGame,30000);
}

function spawnBrainrot(){
  let b=document.createElement("div");
  let boss=Math.random()<0.05;
  b.className=boss?"brainrot boss":"brainrot";
  b.innerText=boss?"👹":"🧠";

  let x=Math.random()*(gameArea.clientWidth-80);
  let y=Math.random()*(gameArea.clientHeight-80);
  b.style.left=x+"px";
  b.style.top=y+"px";

  b.onclick=()=>{
    clickSound.currentTime=0;
    clickSound.play();
    score+=boss?50:5;
    scoreText.innerText=score;

    spawnParticles(x+20,y+20, boss?20:10);
    if(boss) screenshake();

    b.remove();
  };

  gameArea.appendChild(b);
}

// 🎇 Particles
function spawnParticles(x,y,count){
  for(let i=0;i<count;i++){
    let p=document.createElement("div");
    p.className="particle";
    p.style.left=x+"px";
    p.style.top=y+"px";
    p.style.background=`hsl(${Math.random()*360},100%,50%)`;
    gameArea.appendChild(p);

    let angle=Math.random()*2*Math.PI;
    let speed=Math.random()*5+2;
    let vx=Math.cos(angle)*speed;
    let vy=Math.sin(angle)*speed;

    let lifetime=0;
    let interval=setInterval(()=>{
      lifetime++;
      p.style.left=(parseFloat(p.style.left)+vx)+"px";
      p.style.top=(parseFloat(p.style.top)+vy)+"px";
      if(lifetime>20){
        clearInterval(interval);
        p.remove();
      }
    },30);
  }
}

// 💥 Screenshake
function screenshake(){
  let i=0;
  let interval=setInterval(()=>{
    i++;
    document.body.style.transform=`translate(${(Math.random()-0.5)*10}px, ${(Math.random()-0.5)*10}px)`;
    if(i>10){
      clearInterval(interval);
      document.body.style.transform=`translate(0,0)`;
    }
  },30);
}

function endGame(){
  push(ref(db,"scores"),{
    name:playerName,
    score:score
  });
  gameOver.style.display="flex";
}

// 🔥 Realtime Top 10
onValue(ref(db,"scores"),snap=>{
  leaderList.innerHTML="";
  let arr=[];
  snap.forEach(s=>arr.push(s.val()));
  arr.sort((a,b)=>b.score-b.score);
  arr=arr.slice(0,10);
  arr.forEach((p,i)=>{
    let li=document.createElement("li");
    li.innerText=`${p.name} - ${p.score}`;
    if(i==0) li.style.color="gold";
    if(i==1) li.style.color="silver";
    if(i==2) li.style.color="#cd7f32";
    leaderList.appendChild(li);
  });
});

leaderboardBtn.onclick=()=>leaderboard.style.display="block";
closeLB.onclick=()=>leaderboard.style.display="none";
restartBtn.onclick=()=>location.reload();
