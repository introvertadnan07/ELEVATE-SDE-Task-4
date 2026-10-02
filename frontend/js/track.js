const trackForm = document.getElementById("trackForm");
const trackResult = document.getElementById("trackResult");

const API_BASE_URL = "http://localhost:5000";


trackForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const formData = new FormData(trackForm);

    const id = formData
        .get("id")
        .trim();


    if (!id) {
        trackResult.innerHTML = `
            <div class="alert error-alert">
                Please enter your Application ID.
            </div>
        `;
        return;
    }


    try {

        trackResult.innerHTML = `
            <div class="alert">
                Loading application details...
            </div>
        `;


        const response = await fetch(
            `${API_BASE_URL}/api/applications/track/${encodeURIComponent(id)}`
        );


        const data = await response.json();


        if (!response.ok) {
            throw new Error(
                data.message || "Application not found."
            );
        }


        const application = data.application;


        trackResult.innerHTML = `
            <div class="result-panel">

                <div class="result-head">

                    <div>
                        <span class="muted">
                            Application
                        </span>

                        <h3>
                            ${application.applicationId}
                        </h3>
                    </div>

                    ${createStatus(application.status)}

                </div>


                <div class="detail-grid">

                    <div>
                        <span>Name</span>
                        <b>${application.name}</b>
                    </div>

                    <div>
                        <span>Submission Date</span>
                        <b>
                            ${new Date(application.createdAt)
                                .toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                })}
                        </b>
                    </div>

                    <div>
                        <span>Phone</span>
                        <b>${application.phone}</b>
                    </div>

                    <div>
                        <span>Location</span>
                        <b>
                            ${application.city},
                            ${application.state}
                        </b>
                    </div>

                </div>

            </div>
        `;

    } catch (error) {

        console.error("Track application error:", error);

        trackResult.innerHTML = `
            <div class="alert error-alert">
                ${error.message}
            </div>
        `;
    }

});