const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); 
const { Schema } = require("mongoose");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User Name Require !!"],
      minlength: [3, "Too Short User name !!"],
      // "  ahmed " => "ahmed"
      trim: true,
    },
    // A and B => shoping.com/a-and-b
    slug: {
      type: String,
      lowercase: true,
    },
    phone: String,
    profileImage: String,
    email: {
      type: String,
      required: [true, "Email Required"],
      unique: true,
      lowercase: true,
      index:true,

    },
    password: {
      type: String,
      required: [true, "password Rquired"],
      minlength: [6, "Too Short Password"],
      select: false,
    },
    passwordResetCode: {
      type: String,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetVerified: Boolean,
    passwordResetExpires: Date,

    role: {
      type: String,
      enum: ["user", "manager", "admin"],
      default: "user",
    },
    active: {
      type: Boolean,
      default: true,
    },
    // children relation / 1 to many orders  

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],

      addresses: [
      {
          id: { type: mongoose.Schema.Types.ObjectId },
          alias: String,
          details: String,
          phone: String,
          city: String,
          postalCode: String,
      },
    ],
  },
  {
    timestamps: true,
    // used to use .vrtual parsing
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id; // remove string version of _id
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: function (doc, ret) {
        delete ret.id;
        delete ret.password;
        return ret;
      },
    },
  }
); 
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});


// Instance method to check if entered password is correct
userSchema.methods.correctPassword = async function (candidatePassword, userPassword)
{
  return await bcrypt.compare(candidatePassword, userPassword);
  
};

// Find and Create and update (findAll in getAll service made manual)
userSchema.virtual("profileImageUrl").get(function () {
  return this.profileImage || null;
});
//step 2 create modle
const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
