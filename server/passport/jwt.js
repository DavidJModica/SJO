import { Strategy, ExtractJwt } from 'passport-jwt';
import config from 'config';
import User from '../models/user';

export default function (passport) {
  passport.use(new Strategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.get('app.jwtKey'),
  },
  (jwt_payload, done) => {
    const id = jwt_payload._id;
    User.findOne({ _id: id }, (err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done('Unauthorized'); // This needs to be handed up above
      }

      return done(null, user);
    });
  }));
}
