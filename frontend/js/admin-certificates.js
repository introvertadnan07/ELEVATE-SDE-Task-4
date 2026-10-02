const certificateRows = document.getElementById("certificateRows");
const certificateCount = document.getElementById("certificateCount");

const API_BASE_URL = "http://localhost:5000";

async function loadCertificates() {
    try {
        const token =
    localStorage.getItem("adminToken") ||
    sessionStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "admin-login.html";
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/admin/certificates`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load certificates"
            );
        }

        const certificates = data.certificates || [];

        certificateCount.textContent =
            `${certificates.length} certificates`;

        if (certificates.length === 0) {
            certificateRows.innerHTML = `
                <tr>
                    <td colspan="8">
                        No certificates found.
                    </td>
                </tr>
            `;
            return;
        }

        certificateRows.innerHTML = certificates.map(certificate => `
            <tr>
                <td>
                    <b>${certificate.certificateId}</b>
                </td>

                <td>${certificate.name}</td>

                <td>${certificate.phone}</td>

                <td>${certificate.city}</td>

                <td>${certificate.state}</td>

                <td>
                    ${formatDate(certificate.issuedOn)}
                </td>

                <td>
                    ${createStatus(certificate.status)}
                </td>

                <td>
                    <button
                        class="revoke"
                        data-id="${certificate.certificateId}"
                        ${certificate.status === "Revoked" ? "disabled" : ""}
                    >
                        Revoke
                    </button>
                </td>
            </tr>
        `).join("");

    } catch (error) {
        console.error(error);

        certificateRows.innerHTML = `
            <tr>
                <td colspan="8">
                    <div class="alert error-alert">
                        ${error.message}
                    </div>
                </td>
            </tr>
        `;
    }
}


async function revokeCertificate(certificateId, button) {
    try {
        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "admin-login.html";
            return;
        }

        button.disabled = true;

        const response = await fetch(
            `${API_BASE_URL}/api/admin/certificates/${certificateId}/revoke`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to revoke certificate"
            );
        }

        await loadCertificates();

    } catch (error) {
        console.error(error);

        alert(error.message);

        await loadCertificates();
    }
}


certificateRows.addEventListener("click", event => {
    const button = event.target.closest("button");

    if (!button || button.disabled) {
        return;
    }

    const certificateId = button.dataset.id;

    if (!certificateId) {
        return;
    }

    revokeCertificate(certificateId, button);
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


loadCertificates();