const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAccountConfirmed: { type: Boolean, required: true, default: false },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
