const API = "https://raj-sports-shop.onrender.com/api/products";
const UPLOAD_API = "https://raj-sports-shop.onrender.com/api/upload";
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

let editingId = null;

const form = document.getElementById("productForm");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const formTitle = document.getElementById("formTitle");
const currentImagePreview = document.getElementById("currentImagePreview");

function getAdminToken() {
    const token = localStorage.getItem("adminToken");
    if (!token) {
        window.location.replace("login.html");
        return null;
    }
    return token;
}

function getAuthHeaders() {
    const token = getAdminToken();
    if (!token) return null;
    return {
        "Authorization": "Bearer " + token
    };
}

async function loadProducts() {
    try {
        const response = await fetch(API);
        if (!response.ok) {
            throw new Error("Failed to load products: " + response.status);
        }
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        alert("Could not load products. Check that the backend is running.");
    }
}

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
            <td>
                <img src="${getFullImageUrl(product.imageUrl)}" class="table-img" width="60">
            </td>
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

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
        const imageFile = document.getElementById("image").files[0];
        let imageUrl = currentImagePreview.src && currentImagePreview.style.display !== "none" ? currentImagePreview.src : "";

        if (imageFile) {
            const formData = new FormData();
            formData.append("file", imageFile);

            const uploadResponse = await fetch(UPLOAD_API, {
                method: "POST",
                headers: authHeaders,
                body: formData
            });

            if (!uploadResponse.ok) {
                alert("Image upload failed (status " + uploadResponse.status + "). Product was not saved.");
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
                headers: {
                    ...authHeaders,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                alert("Product was not added. Server status: " + response.status);
                return;
            }
            alert("Product Added");
        } else {
            response = await fetch(API + "/" + editingId, {
                method: "PUT",
                headers: {
                    ...authHeaders,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(product)
            });

            if (!response.ok) {
                alert("Product was not updated. Server status: " + response.status);
                return;
            }
            alert("Product Updated");
            resetFormToAddMode();
        }

        form.reset();
        currentImagePreview.style.display = "none";
        await loadProducts();

    } catch (error) {
        console.error(error);
        alert("Request failed. Check the backend connection.");
    }
});

async function deleteProduct(id) {
    if (!confirm("Delete Product?")) return;
    const authHeaders = getAuthHeaders();
    if (!authHeaders) return;

    try {
        const response = await fetch(API + "/" + id, {
            method: "DELETE",
            headers: authHeaders
        });

        if (!response.ok) {
            alert("Delete failed. Server status: " + response.status);
            return;
        }

        alert("Product Deleted");
        await loadProducts();
    } catch (error) {
        console.error(error);
        alert("Could not delete product. Check the backend connection.");
    }
}

async function editProduct(id) {
    try {
        const response = await fetch(API + "/" + id);
        if (!response.ok) {
            alert("Could not load product. Server status: " + response.status);
            return;
        }

        const product = await response.json();
        editingId = id;

        document.getElementById("productName").value = product.productName;
        document.getElementById("price").value = product.price;
        document.getElementById("category").value = product.category;
        document.getElementById("description").value = product.description;

        if (product.imageUrl) {
            currentImagePreview.src = getFullImageUrl(product.imageUrl);
            currentImagePreview.style.display = "inline-block";
        } else {
            currentImagePreview.style.display = "none";
        }

        formTitle.innerText = "Edit Product";
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Update Product';
        cancelEditBtn.style.display = "inline-block";
        window.scrollTo({ top: 0, behavior: "smooth" });

    } catch (error) {
        console.error(error);
        alert("Could not load product. Check the backend connection.");
    }
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

document.getElementById("searchBox").addEventListener("keyup", async function () {
    const keyword = this.value.trim();
    if (keyword === "") {
        await loadProducts();
        return;
    }

    try {
        const response = await fetch(API + "/search?keyword=" + encodeURIComponent(keyword));
        if (!response.ok) throw new Error("Search failed: " + response.status);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        alert("Product search failed.");
    }
});

document.getElementById("filterCategory").addEventListener("change", async function () {
    const category = this.value;
    if (category === "All") {
        await loadProducts();
        return;
    }

    try {
        const response = await fetch(API + "/category/" + encodeURIComponent(category));
        if (!response.ok) throw new Error("Category filter failed: " + response.status);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error(error);
        alert("Could not filter products.");
    }
});

window.onload = function () {
    if (!getAdminToken()) return;
    loadProducts();
};