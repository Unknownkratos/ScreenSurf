const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema with username and password fields
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true // Ensure username is unique
  },
  password: {
    type: String,
    required: true
  }
});

// Pre-save hook to hash the password before saving it to the database
userSchema.pre('save', async function(next) {
  try {
    if (this.isModified('password') || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error); // Pass error to the next middleware
  }
});

// Method to compare password for login purposes
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error); // Optionally, customize error handling here
  }
};

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
