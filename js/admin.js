const API = "http://localhost:8080/api/products";
const UPLOAD_API = "http://localhost:8080/api/upload";

let editingId = null;

const form = document.getElementById("productForm");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const currentImagePreview = document.getElementById("currentImagePreview");

// ==========================
// LOAD PRODUCTS
// ==========================
async function loadProducts() {
    const response = await fetch(API);
    const products = await response.json();
    renderProducts(products);
}

// ==========================
// RENDER TABLE
// ==========================
function renderProducts(products) {

    const table = document.getElementById("productTable");
    table.innerHTML = "";

    let equipment = 0;
    let apparel = 0;
    let awards = 0;

    products.forEach(product => {

        if (product.category === "Equipment") equipment++;
        else if (product.category === "Sports Apparel") apparel++;
        else awards++;

        table.innerHTML += `
        <tr>
            <td>${product.id}</td>
            <td><img src="${product.imageUrl || ''}" class="table-img" width="60"></td>
            <td>${product.productName}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>Available</td>
            <td>
                <button type="button" onclick="editProduct(${product.id})">Edit</button>
                <button type="button" onclick="deleteProduct(${product.id})">Delete</button>
            </td>
        </tr>
        `;
    });

    document.getElementById("equipmentCount").innerText = equipment;
    document.getElementById("apparelCount").innerText = apparel;
    document.getElementById("awardCount").innerText = awards;
    document.getElementById("totalCount").innerText = products.length;
}

// ==========================
// ADD / UPDATE PRODUCT
// ==========================
form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const imageFile = document.getElementById("image").files[0];

    let imageUrl = currentImagePreview.src && currentImagePreview.style.display !== "none"
        ? currentImagePreview.src
        : "";

    if (imageFile) {

        const formData = new FormData();
        formData.append("file", imageFile);

        const uploadResponse = await fetch(UPLOAD_API, {
            method: "POST",
            body: formData
        });

        if (!uploadResponse.ok) {
            alert("❌ Image upload failed (status " + uploadResponse.status + "). Product was NOT saved. Please try again.");
            return;
        }

        imageUrl = await uploadResponse.text();
    }

    if (!imageUrl && editingId === null) {
        alert("Please choose a product photo.");
        return;
    }

    const product = {
    productName: document.getElementById("productName").value,
    price: parseFloat(document.getElementById("price").value),
    category: document.getElementById("category").value,
    description: document.getElementById("description").value,
    imageUrl: imageUrl,
    stock: 100
};

    let response;

    if (editingId === null) {

        response = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            alert("❌ Product was NOT added. Server said: " + response.status + " " + response.statusText);
            return;
        }

        alert("✅ Product Added");

    } else {

        response = await fetch(API + "/" + editingId, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        });

        if (!response.ok) {
            alert("❌ Product was NOT updated. Server said: " + response.status + " " + response.statusText);
            return;
        }

        alert("✅ Product Updated");

        resetFormToAddMode();
    }

    form.reset();
    currentImagePreview.style.display = "none";
    loadProducts();
});

// ==========================
// DELETE
// ==========================
async function deleteProduct(id) {
    if (confirm("Delete Product?")) {

        const response = await fetch(API + "/" + id, { method: "DELETE" });

        if (!response.ok) {
            alert("❌ Delete failed. Server said: " + response.status);
            return;
        }

        loadProducts();
    }
}

// ==========================
// EDIT
// ==========================
async function editProduct(id) {

    const response = await fetch(API + "/" + id);

    if (!response.ok) {
        alert("❌ Could not load product for editing. Server said: " + response.status);
        return;
    }

    const product = await response.json();

    editingId = id;

    document.getElementById("productName").value = product.productName;
    document.getElementById("price").value = product.price;
    document.getElementById("category").value = product.category;
    document.getElementById("description").value = product.description;

    if (product.imageUrl) {
        currentImagePreview.src = product.imageUrl;
        currentImagePreview.style.display = "inline-block";
    } else {
        currentImagePreview.style.display = "none";
    }

    formTitle.innerText = "Edit Product";
    submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Update Product';
    cancelEditBtn.style.display = "inline-block";

    window.scrollTo({ top: 0, behavior: "smooth" });
}

function resetFormToAddMode() {
    editingId = null;
    formTitle.innerText = "Add New Product";
    submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Add Product';
    cancelEditBtn.style.display = "none";
    currentImagePreview.style.display = "none";
}

cancelEditBtn.addEventListener("click", function () {
    form.reset();
    resetFormToAddMode();
});

// ==========================
// SEARCH
// ==========================
document.getElementById("searchBox").addEventListener("keyup", async function () {

    const keyword = this.value;

    if (keyword === "") {
        loadProducts();
        return;
    }

    const response = await fetch(API + "/search?keyword=" + keyword);
    const products = await response.json();
    renderProducts(products);
});

// ==========================
// CATEGORY FILTER
// ==========================
document.getElementById("filterCategory").addEventListener("change", async function () {

    const category = this.value;

    if (category === "All") {
        loadProducts();
        return;
    }

    const response = await fetch(API + "/category/" + category);
    const products = await response.json();
    renderProducts(products);
});

// ==========================
// PAGE LOAD
// ==========================
window.onload = loadProducts;