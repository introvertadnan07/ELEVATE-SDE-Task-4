const express = require("express");

const {
    verifyCertificate
} = require("../controllers/certificateController");

const router = express.Router();

router.get("/verify/:certificateId", verifyCertificate);

module.exports = router;