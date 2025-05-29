import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
  author: mongoose.Types.ObjectId;
  content: string;
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  replies: IComment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPost extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: 'question' | 'discussion' | 'announcement' | 'help' | 'general';
  tags: string[];
  upvotes: mongoose.Types.ObjectId[];
  downvotes: mongoose.Types.ObjectId[];
  comments: IComment[];
  bookmarkedBy: mongoose.Types.ObjectId[];
  isResolved: boolean;
  isPinned: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Comment author is required']
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: [2000, 'Comment cannot be more than 2000 characters']
  },
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

const PostSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Post content is required'],
    trim: true,
    maxlength: [10000, 'Content cannot be more than 10000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Post author is required']
  },
  category: {
    type: String,
    enum: ['question', 'discussion', 'announcement', 'help', 'general'],
    required: [true, 'Post category is required'],
    default: 'general'
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  upvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  downvotes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [CommentSchema],
  bookmarkedBy: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isResolved: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
PostSchema.index({ author: 1 });
PostSchema.index({ category: 1 });
PostSchema.index({ tags: 1 });
PostSchema.index({ createdAt: -1 });
PostSchema.index({ upvotes: 1 });
PostSchema.index({ views: -1 });

export default mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);
