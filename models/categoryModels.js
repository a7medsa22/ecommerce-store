const mongoose = require("mongoose");

// eslint-disable-next-line import/newline-after-import
const { Schema } = require("mongoose");
const CategorySchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "CategoryRequire !!"],
      minlength: [3, "Too Short category name !!"],
      maxlength: [30, "Too long category name !!"],
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    // used to use .vrtual parsing
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
// 🔁 Middleware to generate slug before save
CategorySchema.pre('save', function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }
  next();
});
// Find and Create and update (findAll in getAll service made manual)
CategorySchema.virtual("imageUrl").get(function () {
  return this.image || null;
});


//step 2 create modle
const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = CategoryModel;
