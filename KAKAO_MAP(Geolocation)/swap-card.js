const carousel = document.getElementById('carousel');

const tasks = JSON.parse(localStorage.getItem('tasks'));
const length = tasks.length;

console.log(tasks);
(async () => {
  // Carousel task
  tasks.forEach((task, idx) =>
    appendCarouselItem(idx, {
      front: {
        title: task.content,
        color: 'bg-blue',
      },
      back: {
        title: task.content,
        color: 'bg-red',
      },
    })
  );

  flipCards();
  appendMapCarouselItem();
})();

function appendCarouselItem(idx, data) {
  const item = document.createElement('div');

  item.innerHTML = `
        <div class="carousel-item">
            <div class="flip">
                <div id="${idx}" class="card-body front ${data.front.color}">
                    <a href="#${idx - 1 >= 0 ? idx - 1 : length - 1}" class=“bg-transparent border-none text-7xl">❮</a>
                    ${data.front.color ? `<div class="card-title">${data.front.title}</div>` : data.front.title}
                    
                    <a href="#${(idx + 1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
                </div>
                <div id="${idx}" class="card-body back ${data.back.color}">
                    <a href="#${idx - 1 >= 0 ? idx - 1 : length - 1}" class=“bg-transparent border-none text-7xl">❮</a>
                    <div class="card-title">${data.back.title}</div>
                    <a href="#${(idx + 1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
                </div>
            </div>
        </div>`;

  carousel.appendChild(item);
}

async function appendMapCarouselItem() {
  let lastCard = carousel.lastElementChild;
  let lastCardId = Number(lastCard.querySelector('.flip > .card-body').id);
  console.log(lastCardId);
  const mapHtml = {
    front: {
      title: `
    <div id="map" style="width: 100%; height: 100%"></div>
    <div id="dropdown" class="dropdown dropdown-bottom dropdown-end">
      <div tabindex="0" role="button" class="btn">정보보기</div>
      <div tabindex="0" class="dropdown-content z-[1] card card-compact w-64 p-2 shadow bg-primary text-primary-content">
        <div class="card-body">
          <h3 class="card-title">Card title!</h3>
          <p>you can use any element as a dropdown.</p>
        </div>
      </div>
    </div>`,
      color: '',
    },
    back: {
      title: '',
      color: 'bg-blue',
    },
  };
  appendCarouselItem(lastCardId + 1, mapHtml);
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

function flipCards() {
  const carouselItem = document.querySelectorAll('.carousel-item');
  const flip = document.querySelectorAll('.flip');

  carouselItem.forEach(x => {
    x.addEventListener('click', e => {
      flip.forEach(a => {
        a.addEventListener('click', e => {
          if (a.classList.contains('flipped')) {
            a.classList.remove('flipped');
          } else {
            a.classList.add('flipped');
          }
        });
      });
    });
  });
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

// const test = document.getElementById('map').addEventListener('click', function (event) {
//   event.preventDefault();
// });

// document.getElementById('infoBtn').addEventListener('click', function (event) {
//   event.preventDefault();
// });
