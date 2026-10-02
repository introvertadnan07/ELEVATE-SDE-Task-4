const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("../models/Admin");

const createOrUpdateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("MongoDB connected");

        const username = "admin";
        const password = "Admin@123";

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.findOne({ username });

        if (admin) {
            admin.password = hashedPassword;
            await admin.save();

            console.log("Admin password updated successfully");
        } else {
            await Admin.create({
                username,
                password: hashedPassword
            });

            console.log("Admin created successfully");
        }

        console.log("Username:", username);
        console.log("Password:", password);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error("Failed:", error.message);
        process.exit(1);
    }
};

createOrUpdateAdmin();