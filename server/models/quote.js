import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const quoteSchema = new Schema({
  text: String,
  author: String
},
{
  timestamps: true
});

export default mongoose.model('Quote', quoteSchema);
