import mongoose, { Document, Schema } from 'mongoose';

export interface IResource extends Document {
  title: string;
  description: string;
  type: 'document' | 'video' | 'link' | 'image' | 'audio' | 'other';
  category: 'lecture_notes' | 'assignments' | 'textbooks' | 'references' | 'tutorials' | 'tools' | 'other';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  externalUrl?: string;
  uploadedBy: mongoose.Types.ObjectId;
  course?: mongoose.Types.ObjectId;
  subject?: string;
  tags: string[];
  downloads: number;
  likes: mongoose.Types.ObjectId[];
  isPublic: boolean;
  isApproved: boolean;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ResourceSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Resource title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Resource description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  type: {
    type: String,
    enum: ['document', 'video', 'link', 'image', 'audio', 'other'],
    required: [true, 'Resource type is required']
  },
  category: {
    type: String,
    enum: ['lecture_notes', 'assignments', 'textbooks', 'references', 'tutorials', 'tools', 'other'],
    required: [true, 'Resource category is required'],
    default: 'other'
  },
  fileUrl: {
    type: String,
    trim: true
  },
  fileName: {
    type: String,
    trim: true
  },
  fileSize: {
    type: Number,
    min: [0, 'File size cannot be negative']
  },
  mimeType: {
    type: String,
    trim: true
  },
  externalUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function(v: string) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: 'External URL must be a valid HTTP/HTTPS URL'
    }
  },
  uploadedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Uploader is required']
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: 'Course',
    default: null
  },
  subject: {
    type: String,
    trim: true,
    maxlength: [100, 'Subject cannot be more than 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  downloads: {
    type: Number,
    default: 0,
    min: [0, 'Downloads cannot be negative']
  },
  likes: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPublic: {
    type: Boolean,
    default: true
  },
  isApproved: {
    type: Boolean,
    default: function() {
      // Auto-approve for faculty and admin, require approval for students
      return true; // Will be set in the API based on user role
    }
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  approvedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Validation: Either fileUrl or externalUrl must be provided
ResourceSchema.pre('validate', function(next) {
  if (!this.fileUrl && !this.externalUrl) {
    this.invalidate('fileUrl', 'Either file upload or external URL is required');
  }
  next();
});

// Indexes for better performance
ResourceSchema.index({ type: 1 });
ResourceSchema.index({ category: 1 });
ResourceSchema.index({ course: 1 });
ResourceSchema.index({ uploadedBy: 1 });
ResourceSchema.index({ isPublic: 1, isApproved: 1 });
ResourceSchema.index({ tags: 1 });
ResourceSchema.index({ createdAt: -1 });

export default mongoose.models.Resource || mongoose.model<IResource>('Resource', ResourceSchema);
