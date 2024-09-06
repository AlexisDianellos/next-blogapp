import mongoose from 'mongoose';
import User from './User';

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  content: {
    type: String,
    required: [true, 'Please provide content'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required:true,
  }
});

export default mongoose.models.Post || mongoose.model('Post', PostSchema);
