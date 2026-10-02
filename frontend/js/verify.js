const verifyForm = document.getElementById("verifyForm");
const verifyResult = document.getElementById("verifyResult");

const API_BASE_URL = "http://localhost:5000";

verifyForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(verifyForm);

    const id = formData
        .get("id")
        .trim();

    if (!id) {
        verifyResult.innerHTML = `
            <div class="alert error-alert">
                Please enter a Certificate ID.
            </div>
        `;
        return;
    }

    verifyResult.innerHTML = `
        <div class="alert">
            Verifying certificate...
        </div>
    `;

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/certificates/verify/${encodeURIComponent(id)}`
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Certificate not found"
            );
        }

        const message =
            data.status === "Valid"
                ? "Certificate is valid"
                : "Certificate is revoked";

        verifyResult.innerHTML = `
            <section class="card verification-result">

                <div class="verified-banner">

                    <div class="verify-check">
                        ✓
                    </div>

                    <div>

                        <span>
                            Certificate found
                        </span>

                        <h3>
                            ${message}
                        </h3>

                    </div>

                    <span class="status-badge ${
                        data.status === "Valid"
                            ? "success"
                            : "danger"
                    }">
                        ${data.status}
                    </span>

                </div>

                <div class="detail-grid">

                    <div>
                        <span>Name</span>
                        <b>${data.name}</b>
                    </div>

                    <div>
                        <span>Phone</span>
                        <b>${data.phone}</b>
                    </div>

                    <div>
                        <span>Issued On</span>
                        <b>${formatDate(data.issuedOn)}</b>
                    </div>

                    <div>
                        <span>Certificate ID</span>
                        <b>${data.certificateId}</b>
                    </div>

                </div>

            </section>
        `;

    } catch (error) {

        console.error(error);

        verifyResult.innerHTML = `
            <div class="alert error-alert">
                ${error.message}
                Please check the Certificate ID and try again.
            </div>
        `;
    }
});


function formatDate(dateString) {

    if (!dateString) {
        return "N/A";
    }

    return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
}