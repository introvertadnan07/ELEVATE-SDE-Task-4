const stateSelect = document.getElementById("stateSelect");
const requestForm = document.getElementById("requestForm");

const API_BASE_URL = "http://localhost:5000";

// ======================================
// POPULATE STATE DROPDOWN
// ======================================

STATES.forEach((state) => {
    const option = document.createElement("option");

    option.value = state;
    option.textContent = state;

    stateSelect.appendChild(option);
});


// ======================================
// HANDLE FORM SUBMISSION
// ======================================

requestForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(requestForm);

    const name = formData.get("name")?.trim();
    const phone = formData.get("phone")?.trim();
    const gender = formData.get("gender");
    const state = formData.get("state");

    let city = formData.get("city")?.trim();


    // ======================================
    // FRONTEND VALIDATION
    // ======================================

    if (!name || !phone || !gender || !city || !state) {
        alert("Please complete all fields.");
        return;
    }


    // ======================================
    // PHONE VALIDATION
    // ======================================

    if (!/^\d{10}$/.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return;
    }


    // ======================================
    // NORMALIZE CITY
    // ======================================
    // Example:
    // "Darbhanga, Bihar" + Bihar
    // becomes:
    // "Darbhanga"
    //
    // This prevents:
    // "Darbhanga, Bihar, Bihar"

    const stateSuffix = `, ${state}`;

    if (city.toLowerCase().endsWith(stateSuffix.toLowerCase())) {
        city = city.slice(0, -stateSuffix.length).trim();
    }


    // Remove accidental extra spaces
    city = city.replace(/\s+/g, " ").trim();


    // ======================================
    // SUBMIT TO BACKEND
    // ======================================

    try {

        const response = await fetch(
            `${API_BASE_URL}/api/applications`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name,
                    phone,
                    gender,
                    city,
                    state
                })
            }
        );


        const data = await response.json();


        // ======================================
        // HANDLE BACKEND ERROR
        // ======================================

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to submit application."
            );
        }


        // ======================================
        // REAL APPLICATION ID
        // ======================================

        const applicationId = data.applicationId;


        // ======================================
        // SUCCESS SCREEN
        // ======================================

        document.querySelector(".card").innerHTML = `
            <div class="success-card">

                <div class="success-icon">
                    ✓
                </div>

                <h2>
                    Application submitted successfully!
                </h2>

                <p>
                    Your request has been recorded.
                    Keep your Application ID safe to track its status.
                </p>

                <div class="id-box">
                    <span>Application ID</span>

                    <strong>
                        ${applicationId}
                    </strong>
                </div>

                <div class="success-actions">

                    <a
                        class="btn"
                        href="track.html?id=${encodeURIComponent(applicationId)}"
                    >
                        Track Application
                    </a>

                    <a
                        class="btn secondary"
                        href="request.html"
                    >
                        Submit Another
                    </a>

                </div>

            </div>
        `;

    } catch (error) {

        console.error(
            "Application submission error:",
            error
        );

        alert(
            error.message ||
            "Something went wrong. Please try again."
        );
    }

});