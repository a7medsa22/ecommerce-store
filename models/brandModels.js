const mongoose = require("mongoose");

// eslint-disable-next-line import/newline-after-import
const { Schema } = require("mongoose");
const BrandSchema = new Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, "CategoryRequire !!"],
      minlength: [3, "Too Short Brand name !!"],
      maxlength: [30, "Too long Brand name !!"],
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
// Find and Create and update (findAll in getAll service made manual)
BrandSchema.virtual("imageUrl").get(function () {
  if (this.image) {
    return `${process.env.BASE_URL}/brands/${this.image}`;
  }
  return null;
});
//step 2 create modle
const brandmoudle = mongoose.model("Brand", BrandSchema);

module.exports = brandmoudle;
