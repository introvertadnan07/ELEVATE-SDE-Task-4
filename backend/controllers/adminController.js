const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Application = require("../models/Application");
const Certificate = require("../models/Certificate");

// ===============================
// ADMIN LOGIN
// ===============================
const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Username and password are required"
            });
        }

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            admin.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password"
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                username: admin.username
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            success: true,
            message: "Admin login successful",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message
        });
    }
};

// ===============================
// GET ALL APPLICATIONS
// ===============================
const getApplications = async (req, res) => {
    try {
        const applications = await Application.find()
            .sort({ submittedAt: -1 });

        res.status(200).json({
            success: true,
            count: applications.length,
            applications: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch applications",
            error: error.message
        });
    }
};

// ===============================
// GET ALL CERTIFICATES
// ===============================
const getCertificates = async (req, res) => {
    try {
        const certificates = await Certificate.find()
            .sort({ issuedOn: -1 });

        const certificatesWithApplicant = await Promise.all(
            certificates.map(async (certificate) => {
                const application = await Application.findOne({
                    applicationId: certificate.applicationId
                });

                return {
                    certificateId: certificate.certificateId,
                    applicationId: certificate.applicationId,
                    name: application ? application.name : "N/A",
                    phone: application ? application.phone : "N/A",
                    city: application ? application.city : "N/A",
                    state: application ? application.state : "N/A",
                    issuedOn: certificate.issuedOn,
                    status: certificate.status
                };
            })
        );

        res.status(200).json({
            success: true,
            count: certificatesWithApplicant.length,
            certificates: certificatesWithApplicant
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch certificates",
            error: error.message
        });
    }
};

// ===============================
// REVOKE CERTIFICATE
// ===============================
const revokeCertificate = async (req, res) => {
    try {
        const { certificateId } = req.params;

        const certificate = await Certificate.findOne({
            certificateId
        });

        if (!certificate) {
            return res.status(404).json({
                success: false,
                message: "Certificate not found"
            });
        }

        if (certificate.status === "Revoked") {
            return res.status(400).json({
                success: false,
                message: "Certificate is already revoked"
            });
        }

        certificate.status = "Revoked";

        await certificate.save();

        res.status(200).json({
            success: true,
            message: "Certificate revoked successfully",
            certificateId: certificate.certificateId,
            status: certificate.status
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to revoke certificate",
            error: error.message
        });
    }
};

// ===============================
// EXPORT FUNCTIONS
// ===============================
module.exports = {
    adminLogin,
    getApplications,
    getCertificates,
    revokeCertificate
};