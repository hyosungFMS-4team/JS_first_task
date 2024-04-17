const carousels = document.getElementById('carousel-lists');
let id = 1;
let length = 0;
// MAIN
(async () => {
  // Carousel task
  let tasks = localStorage.getItem('tasks');

  tasks = JSON.parse(tasks);
  length = tasks.length;
  tasks.forEach(task => appendTaskCarouselItem(task, 'bg-green', 'bg-blue'));
  // Carousel map
  appendMapCarouselItem('나와의 거리', 'bg-green', 'bg-blue');
})();

async function appendMapCarouselItem(title, swapOnColor, swapOffColor) {
  const swapOffContainer = `
  <div id="map" style="width: 100%; height: 100%"></div>
  <div id="dropdown" class="dropdown dropdown-bottom dropdown-end">
    <div tabindex="0" role="button" class="btn">정보보기</div>
    <div tabindex="0" class="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
      <div class="card-body">
        <h3 class="card-title">Card title!</h3>
        <p>you can use any element as a dropdown.</p>
      </div>
    </div>
  </div>`;

  const swapOnContainer = `
        <div class="w-1/2 flex items-center justify-center">
            <div class="text-[300px] text-gray-950">O</div>
        </div>
        <div class="w-1/2 flex justify-center items-center">
            <div id="mapInfo" class="text-3xl text-gray-950 pr-10 pl-10 pb-10"></div>
        </div>`;
  length++;
  appendCarouselItem(title, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor);

  // 좌표
  const curCoord = await getCoords();
  const destCoord = {
    latitude: 37.2526,
    longtitude: 127.0723,
  };
  const coords = [curCoord, destCoord];

  // 지도 생성
  const mapContainer = document.getElementById('map');
  const map = loadKakaoMap(mapContainer, 37.2526, 127.0723);

  // 좌표 마커로 지도에 추가
  makeMarkersToMap(map, coords);

  // 경로 생성 및 지도에 추가
  const carDirection = await getCarDirection(curCoord, destCoord);
  console.log(carDirection);
  makePathLineToMap(map, carDirection);

  const directionSummary = carDirection.routes[0].summary;
  const directionFare = directionSummary.fare;

  const mapInfo = document.getElementById('mapInfo');
  mapInfo.innerHTML = `
        TAXI: ${directionFare.taxi} <br>
        TOLL: ${directionFare.toll} <br>

        DIST: ${directionSummary.distance}
    `;
}

function appendTaskCarouselItem(task, swapOnColor, swapOffColor) {
  const swapOffContainer = `
        <div class="w-1/2 flex items-center justify-center">
            <div class="text-[300px] text-gray-950">${task.status === 'o_section' ? 'O' : 'X'}</div>
        </div>
        <div class="w-1/2 flex justify-center items-center">
            <div class="text-3xl text-gray-950 pr-10 pl-10 pb-10">
                ${task.answer}
            </div>
        </div>`;

  const swapOnContainer = `
        <div class="w-1/2 flex items-center justify-center">
            <div class="text-[300px] text-gray-950">O</div>
        </div>
        <div class="w-1/2 flex justify-center items-center">
            <div class="text-3xl text-gray-950 pr-10 pl-10 pb-10">
                ${task.answer}
            </div>
        </div>`;

  appendCarouselItem(`${id}. ${task.content}`, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor);
}

function appendCarouselItem(title, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor) {
  const carouselItem = document.createElement('label');
  carouselItem.setAttribute('class', 'swap swap-flip carousel-item');
  console.log(id, length);
  carouselItem.innerHTML = `
        <input type="checkbox" />
        <div class="swap-off swap-container">
            <div id="${id}" class="swap-item flex flex-col relative ${swapOffColor}">
                <div class="item-title">${title}</div>
                <div class="item-container">${swapOffContainer}</div>
            </div>
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#${id - 1 !== 0 ? id - 1 : length}" class="bg-transparent border-none text-7xl">❮</a>
                <a href="#${id < length ? id + 1 : 1}" class="bg-transparent border-none text-7xl">❯</a>
            </div>
        </div>
        <div class="swap-on swap-container">
            <div id="${id}" class="swap-item flex flex-col relative ${swapOnColor}">
                <div class="item-title">${title}</div>
                <div class="item-container">${swapOnContainer}</div>
            </div>
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#${id - 1 !== 0 ? id - 1 : length}" class="bg-transparent border-none text-7xl">❮</a>
                <a href="#${id < length ? id + 1 : 1}" class="bg-transparent border-none text-7xl">❯</a>
            </div>
        </div>
    `;
  carousels.appendChild(carouselItem);
  id++;
}

