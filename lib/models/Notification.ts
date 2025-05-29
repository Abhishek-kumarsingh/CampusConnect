import mongoose, { Document, Schema } from 'mongoose';

export interface INotification extends Document {
  title: string;
  message: string;
  type: 'assignment' | 'event' | 'announcement' | 'grade' | 'system' | 'reminder';
  sender: mongoose.Types.ObjectId;
  recipients: mongoose.Types.ObjectId[];
  recipientRoles: ('student' | 'faculty' | 'admin')[];
  isRead: {
    user: mongoose.Types.ObjectId;
    readAt: Date;
  }[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  relatedEntity?: {
    entityType: 'assignment' | 'event' | 'post' | 'user';
    entityId: mongoose.Types.ObjectId;
  };
  expiresAt?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true,
    maxlength: [1000, 'Message cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['assignment', 'event', 'announcement', 'grade', 'system', 'reminder'],
    required: [true, 'Notification type is required'],
    default: 'announcement'
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender is required']
  },
  recipients: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  recipientRoles: [{
    type: String,
    enum: ['student', 'faculty', 'admin']
  }],
  isRead: [{
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    readAt: {
      type: Date,
      default: Date.now
    }
  }],
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  relatedEntity: {
    entityType: {
      type: String,
      enum: ['assignment', 'event', 'post', 'user']
    },
    entityId: {
      type: Schema.Types.ObjectId
    }
  },
  expiresAt: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
NotificationSchema.index({ recipients: 1 });
NotificationSchema.index({ recipientRoles: 1 });
NotificationSchema.index({ sender: 1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isActive: 1 });
NotificationSchema.index({ expiresAt: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
