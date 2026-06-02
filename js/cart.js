// js/cart.js 최종 무결점 버전

// 1. 공용 비밀 사물함에서 데이터 읽어오기 (페이지 켜지자마자 즉시 접근 가능하게 상단 배치)
let cart = JSON.parse(localStorage.getItem('cafeCart')) || [];

document.addEventListener("DOMContentLoaded", () => {
    // 화면 내부 태그들 낚아채기
    const cartItemsContainer = document.getElementById('cart-items');
    const totalProductPriceEl = document.getElementById('total-product-price');
    const shippingFeeEl = document.getElementById('shipping-fee');
    const finalTotalPriceEl = document.getElementById('final-total-price');

    /* =========================================================
       [기능 A] 장바구니 페이지(cart.html) 전용 렌더링 로직
       ========================================================= */
    function renderCart() {
        if (!cartItemsContainer) return; 
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <p>장바구니가 비어 있습니다. ☕</p>
                    <a href="shop.html" class="shop-link">달콤한 메뉴 담으러 가기 ✨</a>
                </div>
            `;
            updateSummary(0);
            return;
        }

        let html = '';
        cart.forEach((item, index) => {
            html += `
                <div class="cart-item" data-index="${index}">
                    <div class="cart-item-img">
                        <img src="${item.img}" alt="${item.name}">
                    </div>
                    <div class="cart-item-info">
                        <h3 class="cart-item-name">${item.name}</h3>
                        <span class="cart-item-price">${item.price.toLocaleString()}원</span>
                    </div>
                    <div class="cart-item-quantity">
                        <button type="button" class="qty-btn" onclick="changeQty(${index}, -1)">-</button>
                        <span class="qty-text">${item.quantity}</span>
                        <button type="button" class="qty-btn" onclick="changeQty(${index}, 1)">+</button>
                    </div>
                    <button type="button" class="delete-btn" onclick="deleteItem(${index})">❌</button>
                </div>
            `;
        });
        cartItemsContainer.innerHTML = html;
        calculateTotal();
    }

    function calculateTotal() {
        let productTotal = 0;
        cart.forEach(item => {
            productTotal += item.price * item.quantity;
        });
        updateSummary(productTotal);
    }

    function updateSummary(productTotal) {
        if (!totalProductPriceEl || !shippingFeeEl || !finalTotalPriceEl) return;
        
        let shippingFee = (productTotal >= 30000 || productTotal === 0) ? 0 : 3000;
        let finalTotal = productTotal + shippingFee;

        totalProductPriceEl.innerText = `${productTotal.toLocaleString()}원`;
        shippingFeeEl.innerText = shippingFee === 0 ? "무료배송" : `${shippingFee.toLocaleString()}원`;
        finalTotalPriceEl.innerText = `${finalTotal.toLocaleString()}원`;
    }

    // 전역 함수들이 데이터를 바꾸고 나면 화면을 다시 그려주기 위한 공용 통로 연결
    window.refreshCartView = function() {
        renderCart();
    };

    // 장바구니 페이지라면 초기 실행
    renderCart();
});


/* =========================================================
   HTML 버튼들이 즉시 찾을 수 있도록 전역 공간에 완전히 독립 선언
   ========================================================= */

// 수량 조절 함수
window.changeQty = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        window.deleteItem(index);
        return;
    }
    localStorage.setItem('cafeCart', JSON.stringify(cart));
    if (typeof window.refreshCartView === 'function') window.refreshCartView();
};

// 아이템 삭제 함수
window.deleteItem = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('cafeCart', JSON.stringify(cart));
    if (typeof window.refreshCartView === 'function') window.refreshCartView();
};

// 숍 페이지(shop.html)에서 담기 버튼 누를 때 발동하는 함수
window.addToCart = function(productName, productPrice, productImg) {
    let currentCart = JSON.parse(localStorage.getItem('cafeCart')) || [];
    const existingItem = currentCart.find(item => item.name === productName);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        currentCart.push({
            name: productName,
            price: productPrice,
            img: productImg,
            quantity: 1
        });
    }

    localStorage.setItem('cafeCart', JSON.stringify(currentCart));
    cart = currentCart; // 내부 변수 동기화

    if (confirm(`🌸 ${productName}가 장바구니에 담겼습니다!\n장바구니 페이지로 이동하시겠어요?`)) {
        window.location.href = 'cart.html';
    }
};