// 개인별 음악, 사진 목록 위치 지정
const musicsSrcs = [
  'audio/first.mp3',
  'audio/second.mp3',
  'audio/thirdlonglonglong.mp3'
];
const musicImgSrcs = [
  'image/first.jpg',
  'image/second.png'
]
let musicIndex = 0;

const audio = document.querySelector('audio');
const audioSrc = document.getElementById('audio_src');

const audioBtnPlay = document.getElementById('audio_player_controller_play');
const audioBtnPrev = document.getElementById('audio_player_controller_prev');
const audioBtnNext = document.getElementById('audio_player_controller_next');

const audioImage = document.getElementById('audio_player_image');
const audioTitle = document.querySelector('.audio_player_title');

function loadMusic() {
  console.log('load music ', musicIndex);
  audioSrc.src = musicsSrcs[musicIndex];
  audio.load();
}

function onMusicLoaded() {
  const title = musicsSrcs[musicIndex].split('/')[1].split('.')[0];

  audioTitle.innerText = title;
  audioImage.src = musicImgSrcs[musicIndex];
  console.log('music loaded ', title);
  playMusic();
}

function playMusic() {
  console.log('music played');
  audioImage.style.animation = `spin 4s linear infinite`;
  audio.play();
}
function pauseMusic() {
  console.log('music paused');
  audioImage.style.animation = `none`;
  audioBtnPlay.innerHTML = `<img src="image/btn_play.png"/>`;
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
  audioBtnPlay.addEventListener('click', () => onPlayButtonClicked());
  audioBtnPrev.addEventListener('click', () => onPrevButtonClicked());
  audioBtnNext.addEventListener('click', () => onNextButtonClicked());
}

//main
addEventListeners();
loadMusic(musicIndex);