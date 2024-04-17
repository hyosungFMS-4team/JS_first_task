const swapCheckBox = document.getElementById('swap-checkbox');
swapCheckBox.onclick = (e) => {
    console.log('clicked');
    e.preventDefault();
};

// MAIN
(async () => {
    // 좌표
    const curCoord = await getCoords();
    const destCoord = {
        latitude: 37.2526,
        longtitude: 127.0723
    };
    const coords = [curCoord, destCoord];

    // 지도 생성
    const mapContainer = document.getElementById('map');
    const map = loadKakaoMap(mapContainer, curCoord.latitude, curCoord.longtitude);

    // 좌표 마커로 지도에 추가
    makeMarkersToMap(map, coords, makeOverlayContents('출발', '도착'));

    // 경로 생성 및 지도에 추가
    const carDirection = await getCarDirection(curCoord, destCoord);
    console.log(carDirection);
    makePathLineToMap(map, carDirection);

    const directionSummary = carDirection.routes[0].summary;
    const directionFare = directionSummary.fare;

//     const mapInfo = document.getElementById('mapInfo');
//     mapInfo.innerHTML = `
//     TAXI: ${directionFare.taxi} <br>
//     TOLL: ${directionFare.toll} <br>

//     DIST: ${directionSummary.distance}
// `;



})();

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

function makeOverlayContents(...titles) {
    const contents = [];
    for (const title of titles) {
        const content = `
            <div>
                <span class="custom-overlay">${title}</span>
            </div>`;
        contents.push(content);
    }
    return contents;
}

function makeMarkersToMap(map, coords, overlayContents) {
    // 모든 마커가 한 번에 표시될 수 있도록 지도 경계 설정
    const mapBounds = new kakao.maps.LatLngBounds();

    const imageSrc = './image/pixil-frame-0.png';                   // 마커이미지의 주소
    const imageSize = new kakao.maps.Size(26, 38);                  // 마커이미지의 크기
    const imageOption = { offset: new kakao.maps.Point(13, 38) };   //마커 위치 내부 좌표
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

    for (let i=0; i<coords.length; i++) {
        const coord = coords[i];
        const point = new kakao.maps.LatLng(coord.latitude, coord.longtitude);
        const marker = new kakao.maps.Marker({ position: point, image: markerImage });

        mapBounds.extend(point);
        marker.setMap(map);

        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: point,
            content: overlayContents[i],
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
