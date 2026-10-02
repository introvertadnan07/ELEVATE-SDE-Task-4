const express = require("express");

const {
    adminLogin,
    getApplications,
    getCertificates,
    revokeCertificate
} = require("../controllers/adminController");

const {
    approveApplication,
    rejectApplication
} = require("../controllers/applicationController");

const protectAdmin = require("../middleware/authMiddleware");

const router = express.Router();


// ===============================
// ADMIN LOGIN — PUBLIC
// ===============================
router.post("/login", adminLogin);


// ===============================
// ADMIN APPLICATIONS — PROTECTED
// ===============================
router.get(
    "/applications",
    protectAdmin,
    getApplications
);


// ===============================
// APPROVE APPLICATION — PROTECTED
// ===============================
router.patch(
    "/applications/:applicationId/approve",
    protectAdmin,
    approveApplication
);


// ===============================
// REJECT APPLICATION — PROTECTED
// ===============================
router.patch(
    "/applications/:applicationId/reject",
    protectAdmin,
    rejectApplication
);


// ===============================
// ADMIN CERTIFICATES — PROTECTED
// ===============================
router.get(
    "/certificates",
    protectAdmin,
    getCertificates
);


// ===============================
// REVOKE CERTIFICATE — PROTECTED
// ===============================
router.get(
    "/certificates/:certificateId/revoke",
    protectAdmin,
    revokeCertificate
);


module.exports = router;