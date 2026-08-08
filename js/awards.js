const API = "http://localhost:8080/api/products";

let products = [];
let quantities = [];

// ===============================
// LOAD PRODUCTS
// ===============================
async function loadProducts() {

    try {

        const response = await fetch(API + "/category/Awards");

        products = await response.json();

        quantities = new Array(products.length).fill(0);

        displayProducts();

        updateCart();

    } catch (e) {

        console.log(e);

    }

}

// ===============================
// DISPLAY PRODUCTS
// ===============================
function displayProducts() {

    const container = document.getElementById("productsContainer");

    container.innerHTML = "";

    products.forEach((product, index) => {

        container.innerHTML += `
            <div class="product-card">

                <img src="${product.imageUrl}" alt="${product.productName}">

                <h3>${product.productName}</h3>

                <p class="price">₹${product.price}</p>

                <p class="stock">Available</p>

                <div class="quantity">

                    <button onclick="decrease(${index})">-</button>

                    <span id="qty${index}">0</span>

                    <button onclick="increase(${index})">+</button>

                </div>

            </div>
        `;

    });

}

// ===============================
// INCREASE
// ===============================
function increase(index){

    quantities[index]++;

    document.getElementById("qty"+index).innerText = quantities[index];

    updateCart();

}

// ===============================
// DECREASE
// ===============================
function decrease(index){

    if(quantities[index] > 0){

        quantities[index]--;

        document.getElementById("qty"+index).innerText = quantities[index];

        updateCart();

    }

}

// ===============================
// UPDATE CART
// ===============================
function updateCart(){

    let cart = document.getElementById("cartItems");

    let total = document.getElementById("totalItems");

    cart.innerHTML = "";

    let totalItems = 0;

    products.forEach((product,index)=>{

        if(quantities[index] > 0){

            cart.innerHTML +=
            `<p>🏆 ${product.productName} × ${quantities[index]}</p>`;

            totalItems += quantities[index];

        }

    });

    if(totalItems===0){

        cart.innerHTML="<p>No items selected.</p>";

    }

    total.innerText=totalItems;

}

// ===============================
// SEARCH
// ===============================
document.getElementById("search")
.addEventListener("keyup",function(){

    const value=this.value.toLowerCase();

    const cards=document.querySelectorAll(".product-card");

    cards.forEach(card=>{

        const title=card.querySelector("h3").innerText.toLowerCase();

        if(title.includes(value))

            card.style.display="block";

        else

            card.style.display="none";

    });

});

// ===============================
// WHATSAPP
// ===============================
document.getElementById("sendWhatsApp")
.addEventListener("click",function(){

    let message="🏆 *RAJ SPORTS SHOP - AWARDS ORDER* %0A%0A";

    let total=0;

    products.forEach((product,index)=>{

        if(quantities[index]>0){

            message+="✅ "+product.productName+
            " x "+quantities[index]+"%0A";

            total+=quantities[index];

        }

    });

    if(total===0){

        alert("Please select at least one product.");

        return;

    }

    message+="%0ATotal Items : "+total;

    let phone="918825713179";

    window.open("https://wa.me/"+phone+"?text="+message);

});

// ===============================
// PAGE LOAD
// ===============================
window.onload=()=>{

    loadProducts();

};