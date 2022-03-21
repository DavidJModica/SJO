import Entry from '../models/entry';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all entries
 * @param req
 * @param res
 * @returns void
 */
export function getEntries(req, res, next) {
  const userId = req.user.id;
  Entry.find({ userId }).sort('-date').exec((err, entries) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.json({ entries });
  });
}

/**
 * Create an entry
 * @param req
 * @param res
 * @returns void
 */
export function addEntry(req, res, next) {
  const userId = req.user.id;

  if (!req.body.entry.type) {
    return res.status(400).json({
      errorMessage: "Missing required field: entry.type"
    });
  }

  const newEntry = new Entry(req.body.entry);

  newEntry.type = sanitizeHtml(newEntry.type);
  newEntry.name = sanitizeHtml(newEntry.name);
  newEntry.userId = userId;

  newEntry.save((err, saved) => {
    if (err) {
      return res.status(500).send(err);
    }
    return res.status(201).json({ entry: saved });
  });
}

/**
 * Update an entry
 * @param req
 * @param res
 * @returns void
 */
export function updateEntry(req, res, next) {
  const userId = req.user.id;
  const entryId = req.params.entry_id;

  Entry.findOne({ _id: entryId, userId }).exec((err, entry) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!entry) {
      return res.status(400).json({
        errorMessage: 'Entry not found'
      });
    }

    // Fields for both daily and weekly types
    entry.type = sanitizeHtml(req.body.entry.type);
    entry.intros = sanitizeHtml(req.body.entry.intros);
    entry.sqls = sanitizeHtml(req.body.entry.sqls);
    entry.positive_desc = sanitizeHtml(req.body.entry.positive_desc);
    entry.negative_desc = sanitizeHtml(req.body.entry.negative_desc);
    entry.date = sanitizeHtml(req.body.entry.date);

    // Fields specific to one type or another
    if (entry.type == 'daily') {
      entry.task = sanitizeHtml(req.body.entry.task);
      entry.contact = sanitizeHtml(req.body.entry.contact);
      entry.calls = sanitizeHtml(req.body.entry.calls);

      let newEvents = []
      req.body.entry.events.forEach(function(event) {
        newEvents.push({
          title: sanitizeHtml(event.title),
          startDate: sanitizeHtml(event.startDate),
          endDate: sanitizeHtml(event.endDate)
        });
      });

      entry.events = newEvents;

      entry.notes = sanitizeHtml(req.body.entry.notes);
      entry.activities = sanitizeHtml(req.body.entry.activities);
    } else if (entry.type == 'weekly') {
      entry.positive_why = sanitizeHtml(req.body.entry.positive_why);
      entry.negative_why = sanitizeHtml(req.body.entry.negative_why);
      entry.improve_desc = sanitizeHtml(req.body.entry.improve_desc);
      entry.improve_how = sanitizeHtml(req.body.entry.improve_how);
      entry.move_needle = sanitizeHtml(req.body.entry.move_needle);
    }

    entry.save((err, saved) => {
      if (err) {
        return res.status(500).send(err);
      } else {
        return res.status(201).json({ entry: saved });
      }
    });
  });
}

/**
 * Get a single entry
 * @param req
 * @param res
 * @returns void
 */
export function getEntry(req, res, next) {
  const userId = req.user.id;
  const entryId = req.params.entry_id;

  Entry.findOne({ _id: entryId, userId }).exec((err, entry) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!entry) {
      return res.status(400).json({
        errorMessage: 'Entry not found'
      });
    }

    return res.status(200).json({ entry });
  });
}

/**
 * Delete a entry
 * @param req
 * @param res
 * @returns void
 */
export function deleteEntry(req, res, next) {
  const userId = req.user.id;
  const entryId = req.params.entry_id;

  Entry.findOne({ _id: entryId, userId }).exec((err, entry) => {
    if (err) {
      return res.status(500).send(err);
    }

    if (!entry) {
      return res.status(500).json({
        errorMessage: 'Entry not found'
      });
    }

    entry.remove(() => {
      return res.status(200).end();
    });
  });
}
