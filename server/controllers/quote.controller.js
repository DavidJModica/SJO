import Quote from '../models/quote';
import User from '../models/user';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get a random quote
 * @param req
 * @param res
 * @returns void
 */
export function getRandomQuote(req, res, next) {
  Quote.count().exec(function (err, count) {
    if (err) {
      return res.status(500).send(err);
    }

    var random = Math.floor(Math.random() * count)

    Quote.findOne().skip(random).exec((err, quote) => {
      if (err) {
        return res.status(500).send(err);
      }

      return res.json({ quote })
    });
  });
}

/**
 * Get all quotes
 * @param req
 * @param res
 * @returns void
 */
export function getQuotes(req, res, next) {
  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    Quote.find({}).sort('-updatedAt').exec((err, quotes) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.json({ quotes });
    });
  });
}

/**
 * Create a quote
 * @param req
 * @param res
 * @returns void
 */
export function addQuote(req, res, next) {
  if (!req.body.quote) {
    return res.status(400).json({
      errorMessage: "Missing required field: quote"
    });
  }

  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    const newQuote = new Quote(req.body.quote);

    newQuote.text = sanitizeHtml(newQuote.text);
    newQuote.author = sanitizeHtml(newQuote.author);

    newQuote.save((err, saved) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(201).json({ quote: saved });
    });
  });
}

/**
 * Update a quote
 * @param req
 * @param res
 * @returns void
 */
export function updateQuote(req, res, next) {
  const quoteId = req.params.quote_id;

  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    Quote.findOne({ _id: quoteId }).exec((err, quote) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!quote) {
        return res.status(404).json({
          errorMessage: 'Quote not found.'
        });
      }

      quote.text = sanitizeHtml(req.body.quote.text);
      quote.author = sanitizeHtml(req.body.quote.author);

      quote.save((err, saved) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          return res.status(201).json({ quote: saved });
        }
      });
    });
  });
}

/**
 * Get a single quote
 * @param req
 * @param res
 * @returns void
 */
export function getQuote(req, res, next) {
  const quoteId = req.params.quote_id;

  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    Quote.findOne({ _id: quoteId }).exec((err, quote) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!quote) {
        return res.status(400).json({
          errorMessage: 'Quote not found'
        });
      }

      return res.status(200).json({ quote });
    });
  });
}

/**
 * Delete a quote
 * @param req
 * @param res
 * @returns void
 */
export function deleteQuote(req, res, next) {
  const quoteId = req.params.quote_id;

  User.findOne({ _id: req.user.id }).exec((err, user) => {
    if (user.userType != 'admin') {
      return res.status(403).json({
        errorMessage: 'Permission denied.'
      });
    }

    Quote.findOne({ _id: quoteId }).exec((err, quote) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (!quote) {
        return res.status(500).json({
          errorMessage: 'Quote not found'
        });
      }

      quote.remove(() => {
        return res.status(200).end();
      });
    });
  });
}
