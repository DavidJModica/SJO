import User from '../models/user';
import Entry from '../models/entry';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all users
 * @param req
 * @param res
 * @returns void
 */
export function getUsers(req, res) {
  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    User.find({}).sort('-createdAt').exec((err, users) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({ users });
    });
  });
}

export function getUsersWithEntryCount(req, res) {
  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    Entry.aggregate([
      {
        "$project": {
          "_id": 1,
          "userId": 1
        }
      },
      {
        "$group": {
          "_id": '$userId',
          "count": { "$sum": 1 }
        }
      },
      {"$sort": {"count": -1}}
    ]).then(function (result) {
      return res.json({ result });
    });
  });
}

/**
 * Save a user
 * @param req
 * @param res
 * @returns void
 */
// export function addUser(req, res) {
//   if (!req.body.user.email) {
//     res.status(403).end();
//   }

//   const newUser = new User(req.body.user);

//   // Let's sanitize inputs
//   newUser.email = sanitizeHtml(newUser.email);
//   newUser.password = sanitizeHtml(newUser.password);

//   newUser.save((err, saved) => {
//     if (err) {
//       res.status(500).send(err);
//     }
//     res.json({ user: saved });
//   });
// }

/**
 * Update a user
 * @param req
 * @param res
 * @returns void
 */
export function updateUser(req, res, next) {
  const userId = req.params.user_id;

  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin' && req.user.id != userId) {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    User.findOne({ _id: userId }).exec((err, user) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!user) {
        return res.status(404).json({
          errorMessage: 'User not found.'
        });
      }

      user.email = sanitizeHtml(req.body.user.email);

      user.save((err, saved) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(201).json({ user: saved });
        }
      });
    });
  });
}

/**
 * Get a single user
 * @param req
 * @param res
 * @returns void
 */
export function getUser(req, res) {
  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin' && req.user.id != req.params.user_id) {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    User.findOne({ _id: req.params.user_id }).exec((err, user) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({ user });
    });
  });
}

/**
 * Delete a user
 * @param req
 * @param res
 * @returns void
 */
export function deleteUser(req, res) {
  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    User.findOne({ _id: req.params.user_id }).exec((err, user) => {
      if (err) {
        return res.status(500).send(err);
      }

      user.remove(() => {
        return res.status(200).end();
      });
    });
  });
}
