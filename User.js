const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    walletAddress: {
        type: String,
        trim: true,
        // unique: true, // Wallet address might not always be unique if users can have multiple accounts with same wallet or change wallets
        sparse: true // Allows null/undefined values if not provided, but if provided, must be unique if unique:true is set
    },
    hasSignedNda: {
        type: Boolean,
        default: false
    },
    docusignEnvelopeId: {
        type: String,
        trim: true
    },
    lastNdaUpdate: {
        type: Date
    },
    // Add other user-related fields as needed, e.g., name, registrationDate, roles
    name: {
        type: String,
        trim: true
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

// Create a text index on email for faster searching if needed, though for unique fields it's often not necessary for simple lookups.
// UserSchema.index({ email: 'text' });

const User = mongoose.model("User", UserSchema);

module.exports = User;

console.log("User model (User.js) created in /home/ubuntu/rms-nft-backend/models/");

