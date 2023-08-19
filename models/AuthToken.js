const mongoose = require('mongoose');

const { Schema } = mongoose;

const authTokenSchema = new Schema({
  email: { type: String, required: true },
  confirmToken: { type: String, required: true },
  tokenExpiry: {
    type: Date,
    required: true,
    default: new Date(new Date().getTime() + 60 * 60 * 1000),
  },
});

const AuthToken = mongoose.model('authToken', authTokenSchema);

module.exports = AuthToken;
