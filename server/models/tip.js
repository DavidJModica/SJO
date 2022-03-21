import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const tipSchema = new Schema({
  tip: String
},
{
  timestamps: true
});

export default mongoose.model('Tip', tipSchema);
