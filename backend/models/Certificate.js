const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema(
    {
        certificateId: {
            type: String,
            required: true,
            unique: true
        },

        applicationId: {
            type: String,
            required: true
        },

        issuedOn: {
            type: Date,
            default: Date.now
        },

        status: {
            type: String,
            enum: ["Valid", "Revoked"],
            default: "Valid"
        }
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model("Certificate", certificateSchema);