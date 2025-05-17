const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose"); // Import Mongoose

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware to parse JSON bodies and keep rawBody for webhook verification
app.use(express.json({ verify: (req, res, buf) => { req.rawBody = buf; } }));
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Database Connection
const connectDB = async () => {
    try {
        if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is not defined in .env file. Cannot connect to database.");
            process.exit(1);
        }
        await mongoose.connect(process.env.DATABASE_URL, {
            // useNewUrlParser: true, // Deprecated
            // useUnifiedTopology: true, // Deprecated
            // useCreateIndex: true, // Deprecated
            // useFindAndModify: false // Deprecated
        });
        console.log("MongoDB connected successfully.");
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1); // Exit process with failure
    }
};
connectDB(); // Call the function to connect to the database

// Basic route for testing
app.get("/", (req, res) => {
    res.send("RMS NFT Backend is running.");
});

// Import and use routes
const docusignEventsRouter = require("./routes/docusignEvents");
const docusignActionsRouter = require("./routes/docusignActions");
const userRoutes = require("./routes/userRoutes"); // Import user routes

app.use("/api/docusign", docusignEventsRouter);
app.use("/api/docusign", docusignActionsRouter);
app.use("/api/users", userRoutes); // Mount user routes

// TODO: Add other routes for roadmap, announcements, admin panel, etc.

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    // Ensure environment variables for DocuSign are mentioned if not set
    if (!process.env.DOCUSIGN_WEBHOOK_SECRET) {
        console.warn("DOCUSIGN_WEBHOOK_SECRET is not set in .env file. Webhook verification will fail.");
    }
    if (!process.env.DOCUSIGN_INTEGRATION_KEY || !process.env.DOCUSIGN_USER_ID || !process.env.DOCUSIGN_ACCOUNT_ID || !process.env.DOCUSIGN_PRIVATE_KEY || !process.env.DOCUSIGN_TEMPLATE_ID) {
        console.warn("One or more core DocuSign API environment variables (INTEGRATION_KEY, USER_ID, ACCOUNT_ID, PRIVATE_KEY, TEMPLATE_ID) are not set. Signing initiation will fail.");
    }
    // DATABASE_URL warning is handled by connectDB now
     if (!process.env.JWT_SECRET) {
        console.warn("JWT_SECRET is not set in .env file. Admin authentication will be insecure.");
    }
});

console.log("Standard server.js file updated with MongoDB connection logic, docusignActions route, and userRoutes.");

