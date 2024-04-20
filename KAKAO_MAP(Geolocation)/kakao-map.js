/* ============= 개인별 커스텀 필요 항목 ====================*/
// 1. 집 위치
let destCoord = {
  latitude: 37.2526,
  longtitude: 127.0723,
};

// 2. 캐릭터 및 발자국 이미지
let characterImgSrc = './image/map/rabbit.gif';
let characterFootprintImgSrc = './image/map/footprint.png';

// 3. 캐릭터 이동속도 (ms)
let moveInterval = 50;
/*========================================================== */

/* ====== localstorage ======*/
let player = 'kim';
switch (player) {
  case 'park':
    destCoord = { latitude: 37.2526, longtitude: 127.0723 };
    characterImgSrc = './image/map/rabbit.gif';
    break;
  case 'kim':
    destCoord = { latitude: 37.5731, longtitude: 126.9987 };
    characterImgSrc = './image/map/bear.gif';
    break;
  case 'yoon':
    destCoord = { latitude: 37.2526, longtitude: 127.0723 };
    characterImgSrc = './image/map/santa.gif';
    break;
  case 'lee':
    destCoord = { latitude: 37.2526, longtitude: 127.0723 };
    characterImgSrc = './image/map/rabbit.gif';
    break;
}

/* ============= MAIN ====================*/
const mapWrap = document.getElementById('map-wrap');
const mapContainer = document.getElementById('map');
(async () => {
  // 시작(현재), 종료 좌표
  const curCoord = await getCurCoord();
  const coords = [curCoord, destCoord];

  // 카카오맵
  const map = new kakao.maps.Map(mapContainer, {
    center: new kakao.maps.LatLng(curCoord.latitude, curCoord.longtitude),
    level: 3,
  });

  // 시작, 종료 마커
  setMarkersOnMap(map, coords);

  // 시작 -> 종료 경로
  const carDirection = await getCarDirection(curCoord, destCoord);
  const pathPositions = directionToPath(carDirection);
  console.log(pathPositions);

  // 이동 애니메이션
  setMovingAnimation(map, pathPositions, carDirection);
})();
/* =======================================*/

async function getCurCoord() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
  return {
    longtitude: pos.coords.longitude,
    latitude: pos.coords.latitude,
  };
}

function setMarkersOnMap(map, coords) {
  const imageSrc = './image/map/marker.png';
  const imageSize = new kakao.maps.Size(30, 30);
  const imageOption = { offset: new kakao.maps.Point(0, 0) };
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

  const mapBounds = new kakao.maps.LatLngBounds();
  for (let i = 0; i < coords.length; i++) {
    const coord = coords[i];
    const point = new kakao.maps.LatLng(coord.latitude, coord.longtitude);

    const marker = new kakao.maps.Marker({ position: point, image: markerImage });
    marker.setMap(map);
    mapBounds.extend(point);
  }
  map.setBounds(mapBounds);
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

function directionToPath(direction) {
  const linePath = [];
  direction.routes[0].sections[0].roads.forEach(router => {
    router.vertexes.forEach((_, index) => {
      if (index % 2 === 0) {
        linePath.push(new kakao.maps.LatLng(router.vertexes[index + 1], router.vertexes[index]));
      }
    });
  });

  return linePath;
}

function setMovingAnimation(map, pathPositions, carDirection) {
  const content = document.createElement('div');
  content.classList.add('map-animation-marker');
  content.style.backgroundImage = `url("${characterImgSrc}")`;

  const customOverlay = new kakao.maps.CustomOverlay({
    position: pathPositions[0],
    content: content,
    map: map,
  });

  let index = 1;
  let footPrintIndex = 0;
  let increment = 3;
  let firstEnd = true;

  let prevPosition = null;

  const imageSrc = characterFootprintImgSrc;
  const imageSize = new kakao.maps.Size(15, 15);
  const imageOption = { offset: new kakao.maps.Point(0, 0) };
  const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  const footMarkers = [];
  const moveAnimation = setInterval(function () {
    index += increment;
    footPrintIndex += 1;
    if (index >= pathPositions.length || index <= 0) {
      increment *= -1;
      index = increment < 0 ? pathPositions.length - 1 : 0;
      footPrintIndex = 0;

      // 발자국 지우기
      footMarkers.forEach(item => item.setVisible(false));

      if (firstEnd) {
        clearInterval(moveAnimation);
        // showDirectionInfo(mapWrap, carDirection);
        firstEnd = false;
        prevPosition = null;
      }
    }
    // console.log((Math.abs(prevPosition.La - pathPositions[index].La) + Math.abs(prevPosition.Ma - pathPositions[index].Ma)));

    // 발자국 표시 (표시 주기: 10회마다 한 번)
    if (prevPosition == null || Math.abs(prevPosition.La - pathPositions[index].La) + Math.abs(prevPosition.Ma - pathPositions[index].Ma) >= 0.03) {
      const marker = new kakao.maps.Marker({ position: pathPositions[index], image: markerImage });
      marker.setZIndex(-1);
      marker.setMap(map);
      footMarkers.push(marker);
      prevPosition = pathPositions[index];
    }

    customOverlay.setPosition(pathPositions[index]);
  }, moveInterval);
}

// function showDirectionInfo(container, direction) {
//     console.log(direction);
//     const directionInfo = direction.routes[0].summary;
//     const infoDiv = document.createElement('div');
//     infoDiv.id = 'map-detail-info-div';
//     infoDiv.classList.add('map-detail');
//     infoDiv.innerHTML = `
//         <button onclick="onDetailCloseClicked()">close</button>
//         <div>
//             <div>DIST: ${directionInfo.distance}</div>
//             <div>DURATION: ${directionInfo.duration}</div>
//             <div>FARE= TAXI: ${directionInfo.fare.taxi}, TOLL: ${directionInfo.fare.toll}</div>
//         </div>
//     `;

//     container.appendChild(infoDiv);
// }

function onDetailCloseClicked() {
  const infoDiv = document.getElementById('map-detail-info-div');
  mapWrap.removeChild(infoDiv);
}
