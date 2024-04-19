// 개인별 문제 후면에 띄울 데이터
const taskDetails = [
  {
    title: 'title1',
    content: `<div id="map" style="width: 100%; height: 100%"></div>
    <details class="dropdown dropdown-bottom dropdown-end" id="dropdown">
      <summary class="m-1 btn" id="mapSummary">정보 보기</summary>
      <ul class="p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52" id="mapUl">
        <li id="mapInfo"></li>
      </ul>
    </details>
    <button id="flipBtn">flip</button>`,
  },
  {
    title: 'title2',
    content: 'content2',
  },
  {
    title: 'title3',
    content: 'content3',
  },
  {
    title: 'title4',
    content: 'content4',
  },
  {
    title: 'title5',
    content: 'content5',
  },
  {
    title: 'title6',
    content: 'content6',
  },
  {
    title: 'title7',
    content: 'content7',
  },
  {
    title: 'title8',
    content: 'content8',
  },
  {
    title: 'title9',
    content: 'content9',
  },
  {
    title: 'title10',
    content: 'content10',
  },
];

const glideSlides = document.querySelector('.glide__slides');
const tasks = JSON.parse(localStorage.getItem('tasks'));
const length = tasks.length;
let glide;

window.addEventListener('load', function () {
  glide = new Glide('.glide', {
    type: 'carousel',
    focusAt: 'center',
    perView: 2,
    gap: 40,
    keyboard: true,
    peek: {
      before: 30,
      after: 30,
    },
  }).mount();
});

//glide default class names
const glide_default = {
  direction: {
    ltr: 'glide--ltr',
    rtl: 'glide--rtl',
  },
  slider: 'glide--slider',
  carousel: 'glide--carousel',
  swipeable: 'glide--swipeable',
  dragging: 'glide--dragging',
  cloneSlide: 'glide__slide--clone',
  activeNav: 'glide__bullet--active',
  activeSlide: 'glide__slide--active',
  disabledArrow: 'glide__arrow--disabled',
};

(async () => {
  // Carousel task
  tasks.forEach((task, idx) =>
    appendCarouselItem(idx, {
      front: {
        title: task.content,
        color: 'bg-blue',
      },
      back: {
        title: taskDetails[idx].title,
        content: taskDetails[idx].content,
        color: 'bg-red',
      },
    })
  );
  kakao.maps.load(function () {
    appendMapCarouselItem();
  });
  flipCards();
  handleGlideDrag();
})();

function appendCarouselItem(idx, data) {
  let item = document.createElement('li');
  item.setAttribute('class', 'glide_slide');
  item.innerHTML = `
        <div class="flip">
          <div id="${idx}" class="card-body front ${data.front.color}">
          ${data.front.color ? `<div class="card-title">${data.front.title}</div>` : data.front.title}
            <div class="glide__arrows" data-glide-el="controls">
              <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><</button>
              <button class="glide__arrow glide__arrow--right" data-glide-dir=">">></button>
            </div>
          </div>
          <div id="${idx}" class="card-body back ${data.back.color}">
              ${data.back.content}
            <div class="glide__arrows" data-glide-el="controls">
              <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><</button>
              <button class="glide__arrow glide__arrow--right" data-glide-dir=">">></button>
            </div>
          </div> 
        </div>
      `;
  glideSlides.appendChild(item);
  // carousel.appendChild(item);
}

async function appendMapCarouselItem() {
  // 좌표
  const curCoord = await getCoords();
  const destCoord = {
    latitude: 37.2526,
    longtitude: 127.0723,
  };
  const coords = [curCoord, destCoord];

  // 지도 생성
  const mapContainer = document.getElementById('map');
  const parentElement = mapContainer.parentElement;

  const mapOptions = {
    center: new kakao.maps.LatLng(37.2526, 127.0723),
  };
  const map = new kakao.maps.Map(mapContainer, mapOptions);
  parentElement.style.padding = '0';
  parentElement.style.gap = '0';
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
  const glideSlide = document.querySelectorAll('li');
  const flip = document.querySelectorAll('.flip');

  glideSlide.forEach(x => {
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

function handleGlideDrag() {
  const glideArrows = document.querySelectorAll('.glide__arrows button');
  const mapElements = ['map', 'mapSummary', 'mapUl', 'mapInfo'];
  const allElements = document.querySelectorAll('*');

  glideArrows.forEach(arrow => {
    arrow.addEventListener('click', function (event) {
      event.stopPropagation(); // 이벤트 전파 중지
    });
  });

  mapElements.forEach(elementId => {
    const element = document.getElementById(elementId);
    if (element) {
      element.addEventListener('click', handleMapClick);
      element.addEventListener('mousedown', handleMapMouseDown);
    }
  });

  document.getElementById('dropdown').addEventListener('click', function (event) {
    event.stopPropagation();
  });

  function handleMapClick(event) {
    event.stopPropagation();
    glide.disable();
  }

  function handleMapMouseDown(event) {
    glide.disable();
  }

  document.getElementById('dropdown').addEventListener('click', function (event) {
    event.stopPropagation();
  });

  // map과 dropdown 요소 제외한 모든 요소에 대해 이벤트 리스너 추가
  allElements.forEach(element => {
    let id = element.id;
    if (id !== 'map' && id !== 'dropdown' && id !== 'mapSummary' && id !== 'mapUl' && id !== 'mapInfo') {
      // 마우스가 요소 위에 있을 때 glide.enable() 실행
      element.addEventListener('mouseenter', function () {
        console.log('glide enabled');
        glide.enable();
      });
      // 요소를 클릭했을 때 glide.enable() 실행
      element.addEventListener('click', function () {
        console.log('glide enabled');
        glide.enable();
      });
    }
  });
}
