const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    cartItems: [
        {
            product: {
                type: mongoose.Schema.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            },
            color: String,
            price: {
                type: Number,
                required: true,
                min: 0,
            },
        }
    ],
    taxPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    shippingPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    totalOrderPrice: {
        type: Number,
        required: true,
        min: 0,
    },
    paymentMethod: {
        type: String,
        enum: ['cash', 'card', 'paypal'],
        default: 'cash',
    },
    address: {
        type: String,
        required: true, 
    },
    phone: {
        type: String,
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: Date,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);