const applicationRows =
    document.getElementById("applicationRows");

const applicationCount =
    document.getElementById("applicationCount");

const API_BASE_URL = "http://localhost:5000";


async function loadApplications() {

    try {

        const token = localStorage.getItem("adminToken");

        if (!token) {
            window.location.href = "admin-login.html";
            return;
        }

        const response = await fetch(
            `${API_BASE_URL}/api/admin/applications`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to load applications"
            );
        }

        const applications = data.applications || [];

        applicationCount.textContent =
            `${applications.length} applications`;

        if (applications.length === 0) {
            applicationRows.innerHTML = `
                <tr>
                    <td colspan="8">
                        No applications found.
                    </td>
                </tr>
            `;
            return;
        }

        applicationRows.innerHTML = applications
            .map((application) => {

                return `
                    <tr>

                        <td>
                            <b>${application.applicationId}</b>
                        </td>

                        <td>
                            ${application.name}
                        </td>

                        <td>
                            ${application.phone}
                        </td>

                        <td>
                            ${application.gender}
                        </td>

                        <td>
                            ${application.city}
                        </td>

                        <td>
                            ${application.state}
                        </td>

                        <td>
                            ${createStatus(application.status)}
                        </td>

                        <td>

                            <div class="action-buttons">

                                <button
                                    ${
                                        application.status !== "Pending"
                                            ? "disabled"
                                            : ""
                                    }
                                    data-id="${application.applicationId}"
                                    data-action="approve"
                                >
                                    Issue
                                </button>

                                <button
                                    class="reject"
                                    ${
                                        application.status !== "Pending"
                                            ? "disabled"
                                            : ""
                                    }
                                    data-id="${application.applicationId}"
                                    data-action="reject"
                                >
                                    Reject
                                </button>

                            </div>

                        </td>

                    </tr>
                `;
            })
            .join("");

    } catch (error) {

        console.error(error);

        applicationRows.innerHTML = `
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


applicationRows.addEventListener("click", async (event) => {

    const button = event.target.closest("button");

    if (!button || button.disabled) {
        return;
    }

    const applicationId = button.dataset.id;
    const action = button.dataset.action;

    const token = localStorage.getItem("adminToken");

    if (!token) {
        window.location.href = "admin-login.html";
        return;
    }

    try {

        button.disabled = true;

        const endpoint =
            action === "approve"
                ? `/api/admin/applications/${applicationId}/approve`
                : `/api/admin/applications/${applicationId}/reject`;

        const response = await fetch(
            `${API_BASE_URL}${endpoint}`,
            {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Action failed"
            );
        }

        await loadApplications();

    } catch (error) {

        console.error(error);

        alert(error.message);

        await loadApplications();
    }
});


loadApplications();