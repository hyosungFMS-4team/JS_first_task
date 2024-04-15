// 개인별 음악, 사진 목록 위치 지정
const musicsSrcs = [
  'audio/first.mp3',
  'audio/second.mp3'
];
const musicImgSrcs = [
  'image/first.jpg',
  'image/second.jpg'
]
let musicIndex = 0;

const audio = document.querySelector('audio');
const audioSrc = document.getElementById('audio_src');

const playerBtnPlay = document.getElementById('player_btn_play');
const playerBtnPrev = document.getElementById('player_btn_prev');
const playerBtnNext = document.getElementById('player_btn_next');

const playerInfoImage = document.getElementById('player_info_image');
const playerTextTitle = document.getElementById('player_text_title');

function loadMusic() {
  console.log('load music ', musicIndex);
  audioSrc.src = musicsSrcs[musicIndex];
  audio.load();
}

function onMusicLoaded() {
  const title = musicsSrcs[musicIndex].split('/')[1].split('.')[0];
  playerTextTitle.innerText = title;
  playerInfoImage.style.backgroundImage = `url(${musicImgSrcs[musicIndex]})`;
  console.log('music loaded ', title);
  playMusic();
}

function playMusic() {
  console.log('music played');
  playerInfoImage.style.animation = `spin 4s linear infinite`;
  playerBtnPlay.innerHTML = `<img src="image/btn_pause.png" width="60px" heigth="60px"/>`;
  audio.play();
}
function pauseMusic() {
  console.log('music paused');
  playerInfoImage.style.animation = `none`;
  playerBtnPlay.innerHTML = `<img src="image/btn_play.png"/>`;
  audio.pause();
}

function onPlayButtonClicked() {
  if (audio.duration > 0 && !audio.paused) {
    pauseMusic();
  } else {
    playMusic();
  }
}
function onPrevButtonClicked() {
  musicIndex -= 1;
  if (musicIndex < 0) {
    musicIndex = musicsSrcs.length - 1;
  }
  loadMusic(musicIndex);
}
function onNextButtonClicked() {
  musicIndex = (musicIndex + 1) % musicsSrcs.length;
  loadMusic(musicIndex);
}

function addEventListeners() {
  audio.addEventListener("loadeddata", () => onMusicLoaded());
  playerBtnPlay.addEventListener('click', () => onPlayButtonClicked());
  playerBtnPrev.addEventListener('click', () => onPrevButtonClicked());
  playerBtnNext.addEventListener('click', () => onNextButtonClicked());
}

//main
addEventListeners();
loadMusic(musicIndex);