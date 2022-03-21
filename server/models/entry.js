import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const entrySchema = new Schema({
  type: { type: 'String', enum: ['daily', 'weekly'], required: true },
  date: { type: 'Date', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  task: String,
  contact: String,
  calls: Number,
  schedule: [String],
  events: [{
    startDate: Date,
    endDate: Date,
    title: String
  }],
  notes: String,
  activities: Number,
  intros: Number,
  sqls: Number,
  positive_desc: String,
  positive_why: String,
  negative_desc: String,
  negative_why: String,
  improve_desc: String,
  improve_how: String,
  move_needle: String
}, { timestamps: true });

entrySchema.index({ userId: 1, date: -1, type: 1 }, { unique: true });

export default mongoose.model('Entry', entrySchema);
