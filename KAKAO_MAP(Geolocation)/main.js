const carousels = document.getElementById('carousel-lists');

// MAIN
(async () => {
    // Carousel task
    const tasks = localStorage.getItem('tasks');
    JSON.parse(tasks).forEach(task => appendTaskCarouselItem(task, 'bg-green', 'bg-blue'));

    // Carousel map
    appendMapCarouselItem('나와의 거리', 'bg-green', 'bg-blue');
    
})();

async function appendMapCarouselItem(title, swapOnColor, swapOffColor) {

    const swapOffContainer = `
        <div class="w-1/2 flex items-center justify-center">
            <div class="text-[300px] text-gray-950">O</div>
            <div class="mapContainer">
                 <div id="map" style="width: 100%; height: 400px"></div>
             </div>
        </div>
        <div class="w-1/2 flex justify-center items-center">
            <div id="mapDetail" class="text-3xl text-gray-950 pr-10 pl-10 pb-10"></div>
        </div>`;
    
    const swapOnContainer = `
        <div class="w-1/2 flex items-center justify-center">
            <div class="text-[300px] text-gray-950">O</div>
        </div>
        <div class="w-1/2 flex justify-center items-center">
            <div id="mapInfo" class="text-3xl text-gray-950 pr-10 pl-10 pb-10"></div>
        </div>`;

    appendCarouselItem('map-carousel-item', title, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor);

    // 좌표
    const curCoord = await getCoords();
    const destCoord = {
        latitude: 37.2526,
        longtitude: 127.0723
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

    appendCarouselItem(task.id, `${task.id}. ${task.content}`, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor);
}

function appendCarouselItem(id, title, swapOffContainer, swapOffColor, swapOnContainer, swapOnColor) {
    const carouselItem = document.createElement('label');
    carouselItem.setAttribute('class', 'swap swap-flip carousel-item');
    carouselItem.innerHTML = `
        <input type="checkbox" />
        <div class="swap-off swap-container">
            <div id="${id}" class="swap-item flex flex-col relative ${swapOffColor}">
                <div class="item-title">${title}</div>
                <div class="item-container">${swapOffContainer}</div>
            </div>
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" class="bg-transparent border-none text-7xl">❮</a>
                <a href="#slide2" class="bg-transparent border-none text-7xl">❯</a>
            </div>
        </div>
        <div class="swap-on swap-container">
            <div id="${id}" class="swap-item flex flex-col relative ${swapOnColor}">
                <div class="item-title">${title}</div>
                <div class="item-container">${swapOnContainer}</div>
            </div>
            <div class="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                <a href="#slide4" class="bg-transparent border-none text-7xl">❮</a>
                <a href="#slide2" class="bg-transparent border-none text-7xl">❯</a>
            </div>
        </div>
    `
    carousels.appendChild(carouselItem);
}

function loadKakaoMap(mapContainer, lat, lng) {
    const mapOptions = {
        center: new kakao.maps.LatLng(lat, lng)
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

    const imageSrc = './image/pixil-frame-0.png';                   // 마커이미지의 주소
    const imageSize = new kakao.maps.Size(26, 38);                  // 마커이미지의 크기
    const imageOption = { offset: new kakao.maps.Point(13, 38) };   //마커 위치 내부 좌표
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    for (const coord of coords) {
        const point = new kakao.maps.LatLng(coord.latitude, coord.longtitude);
        const marker = new kakao.maps.Marker({ position: point, image: markerImage }  );

        mapBounds.extend(point);
        marker.setMap(map);
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