import mongoose, { Document, Schema } from 'mongoose';

export interface IDiscussion extends Document {
  title: string;
  content: string;
  author: mongoose.Types.ObjectId;
  category: 'general' | 'academic' | 'announcements' | 'help' | 'events' | 'other';
  course?: mongoose.Types.ObjectId;
  tags: string[];
  replies: mongoose.Types.ObjectId[];
  likes: mongoose.Types.ObjectId[];
  views: number;
  isPinned: boolean;
  isLocked: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IReply extends Document {
  content: string;
  author: mongoose.Types.ObjectId;
  discussion: mongoose.Types.ObjectId;
  parentReply?: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReplySchema: Schema = new Schema({
  content: {
    type: String,
    required: [true, 'Reply content is required'],
    trim: true,
    maxlength: [2000, 'Reply cannot be more than 2000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  discussion: {
    type: Schema.Types.ObjectId,
    ref: 'Discussion',
    required: [true, 'Discussion is required']
  },
  parentReply: {
    type: Schema.Types.ObjectId,
    ref: 'Reply',
    default: null
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const DiscussionSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Discussion title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Discussion content is required'],
    trim: true,
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'announcements', 'help', 'events', 'other'],
    required: [true, 'Category is required'],
    default: 'general'
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  replies: [{
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  }],
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  views: {
    type: Number,
    default: 0
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  isLocked: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
DiscussionSchema.index({ category: 1 });
DiscussionSchema.index({ course: 1 });
DiscussionSchema.index({ author: 1 });
DiscussionSchema.index({ createdAt: -1 });
DiscussionSchema.index({ isPinned: -1, createdAt: -1 });

ReplySchema.index({ discussion: 1 });
ReplySchema.index({ author: 1 });
ReplySchema.index({ createdAt: 1 });

export const Discussion = mongoose.models.Discussion || mongoose.model<IDiscussion>('Discussion', DiscussionSchema);
export const Reply = mongoose.models.Reply || mongoose.model<IReply>('Reply', ReplySchema);

export default Discussion;
