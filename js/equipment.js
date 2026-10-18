// ==========================================
// CONFIG
// ==========================================

const API = "https://raj-sports-shop.onrender.com/api/products/category/Equipment";
const BACKEND_URL = "https://raj-sports-shop.onrender.com";

function getFullImageUrl(url) {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
        if (url.includes("localhost:8080")) {
            return url.replace("http://localhost:8080", BACKEND_URL);
        }
        return url;
    }
    return url.startsWith("/") ? BACKEND_URL + url : BACKEND_URL + "/" + url;
}

const WHATSAPP_NUMBER = "918825713179";

let products = [];       
let quantities = [];     

// ==========================================
// LOAD PRODUCTS FROM BACKEND
// ==========================================

async function loadProducts() {
    try {
        const response = await fetch(API);
        products = await response.json();
        quantities = new Array(products.length).fill(0);

        renderProductCards();
        updateCart();
    } catch (e) {
        console.log(e);
    }
}

// ==========================================
// RENDER PRODUCT CARDS
// ==========================================

function renderProductCards() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No equipment added yet. Please check back soon.</p>";
        return;
    }

    products.forEach((product, index) => {
        container.innerHTML += `
        <div class="product-card">
            <img src="${getFullImageUrl(product.imageUrl)}" alt="${product.productName}">
            <h3>${product.productName}</h3>
            <p class="price">₹${product.price}</p>
            <p class="stock">In Stock</p>
            <div class="quantity">
                <button onclick="decrease(${index})">-</button>
                <span id="qty${index}">0</span>
                <button onclick="increase(${index})">+</button>
            </div>
        </div>
        `;
    });
}

// ==========================================
// INCREASE / DECREASE QUANTITY
// ==========================================

function increase(index) {
    quantities[index]++;
    document.getElementById("qty" + index).innerText = quantities[index];
    updateCart();
}

function decrease(index) {
    if (quantities[index] > 0) {
        quantities[index]--;
        document.getElementById("qty" + index).innerText = quantities[index];
        updateCart();
    }
}

// ==========================================
// UPDATE CART SUMMARY
// ==========================================

function updateCart() {
    let cart = document.getElementById("cartItems");
    let total = document.getElementById("totalItems");

    cart.innerHTML = "";
    let totalItems = 0;

    for (let i = 0; i < products.length; i++) {
        if (quantities[i] > 0) {
            let item = document.createElement("p");
            item.innerHTML = "🏅 " + products[i].productName + " × " + quantities[i];
            cart.appendChild(item);
            totalItems += quantities[i];
        }
    }

    if (totalItems === 0) {
        cart.innerHTML = "<p>No items selected.</p>";
    }

    total.innerText = totalItems;
}

// ==========================================
// SEARCH
// ==========================================

document.getElementById("search").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const cards = document.querySelectorAll(".product-card");

    cards.forEach(card => {
        const title = card.querySelector("h3").innerText.toLowerCase();
        card.style.display = title.includes(value) ? "block" : "none";
    });
});

// ==========================================
// SEND TO WHATSAPP
// ==========================================

document.getElementById("sendWhatsApp").addEventListener("click", function () {
    let message = "🏆 *RAJ SPORTS SHOP ORDER* %0A%0A";
    let total = 0;

    for (let i = 0; i < products.length; i++) {
        if (quantities[i] > 0) {
            message += "✅ " + products[i].productName + " x " + quantities[i] + "%0A";
            total += quantities[i];
        }
    }

    if (total === 0) {
        alert("Please select at least one product.");
        return;
    }

    message += "%0ATotal Items : " + total;

    let url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + message;
    window.open(url, "_blank");
});

// ==========================================
// ACTIVE NAVBAR
// ==========================================

const links = document.querySelectorAll(".navbar a");
links.forEach(link => {
    link.addEventListener("click", function () {
        links.forEach(a => a.classList.remove("active"));
        this.classList.add("active");
    });
});

// ==========================================
// PAGE LOAD
// ==========================================

window.onload = function () {
    loadProducts();
};