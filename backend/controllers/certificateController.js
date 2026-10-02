const Certificate = require("../models/Certificate");
const Application = require("../models/Application");

const verifyCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({ certificateId });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        const application = await Application.findOne({
            applicationId: certificate.applicationId
        });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "Associated application not found"
            });
        }

        res.status(200).json({
            success: true,
            certificateId: certificate.certificateId,
            name: application.name,
            phone: application.phone,
            issuedOn: certificate.issuedOn,
            status: certificate.status
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to verify certificate",
            error: error.message
        });
    }
};

module.exports = {
    verifyCertificate
};