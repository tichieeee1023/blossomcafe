// js/location.js

// 카카오 시스템이 완전히 준비되었을 때 내부 코드를 실행하라는 정석 안전장치
kakao.maps.load(function() {
    
    const container = document.getElementById('daumMaps');
    const options = {
        center: new kakao.maps.LatLng(37.497942, 127.027621), // 서울 강남역 2번 출구 주변
        level: 3 
    };

    // 1. 지도 생성
    const map = new kakao.maps.Map(container, options);

    // 2. 우리 핑크 BLOSSOM 카페 마커 생성
    const markerPosition = new kakao.maps.LatLng(37.497942, 127.027621); 
    const defaultMarker = new kakao.maps.Marker({
        position: markerPosition
    });
    defaultMarker.setMap(map);

    // 3. 우리 카페 커스텀 오버레이 내용
    const overlayContent = `
        <div class="wrap">
            <div class="info">
                <div class="title">
                    🌸 핑크 블라썸 카페
                    <div class="close" onclick="closeOverlay()" title="닫기"></div>
                </div>
                <div class="body">
                <div class="img">
                    <img src="https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=150&q=80" width="73" height="70" alt="핑크 블라썸 카페 이미지">
                </div>
                    <div class="desc">
                        <div class="ellipsis">핑크시 블라썸로 104</div>
                        <div class="jibun ellipsis">(우) 12345 (지번) 블라썸동 7-7</div>
                        <div><a href="index.html" class="link">홈페이지 가기</a></div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // 4. 커스텀 오버레이 객체 생성 및 지도 표시
    const cafeOverlay = new kakao.maps.CustomOverlay({
        content: overlayContent,
        map: map,
        position: defaultMarker.getPosition()       
    });

    // 5. 마커 클릭 이벤트
    kakao.maps.event.addListener(defaultMarker, 'click', function() {
        cafeOverlay.setMap(map);
    });

    // 6. 오버레이 닫기 함수 전역 등록
    window.closeOverlay = function() {
        cafeOverlay.setMap(null);
    };


    /* =========================================================
       주변 카테고리(카페/편의점) 검색 기능
       ========================================================= */

    let searchMarkers = [];
    
    // ★ 밤티의 대역죄 오타 수정: Services -> services (소문자 s 로 변경!)
    const ps = new kakao.maps.services.Places(); 

    // 7. 주변 검색 함수 전역 등록
    window.searchAround = function(categoryCode) {
        window.clearMarkers();
        cafeOverlay.setMap(null); 
        defaultMarker.setMap(null);

        const currentCenter = map.getCenter();

        ps.categorySearch(categoryCode, placesSearchCB, {
            location: currentCenter,
            radius: 500 
        });
    };

    // 8. 장소검색 완료 콜백
    function placesSearchCB(data, status, pagination) {
        // ★ 여기도 소문자 services 로 수정!
        if (status === kakao.maps.services.Status.OK) {
            const bounds = new kakao.maps.LatLngBounds();

            for (let i = 0; i < data.length; i++) {
                displayMarker(data[i]);    
                bounds.extend(new kakao.maps.LatLng(data[i].y, data[i].x));
            }       

            map.setBounds(bounds);
        // ★ 여기도 소문자 services 로 수정!
        } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert('이 근방 500m 이내에는 해당 장소가 없습니다! 😭');
        }
    }

    // 9. 검색 마커 찍기
    function displayMarker(place) {
        const marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(place.y, place.x) 
        });

        searchMarkers.push(marker);

        const infowindow = new kakao.maps.InfoWindow({zIndex:1});
        kakao.maps.event.addListener(marker, 'click', function() {
            infowindow.setContent('<div style="padding:5px;font-size:12px;color:#333;font-family:sans-serif;">' + place.place_name + '</div>');
            infowindow.open(map, marker);
        });
    }

    // 10. 마커 초기화 함수 전역 등록
    window.clearMarkers = function() {
        for (let i = 0; i < searchMarkers.length; i++) {
            searchMarkers[i].setMap(null);
        }
        searchMarkers = [];
        
        defaultMarker.setMap(map);
        cafeOverlay.setMap(map);
        map.panTo(markerPosition);
    };

});