function loadKakaoMap(mapContainer, lat, lng) {
  const mapOptions = {
    center: new kakao.maps.LatLng(lat, lng),
  };
  return new kakao.maps.Map(mapContainer, mapOptions);
}
function makeMarker(lat, lng) {
  const markerPos = new kakao.maps.LatLng(lat, lng);
  const marker = new kakao.maps.Marker({
    position: markerPos,
  });
  return marker;
}

function makeMarkersToMap(map, coords) {
  // 모든 마커가 한 번에 표시될 수 있도록 지도 경계 설정
  const mapBounds = new kakao.maps.LatLngBounds();

  const imageSrc = './image/pixil-frame-0.png'; // 마커이미지의 주소
  const imageSize = new kakao.maps.Size(26, 38); // 마커이미지의 크기
  const imageOption = { offset: new kakao.maps.Point(13, 38) }; //마커 위치 내부 좌표
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  let content = `<div>
       <span class="custom-overlay">김기정</span>
    </div>`;
  for (const coord of coords) {
    const point = new kakao.maps.LatLng(coord.latitude, coord.longtitude);
    const marker = new kakao.maps.Marker({ position: point, image: markerImage });

    mapBounds.extend(point);
    marker.setMap(map);

    const customOverlay = new kakao.maps.CustomOverlay({
      map: map,
      position: point,
      content: content,
      yAnchor: 2.7,
    });
    customOverlay.setMap(map);
  }

  map.setBounds(mapBounds);
}

function makePathLineToMap(map, direction) {
  const linePath = [];
  direction.routes[0].sections[0].roads.forEach(router => {
    router.vertexes.forEach((_, index) => {
      if (index % 2 === 0) {
        linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
      }
    });
  });

  // 경로 지도에 추가
  const polyline = new kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 5,
    strokeColor: '#000000',
    strokeOpacity: 0.7,
    strokeStyle: 'solid',
  });

  polyline.setMap(map);
}

async function getCoords() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return {
    longtitude: pos.coords.longitude,
    latitude: pos.coords.latitude,
  };
}
async function getCarDirection(start, end) {
  const url = 'https://apis-navi.kakaomobility.com/v1/directions';
  const REST_API_KEY = 'e639f9820bd9dfd6a0627ecb6b06f5f3';

  const origin = `${start.longtitude},${start.latitude}`;
  const destination = `${end.longtitude},${end.latitude}`;
  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
  });

  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const requestUrl = `${url}?${queryParams}`;

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: headers,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error:', error);
  }
}

const test = document.getElementById('map').addEventListener('click', function (event) {
  event.preventDefault();
});

document.getElementById('infoBtn').addEventListener('click', function (event) {
  event.preventDefault();
});

// 개인별 음악, 사진 목록 위치 지정
const musicsSrcs = ['audio/first.mp3', 'audio/second.mp3', 'audio/thirdlonglonglong.mp3'];
const musicImgSrcs = ['image/first.jpg', 'image/second.png'];
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
  audio.addEventListener('loadeddata', () => onMusicLoaded());
  audioBtnPlay.addEventListener('click', () => onPlayButtonClicked());
  audioBtnPrev.addEventListener('click', () => onPrevButtonClicked());
  audioBtnNext.addEventListener('click', () => onNextButtonClicked());
}

//main
addEventListeners();
loadMusic(musicIndex);
