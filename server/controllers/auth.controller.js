import User from '../models/user';
import { sendMessage } from '../util/mailgun';
import ejs from 'ejs';
import htmlToText from 'html-to-text';
import crypto from 'crypto';
import config from 'config';

export function signup(req, res, next) {
  const email = req.body.email.toLowerCase();

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        errorMessage: 'Error completing signup.',
      });
    }

    if (user) {
      return res.status(400).json({
        errorMessage: 'A user with that email address already exists.',
      });
    }

    const newUser = new User();

    newUser.email = email.toLowerCase();
    newUser.password = newUser.generateHash(req.body.password);
    newUser.userType = 'user';
    newUser.lastLoginTime = new Date();

    newUser.save((err) => {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Error creating new user.',
        });
      }

      const token = newUser.generateJwt();

      return res.status(200).json({
        user: newUser,
        token,
      });
    });
  });
}

export function login(req, res, next) {
  if(!req.body.email || !req.body.password) {
    return res.status(400).json({
      errorMessage: 'Missing email or password.'
    });
  }

  const email = req.body.email.toLowerCase();
  const password = req.body.password;

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(400).json({
        errorMessage: 'Error logging in.'
      });
    }

    if (!user) {
      return res.status(400).json({
        errorMessage: 'A user with that email address was not found.'
      });
    }

    if (!user.validPassword(password)) {
      return res.status(400).json({
        errorMessage: 'Incorrect password.'
      });
    }

    user.lastLoginTime = new Date();

    user.save((err) => {
      const token = user.generateJwt();
      return res.status(200).json({
        user,
        token,
      });
    });
  });
}

export function forgotPassword(req, res, next) {
  if(!req.body.email) {
    return res.status(400).json({
      message: 'Missing email.'
    });
  }

  const email = req.body.email.toLowerCase();

  User.findOne({ email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        errorMessage: 'Error sending password reset email.'
      });
    }

    if (!user) {
      return res.status(400).json({
        errorMessage: 'A user with that email address was not found.'
      });
    }

    //TODO: BASE_URL is undefined locally
    const appUrl = config.get('app.url');
    const resetPath = 'auth/reset-password';
    const passwordResetToken = user.generatePasswordResetToken();

    const resetLink = `${appUrl}/${resetPath}/${passwordResetToken}`;

    ejs.renderFile('server/emailTemplates/forgotPassword.ejs', { resetLink }, {}, function(err, str) {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Error sending password reset email.'
        });
      }

      const html = str;
      const text = htmlToText.fromString(html);

      sendMessage(email, 'Sales Journal Online - Password Reset Link', text, html);

      return res.status(200).json({
        message: 'Password reset email sent!'
      });
    });
  });
}

export function resetPassword(req, res, next) {
  if (!req.body.resetToken || !req.body.password || !req.body.verifyPassword) {
    return res.status(400).json({
      errorMessage: 'Missing reset token, password or verifyPassword.'
    });
  }

  const hashedToken = crypto.createHash('md5').update(req.body.resetToken).digest('hex');

  User.findOne({ passwordResetToken: hashedToken }, (err, user) => {
    if (err) {
      return res.status(400).json({
        errorMessage: 'Error resetting password.'
      });
    }

    if (!user) {
      return res.status(400).json({
        errorMessage: 'Invalid password reset token.'
      });
    }

    if (user.passwordResetExpires < new Date()) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;

      user.save();

      return res.status(400).json({
        errorMessage: 'Password reset token expired.'
      });
    }

    if (req.body.password !== req.body.verifyPassword) {
      return res.status(400).json({
        errorMessage: 'Password and verifyPassword do not match.'
      });
    }

    user.password = user.generateHash(req.body.password);
    user.passwordResetToken = null;
    user.passwordResetExpires = null;

    user.save((err) => {
      if (err) {
        return res.status(400).json({
          errorMessage: 'Error resetting password.',
        });
      }

      return res.status(200).json({
        message: 'Password successfully reset!',
      });
    });
  });
}
