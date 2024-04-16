const REST_API_KEY = 'e639f9820bd9dfd6a0627ecb6b06f5f3';
const mapContainer = document.getElementById('map');
console.log(mapContainer);
let tasks = localStorage.getItem('tasks');
let answerSheet = localStorage.getItem('answerSheet');
let score = localStorage.getItem('score');
const map = loadKakaoMap(mapContainer, 37.2526, 127.0723);

const carousel_lists = document.getElementById('carousel-lists');

let flipBgColor = '';
let flipTitle = '';
let flipText = '';
let defaultBgColor;
let defaultText;
let defaultTitle;

let tasksJSON = JSON.parse(tasks);
tasksJSON.forEach(x => {
  let label = document.createElement('label');
  label.setAttribute('class', 'swap swap-flip carousel-item');
  console.log(x);
  flipBgColor = 'bg-green';
  id = x.id;
  flipTitle = x.content;
  flipText = x.answer;
  defaultBgColor = 'bg-blue';
  defaultText = x.status === 'o_section' ? 'O' : 'X';
  defaultTitle = x.content;
  label.innerHTML = `
<input type="checkbox" />

<div class="swap-on swap-container">
  <div id="${id}" class="swap-item flex flex-col relative ${flipBgColor}">
    <div class="item-title">${id}. ${flipTitle}</div>
    <div class="item-container">
      <div class="w-1/2 flex items-center justify-center">
        <div class="text-[300px] text-gray-950">O</div>
      </div>
      <div class="w-1/2 flex justify-center items-center">
        <div class="text-3xl text-gray-950 pr-10 pl-10 pb-10">
          ${flipText}
        </div>
      </div>
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide4" class="bg-transparent border-none text-7xl">❮</a>
        <a href="#slide2" class="bg-transparent border-none text-7xl">❯</a>
      </div>
    </div>
  </div>
</div>
<div class="swap-off swap-container">
  <div id="${id}" class="swap-item flex flex-col relative ${defaultBgColor} h-full">
    <div class="item-title">${id}. ${defaultTitle}</div>
    <div class="item-container">
      <div class="w-3/4 flex justify-center items-center">
        <div class="text-3xl text-gray-950 pr-10 pl-10 pb-10">
          ${defaultText}
        </div>
      </div>
      <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide4" class="bg-transparent border-none text-7xl">❮</a>
        <a href="#slide2" class="bg-transparent border-none text-7xl">❯</a>
      </div>
    </div>
  </div>
</div>
`;
  carousel_lists.appendChild(label);
});

console.log(answerSheet);
console.log(score);

function loadKakaoMap(mapContainer, lat, lng) {
  const mapOptions = {
    center: new kakao.maps.LatLng(lat, lng),
    level: 3,
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
  // 호출방식의 URL을 입력합니다.
  const url = 'https://apis-navi.kakaomobility.com/v1/directions';
  // 출발지(origin), 목적지(destination)의 좌표를 문자열로 변환합니다.
  const origin = `${start.longtitude},${start.latitude}`;
  const destination = `${end.longtitude},${end.latitude}`;
  console.log(origin);
  console.log(destination);
  // 요청 헤더를 추가합니다.
  const headers = {
    Authorization: `KakaoAK ${REST_API_KEY}`,
    'Content-Type': 'application/json',
  };
  // 표3의 요청 파라미터에 필수값을 적어줍니다.
  const queryParams = new URLSearchParams({
    origin: origin,
    destination: destination,
  });
  const requestUrl = `${url}?${queryParams}`; // 파라미터까지 포함된 전체 URL
  console.log(requestUrl);
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
// MAIN
(async () => {
  const coords = await getCoords();
  const curPosMarker = new kakao.maps.LatLng(coords.latitude, coords.longtitude);
  const homeMarker = new kakao.maps.LatLng(37.2526, 127.0723);
  let points = [curPosMarker, homeMarker];
  let bounds = new kakao.maps.LatLngBounds();
  let marker;
  for (let i = 0; i < points.length; i++) {
    // 배열의 좌표들이 잘 보이게 마커를 지도에 추가합니다
    marker = new kakao.maps.Marker({ position: points[i] });
    marker.setMap(map);

    // LatLngBounds 객체에 좌표를 추가합니다
    bounds.extend(points[i]);
  }

  const data = await getCarDirection(coords, {
    latitude: 37.2526,
    longtitude: 127.0723,
  });

  console.log('data', data);
  const linePath = [];
  data.routes[0].sections[0].roads.forEach(router => {
    router.vertexes.forEach((vertex, index) => {
      // x,y 좌표가 우르르 들어옵니다. 그래서 인덱스가 짝수일 때만 linePath에 넣어봅시다.
      // 저도 실수한 것인데 lat이 y이고 lng이 x입니다.
      if (index % 2 === 0) {
        linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
      }
    });
  });

  const polyline = new kakao.maps.Polyline({
    path: linePath,
    strokeWeight: 5,
    strokeColor: '#000000',
    strokeOpacity: 0.7,
    strokeStyle: 'solid',
  });
  polyline.setMap(map);

  map.setBounds(bounds);
})();
