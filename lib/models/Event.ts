import mongoose, { Document, Schema } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  description: string;
  date: Date;
  time: string;
  location: string;
  category: 'academic' | 'social' | 'sports' | 'cultural' | 'workshop' | 'seminar' | 'conference' | 'hackathon' | 'other';
  organizer: mongoose.Types.ObjectId | null;
  maxAttendees?: number;
  attendees: mongoose.Types.ObjectId[];
  tags: string[];
  image?: string;
  isApproved: boolean;
  isPublic: boolean;
  requirements?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  date: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Event time is required'],
    match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time in HH:MM format']
  },
  location: {
    type: String,
    required: [true, 'Event location is required'],
    trim: true,
    maxlength: [200, 'Location cannot be more than 200 characters']
  },
  category: {
    type: String,
    enum: ['academic', 'social', 'sports', 'cultural', 'workshop', 'seminar', 'conference', 'hackathon', 'other'],
    required: [true, 'Event category is required'],
    default: 'other'
  },
  organizer: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false,
    default: null
  },
  maxAttendees: {
    type: Number,
    min: [1, 'Maximum attendees must be at least 1'],
    max: [10000, 'Maximum attendees cannot exceed 10000']
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  image: {
    type: String,
    default: ''
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  requirements: {
    type: String,
    maxlength: [1000, 'Requirements cannot be more than 1000 characters']
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  contactPhone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
EventSchema.index({ date: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ isApproved: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ tags: 1 });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
