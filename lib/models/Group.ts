import mongoose, { Document, Schema } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description: string;
  type: 'study' | 'project' | 'club' | 'social' | 'academic' | 'other';
  creator: mongoose.Types.ObjectId;
  members: mongoose.Types.ObjectId[];
  admins: mongoose.Types.ObjectId[];
  course?: mongoose.Types.ObjectId;
  maxMembers?: number;
  isPrivate: boolean;
  tags: string[];
  meetingSchedule?: {
    day: string;
    time: string;
    location: string;
    frequency: 'weekly' | 'biweekly' | 'monthly' | 'irregular';
  };
  announcements: {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    createdAt: Date;
  }[];
  joinRequests: mongoose.Types.ObjectId[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GroupSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Group description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['study', 'project', 'club', 'social', 'academic', 'other'],
    required: [true, 'Group type is required'],
    default: 'study'
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  admins: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  maxMembers: {
    type: Number,
    min: [2, 'Group must allow at least 2 members'],
    max: [100, 'Group cannot exceed 100 members']
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  meetingSchedule: {
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    time: {
      type: String,
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters']
    },
    frequency: {
      type: String,
      enum: ['weekly', 'biweekly', 'monthly', 'irregular'],
      default: 'weekly'
    }
  },
  announcements: [{
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [200, 'Announcement title cannot be more than 200 characters']
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [2000, 'Announcement content cannot be more than 2000 characters']
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  joinRequests: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
GroupSchema.index({ type: 1 });
GroupSchema.index({ course: 1 });
GroupSchema.index({ creator: 1 });
GroupSchema.index({ members: 1 });
GroupSchema.index({ isPrivate: 1, isActive: 1 });

export default mongoose.models.Group || mongoose.model<IGroup>('Group', GroupSchema);
