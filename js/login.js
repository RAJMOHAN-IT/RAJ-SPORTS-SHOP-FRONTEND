
const LOGIN_API = "https://raj-sports-shop.onrender.com/api/admin/login";

const loginForm = document.getElementById("loginForm");
const loginButton = document.getElementById("loginButton");
const message = document.getElementById("message");

// If a token already exists, go to the dashboard.
// The dashboard will validate access in the next step.


loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    loginButton.disabled = true;
    loginButton.textContent = "Logging in...";
    message.style.color = "#555";
    message.textContent = "";

    try {
        const response = await fetch(LOGIN_API, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok || !data.token) {
            throw new Error(data.message || "Invalid email or password");
        }

        // Save the JWT returned by the backend.
        localStorage.setItem("adminToken", data.token);

        message.style.color = "green";
        message.textContent = "Login successful!";

        window.location.replace("admin.html");

    } catch (error) {
        message.style.color = "#b91c1c";
        message.textContent =
            error.message === "Failed to fetch"
                ? "Cannot connect to the server. Check that the backend is running."
                : error.message;
    } finally {
        loginButton.disabled = false;
        loginButton.textContent = "Login";
    }
});
