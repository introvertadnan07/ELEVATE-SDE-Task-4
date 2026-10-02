const express = require("express");

const {
    createApplication,
    trackApplication
} = require("../controllers/applicationController");

const router = express.Router();


// ===============================
// CREATE APPLICATION
// ===============================
router.post("/", createApplication);


// ===============================
// TRACK APPLICATION
// ===============================
router.get("/track/:applicationId", trackApplication);


module.exports = router;