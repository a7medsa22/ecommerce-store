const mongoose = require("mongoose");
const { image } = require("qr-image");
const Category = require('../models/categoryModels');
const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
      trim: true,
      minlength: [3, "Too Short product Tilte"],
      maxlength: [100, "Too Long product Title"],
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
    },
    description: {
      type: String,
      require: true,
      minlength: [50, "Too Short product describtion"],
    },
    quantity: {
      type: Number,
      require: true,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      require: true,
      max: [200000, "Too Long product price"],
    },
    priceAfterDiscount: {
      type: Number,
      max: [200000, "Too Long product price"],
    },

    colors: [String],

    imageCover: {
      type: String,
      require: true,
    },
    images: [String],

    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      require: true,
    },
    subcategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be abrove or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
  },
  //
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id; // remove string version of _id
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
        return ret;
      },
    },
  }
);
productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});


// mongoose MiddleWare 
productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name-_id",
  });

  next()
});

productSchema.virtual("imageCoverUrl").get(function () {
  if (this.imageCover) {
    return `${process.env.BASE_URL}/products/${this.imageCover}`;
  }
  return null;
});

productSchema.virtual("imagesUrl").get(function () {
  if (this.images && Array.isArray(this.images)) {
    return this.images.map((img) => `${process.env.BASE_URL}/products/${img}`);
  } 
  return [];
});

module.exports = mongoose.model("Product", productSchema);
