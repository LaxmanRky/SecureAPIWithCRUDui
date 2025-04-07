/**
 * File: User.js
 * Student's Name: Manoj Bishwakarma, Laxman Rokaya
 * StudentID: 200544391, 200544400
 * Date: April 6, 2024
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

/**
 * User Schema - defines the structure for user documents in MongoDB
 * @typedef {Object} UserSchema
 * @property {string} username - Unique username for the user
 * @property {string} email - Unique email address for the user
 * @property {string} password - Hashed password for the user
 * @property {Date} createdAt - Timestamp when the user was created
 * @property {Date} updatedAt - Timestamp when the user was last updated
 */
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save middleware to hash the user's password before saving
 * @param {Function} next - Mongoose middleware next function
 * @returns {void}
 */
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare a candidate password with the user's hashed password
 * @param {string} candidatePassword - The plain text password to compare
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
