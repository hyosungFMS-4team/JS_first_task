// 개인별 문제 후면에 띄울 데이터
const taskDetails = [
  {
    title: 'title1',
    content: 'content1',
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

const carousel = document.getElementById('carousel');
const glide = document.querySelector('.glide__slides');
const tasks = JSON.parse(localStorage.getItem('tasks'));
const length = tasks.length;

window.addEventListener('load', function () {
  new Glide('.glide', {
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

  flipCards();
  // appendMapCarouselItem();
})();
//carousel
{
  /* <div class="carousel-item">
            <div class="flip">
                <div id="${idx}" class="card-body front ${data.front.color}">
                    ${data.front.color ? `<div class="card-title">${data.front.title}</div>` : data.front.title}
                    <div class="carousel-arrow">
                        <a href="#${idx - 1 >= 0 ? idx - 1 : length - 1}" class=“bg-transparent border-none text-7xl">❮</a>
                        <a href="#${(idx + 1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
                    </div>
                </div>
                <div id="${idx}" class="card-body back ${data.back.color}">
                    ${data.front.color ? `<div class="card-title">${data.front.title}</div>` : data.front.title}
                    <div class="carousel-arrow">
                        <a href="#${idx - 1 >= 0 ? idx - 1 : length - 1}" class=“bg-transparent border-none text-7xl">❮</a>
                        <a href="#${(idx + 1) % length}" class=“bg-transparent border-none text-7xl">❯</a>
                    </div>
                </div>
            </div>
        </div> */
}

function appendCarouselItem(idx, data) {
  // const item = document.createElement('div');
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
              ${data.front.color ? `<div class="card-title">${data.front.title}</div>` : data.front.title}
            <div class="glide__arrows" data-glide-el="controls">
              <button class="glide__arrow glide__arrow--left" data-glide-dir="<"><</button>
              <button class="glide__arrow glide__arrow--right" data-glide-dir=">">></button>
            </div>
          </div> 
        </div>
      `;
  glide.appendChild(item);
  // carousel.appendChild(item);
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

const carouselArrows = document.querySelectorAll('.glide__arrows button');

carouselArrows.forEach(arrow => {
  arrow.addEventListener('click', function (event) {
    event.stopPropagation(); // 이벤트 전파 중지
  });
});
