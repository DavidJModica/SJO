import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import config from 'config';

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  passwordResetToken: { type: String },
  passwordResetExpires: { type: Date },
  lastLoginTime: { type: Date },
  userType: {
    type: String,
    enum: ['user', 'admin']
  },

  facebook: String,
  twitter: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  steam: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  }
}, { timestamps: true });

userSchema.methods.generateHash = password => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.methods.generateJwt = function() {
  let expiry = new Date();
  expiry.setDate(expiry.getDate() + 1);

  return jwt.sign({
    _id: this._id,
    email: this.email,
    userType: this.userType,
    profile: this.profile,
    exp: parseInt(expiry.getTime() / 1000),
  }, config.get('app.jwtKey'));
};

userSchema.methods.generatePasswordResetToken = function() {
  const passwordResetToken = crypto.randomBytes(60).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
  this.passwordResetToken = crypto.createHash('md5').update(passwordResetToken).digest('hex');

  let expirationDate = new Date();
  this.passwordResetExpires = expirationDate.setHours(expirationDate.getHours() + 4);

  this.save();

  return passwordResetToken;
}

export default mongoose.model('User', userSchema);
