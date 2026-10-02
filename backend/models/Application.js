const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
    {
        applicationId: {
            type: String,
            required: true,
            unique: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        phone: {
            type: String,
            required: true,
            trim: true
        },

        gender: {
            type: String,
            required: true,
            enum: ["Male", "Female", "Other"]
        },

        city: {
            type: String,
            required: true,
            trim: true
        },

        state: {
            type: String,
            required: true,
            trim: true
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },

        submittedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: false
    }
);

module.exports = mongoose.model("Application", applicationSchema);