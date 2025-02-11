import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: { type: String, required: [true, "Email is required"], trim: true, unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, "Please enter a valid email"] },
    password: { type: String, required: [true, "Password is required"], minLength: [6, "Password must be at least 6 characters"] }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;