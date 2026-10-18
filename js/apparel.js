const API = "https://raj-sports-shop.onrender.com/api/products";
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

let products = [];
let quantities = [];

async function loadProducts() {
    try {
        const response = await fetch(API + "/category/Sports Apparel");
        products = await response.json();
        quantities = new Array(products.length).fill(0);
        displayProducts();
        updateCart();
    }
    catch (e) {
        console.log(e);
    }
}

function displayProducts() {
    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    if (products.length === 0) {
        container.innerHTML = "<p>No apparel added yet. Please check back soon.</p>";
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

function increase(index){
    quantities[index]++;
    document.getElementById("qty"+index).innerText = quantities[index];
    updateCart();
}

function decrease(index){
    if(quantities[index] > 0){
        quantities[index]--;
        document.getElementById("qty"+index).innerText = quantities[index];
        updateCart();
    }
}

function updateCart(){
    let cart = document.getElementById("cartItems");
    let total = document.getElementById("totalItems");
    cart.innerHTML = "";
    let totalItems = 0;

    products.forEach((product,index)=>{
        if(quantities[index] > 0){
            cart.innerHTML += `<p>👕 ${product.productName} × ${quantities[index]}</p>`;
            totalItems += quantities[index];
        }
    });

    if(totalItems===0){
        cart.innerHTML="<p>No items selected.</p>";
    }
    total.innerText = totalItems;
}

document.getElementById("search").addEventListener("keyup",function(){
    const value=this.value.toLowerCase();
    const cards=document.querySelectorAll(".product-card");

    cards.forEach(card=>{
        const title=card.querySelector("h3").innerText.toLowerCase();
        card.style.display=title.includes(value)?"block":"none";
    });
});

document.getElementById("sendWhatsApp").addEventListener("click",function(){
    let message="👕 *RAJ SPORTS SHOP APPAREL ORDER* %0A%0A";
    let total=0;

    products.forEach((product,index)=>{
        if(quantities[index]>0){
            message += "✅ "+product.productName+" x "+quantities[index]+"%0A";
            total += quantities[index];
        }
    });

    if(total===0){
        alert("Please select at least one product.");
        return;
    }

    message += "%0ATotal Items : "+total;
    let phone="918825713179";
    window.open("https://wa.me/"+phone+"?text="+message);
});

window.onload = function(){
    loadProducts();
};