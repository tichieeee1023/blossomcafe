// js/main.js

const clockText = document.getElementById("clock-text");
const weatherText = document.getElementById("weather-text");

// 날씨 코드 변환기
const weatherLabels = { 
    0: "맑음", 1: "대체로 맑음", 2: "구름 조금", 3: "흐림", 
    45: "안개", 48: "이슬비 안개", 51: "약한 이슬비", 53: "이슬비", 
    55: "강한 이슬비", 61: "약한 비", 63: "보통 비", 65: "강한 비", 
    71: "약한 눈", 73: "보통 눈", 75: "강한 눈", 95: "뇌우" 
};

// 1. 실시간 시계 함수
function updateClock() {
    const now = new Date();
    
    // 1. 날짜 데이터 뽑아오기
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작해서 +1 해줘야 해!
    const date = String(now.getDate()).padStart(2, '0');
    
    // 2. 시간 데이터 뽑아오기
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    // 3. HTML 화면에 글자 콕 박아넣기
    const dateEl = document.getElementById('date-text');
    const clockEl = document.getElementById('clock-text');
    
    if (dateEl) dateEl.innerText = `${year}. ${month}. ${date}`;
    if (clockEl) clockEl.innerText = `${hours}:${minutes}:${seconds}`;
}

// 처음에 한 번 실행하고, 1초마다 반복 호출하기
updateClock();
setInterval(updateClock, 1000);

// 2. Open-Meteo API 날씨 함수
async function updateWeather(latitude = 37.5665, longitude = 126.9780, label = "서울") { 
    if (!weatherText) return;
    try { 
        const endpoint = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=Asia%2FSeoul`; 
        const response = await fetch(endpoint); 
        const data = await response.json(); 
        const current = data.current; 
        const weatherLabel = weatherLabels[current.weather_code] || "날씨"; 
        weatherText.textContent = `${label} ${Math.round(current.temperature_2m)}°C ${weatherLabel}`; 
    } catch (error) { 
        weatherText.textContent = "날씨 준비 중"; 
    } 
}

// 3. 페이지 로드 시 실행 및 초기화
document.addEventListener('DOMContentLoaded', () => {
    updateClock(); 
    setInterval(updateClock, 1000);

    if ("geolocation" in navigator) { 
        navigator.geolocation.getCurrentPosition(
            (position) => updateWeather(position.coords.latitude, position.coords.longitude, "현재 위치"), 
            () => updateWeather()
        ); 
    } else { 
        updateWeather(); 
    }
});

// js/main.js

document.addEventListener("DOMContentLoaded", () => {
    
    /* =========================================================
       1.스크롤 시 메뉴 카드가 부드럽게 나타나는 스크롤 이벤트
       ========================================================= */
    const revealElements = document.querySelectorAll('.menu-card');

    const observerOptions = {
        root: null, 
        rootMargin: '0px',
        threshold: 0.2 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    revealElements.forEach(el => {
        observer.observe(el);
    });


    /* =========================================================
       2. 메인 비주얼 3.5초 간격 페이드 슬라이드 기능
       ========================================================= */
    const slides = document.querySelectorAll('.hero-visual .slide-img');
    
    if (slides.length > 0) {
        let currentSlideIndex = 0;

        function nextSlide() {
            slides[currentSlideIndex].classList.remove('active');
            currentSlideIndex = (currentSlideIndex + 1) % slides.length;
            slides[currentSlideIndex].classList.add('active');
        }

        setInterval(nextSlide, 4500);
    }

    /* =========================================================
       3. 마우스 커서 꽁무니 🌸 팔로워 기능
       ========================================================= */
    const follower = document.querySelector('.cursor-follower');

    // 혹시 모를 에러 방지 가드
    if (follower) {
        follower.innerHTML = '🌸';

        document.addEventListener('mousemove', (e) => {
            follower.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
        });
    }
});