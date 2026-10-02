const loginForm = document.getElementById("loginForm");
const loginError = document.getElementById("loginError");

const API_BASE_URL = "http://localhost:5000";

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(loginForm);

    const username = formData.get("username").trim();
    const password = formData.get("password");

    loginError.innerHTML = "";

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Invalid credentials");
        }

        // Save JWT token
        localStorage.setItem("adminToken", data.token);
        sessionStorage.setItem("adminToken", data.token);

        // Go to admin applications
        window.location.href = "admin-applications.html";

    } catch (error) {

        loginError.innerHTML = `
            <div class="alert error-alert">
                ${error.message}
            </div>
        `;
    }
});