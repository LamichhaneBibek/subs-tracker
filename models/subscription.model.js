import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: { type: String, required: [true, "Name is required"], trim: true, minLenght:2, maxLenght:50 },
    price: { type: Number, required: [true, "Price is required"], min: [0, "Price must be at least 0"] },
    currency: { type: String, enum: ["USD", "EUR", "GBP"], default: "USD" },
    frequency: { type: String, enum: ["daily", "weekly", "monthly", "yearly"], default: "monthly" },
    category: { type: String, enum: ["business", "entertainment", "health", "science", "sports", "technology"], required: [true, "Category is required"] },
    paymentMethod: { type: String, required: [true, "Payment method is required"], trim: true },
    status: { type: String, enum: ["active", "expired", "canceled"], default: "active" },
    startDate: { type: Date, required: [true, "Start date is required"], validate: { validator: function (value) { return value <= new Date(); }, message: "Start date must be in the past" } },
    renewalDate: { type: Date, validate: { validator: function (value) { return value > this.startDate; }, message: "Renewal date must be in the future" } },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "User is required"], index: true }

}, { timestamps: true });

subscriptionSchema.pre("save", function (next) {
    if (!this.renewalDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }

    if(this.renewalDate < new Date()) {
        this.status = "expired";
    }

    next();
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;