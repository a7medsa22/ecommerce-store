
const mongoose = require('mongoose');
const { default: slugify } = require('slugify');

const subCategortSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            require: true,
            unique: true,
            minlength: [2, "It's Too Short name SubCategory"],
            maxlength: [30, "It's Too Long name SubCategory"],
        },
        slug: {
            type: String,
            lowercase: true,
        },
        category: {
            type: mongoose.Schema.ObjectId,
            ref: "category",
            require: true,
        },
    },
    { timeseries: true }
);
module.exports = mongoose.model("SubCategory", subCategortSchema);
