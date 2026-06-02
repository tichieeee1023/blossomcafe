// js/products.js - 장바구니 시스템 완벽 연동 버전

// 1. DOM 요소를 선택합니다. (카드가 들어갈 컨테이너)
const galleryContainer = document.getElementById('product-gallery');

// 2. JSON 데이터를 비동기로 불러오는 함수
async function loadProducts() {
    try {
        // 경로 확인: html 파일 기준이므로 'data/products.json'으로 접근합니다.
        const response = await fetch('data/products.json');
        
        if (!response.ok) {
            throw new Error('데이터를 불러오는데 실패했습니다.');
        }

        const products = await response.json();
        
        // 3. 데이터를 화면에 그리 그리기(렌더링) 함수 호출
        renderProducts(products);
        
    } catch (error) {
        console.error('에러 발생:', error);
        galleryContainer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--rose); padding: 40px; font-weight: bold;">메뉴를 불러오는 중 문제가 발생했습니다. ☕</p>`;
    }
}

// 4. 상품 데이터를 가지고 HTML 카드를 만들어 갤러리에 추가하는 함수
function renderProducts(productsList) {
    // 기존에 컨테이너 안에 내용이 있었다면 비워줍니다.
    galleryContainer.innerHTML = '';

    // 배열을 순회하며 카드 양식(HTML)을 생성합니다.
    productsList.forEach(product => {
        // 숫자인 가격을 '6,500원' 형태로 예쁘게 포맷팅
        const formattedPrice = product.price.toLocaleString() + '원';

        // 카드 컴포넌트 구조 생성
        const cardHTML = `
            <article class="product-card">
                <div class="product-img-wrapper">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=500&q=80'">
                    <span class="category-tag">${product.category}</span>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-footer">
                        <span class="product-price">${formattedPrice}</span>
                        
                        <button type="button" class="order-btn btn-add-to-cart" 
                                data-name="${product.name}" 
                                data-price="${product.price}" 
                                data-image="${product.image}">
                            담기
                        </button>
                    </div>
                </div>
            </article>
        `;

        // 생성한 카드를 컨테이너에 하나씩 차곡차곡 넣어줍니다.
        galleryContainer.insertAdjacentHTML('beforeend', cardHTML);
    });

    // ★ [추가] 카드가 화면에 다 그려진 직후, 버튼들에게 실시간 클릭 이벤트 주입하기!
    bindAddToCartEvents();
}

// 5. 버튼을 클릭했을 때 우리의 cart.js에 있는 addToCart 함수와 연결해주는 중매 함수
function bindAddToCartEvents() {
    const cartButtons = document.querySelectorAll('.btn-add-to-cart');
    
    cartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 버튼에 심겨있던 JSON 데이터들을 낚아챕니다.
            const targetButton = e.currentTarget; // 안정적으로 버튼 태그 타겟팅
            const name = targetButton.getAttribute('data-name');
            const price = parseInt(targetButton.getAttribute('data-price'), 10);
            const img = targetButton.getAttribute('data-image');
            
            // 우리가 cart.js 전역 공간(window)에 정교하게 만들어 둔 addToCart 함수 강제 소환!
            if (typeof window.addToCart === 'function') {
                window.addToCart(name, price, img);
            } else {
                console.error('cart.js 파일이 shop.html에 정상적으로 연결되지 않았습니다.');
            }
        });
    });
}

// 페이지가 로드되면 즉시 실행하도록 호출
document.addEventListener('DOMContentLoaded', loadProducts);