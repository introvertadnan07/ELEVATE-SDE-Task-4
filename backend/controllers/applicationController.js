const Application = require("../models/Application");
const Certificate = require("../models/Certificate");


// ===============================
// CREATE APPLICATION
// ===============================
const createApplication = async (req, res) => {
    try {
        const {
            name,
            phone,
            gender,
            city,
            state
        } = req.body;

        // Validate required fields
        if (!name || !phone || !gender || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Clean input values
        const cleanName = name.trim();
        const cleanPhone = phone.trim();
        const cleanGender = gender.trim();
        const cleanState = state.trim();

        // Remove state from the end of city if user accidentally enters:
        // "Darbhanga, Bihar"
        // while selecting State = "Bihar"
        let cleanCity = city.trim();

        const statePattern = new RegExp(
            `,\\s*${cleanState.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
            "i"
        );

        cleanCity = cleanCity.replace(statePattern, "").trim();

        // Generate unique Application ID
        const applicationId = `APP-${Date.now()}`;

        // Create application in MongoDB
        const application = await Application.create({
            applicationId,
            name: cleanName,
            phone: cleanPhone,
            gender: cleanGender,
            city: cleanCity,
            state: cleanState,
            status: "Pending"
        });

        // Send response
        res.status(201).json({
            success: true,
            message: "Certificate request submitted successfully",
            applicationId: application.applicationId,
            status: application.status
        });

    } catch (error) {
        console.error("Create application error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to create application",
            error: error.message
        });
    }
};


// ===============================
// TRACK APPLICATION
// ===============================
const trackApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId: applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        res.status(200).json({
            success: true,
            application: {
                applicationId: application.applicationId,
                name: application.name,
                phone: application.phone,
                gender: application.gender,
                city: application.city,
                state: application.state,
                status: application.status,
                createdAt: application.submittedAt
            }
        });

    } catch (error) {
        console.error("Track application error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to track application",
            error: error.message
        });
    }
};


// ===============================
// APPROVE APPLICATION
// ===============================
const approveApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId: applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `Application is already ${application.status}`
            });
        }

        // Change application status
        application.status = "Approved";
        await application.save();

        // Generate unique Certificate ID
        const certificateId = `CERT-${Date.now()}`;

        // Create certificate
        const certificate = await Certificate.create({
            certificateId: certificateId,
            applicationId: application.applicationId,
            status: "Valid"
        });

        res.status(200).json({
            success: true,
            message: "Application approved and certificate issued",
            applicationId: application.applicationId,
            status: application.status,
            certificateId: certificate.certificateId
        });

    } catch (error) {
        console.error("Approve application error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to approve application",
            error: error.message
        });
    }
};


// ===============================
// REJECT APPLICATION
// ===============================
const rejectApplication = async (req, res) => {
    try {
        const { applicationId } = req.params;

        const application = await Application.findOne({
            applicationId: applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Application not found"
            });
        }

        if (application.status !== "Pending") {
            return res.status(400).json({
                success: false,
                message: `Application is already ${application.status}`
            });
        }

        // Change application status
        application.status = "Rejected";
        await application.save();

        res.status(200).json({
            success: true,
            message: "Application rejected",
            applicationId: application.applicationId,
            status: application.status
        });

    } catch (error) {
        console.error("Reject application error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to reject application",
            error: error.message
        });
    }
};


// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
    createApplication,
    trackApplication,
    approveApplication,
    rejectApplication
};