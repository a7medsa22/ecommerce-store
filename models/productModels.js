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
      index: true,
    },
    slug: {
      type: String,
      require: true,
      lowercase: true,
      index: true,
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
      index: true,
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
      index: true,
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
      index: true,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be abrove or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
      index: true,
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

productSchema.index({ category: 1, price: 1 });
productSchema.index({ title: "text", description: "text" });


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
   return this.imageCover || null;
});

productSchema.virtual("imagesUrl").get(function () {
return this.images || [];
});

module.exports = mongoose.model("Product", productSchema);
