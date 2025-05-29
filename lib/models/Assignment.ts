import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  title: string;
  description: string;
  course: string;
  instructor: mongoose.Types.ObjectId;
  dueDate: Date;
  maxPoints: number;
  attachments: string[];
  submissions: {
    student: mongoose.Types.ObjectId;
    submittedAt: Date;
    files: string[];
    grade?: number;
    feedback?: string;
    status: 'submitted' | 'graded' | 'late';
  }[];
  isPublished: boolean;
  allowLateSubmissions: boolean;
  instructions: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    maxlength: [100, 'Course cannot be more than 100 characters']
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(date: Date) {
        return date > new Date();
      },
      message: 'Due date must be in the future'
    }
  },
  maxPoints: {
    type: Number,
    required: [true, 'Maximum points is required'],
    min: [1, 'Maximum points must be at least 1'],
    max: [1000, 'Maximum points cannot exceed 1000']
  },
  attachments: [{
    type: String,
    trim: true
  }],
  submissions: [{
    student: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    submittedAt: {
      type: Date,
      default: Date.now
    },
    files: [{
      type: String,
      trim: true
    }],
    grade: {
      type: Number,
      min: 0,
      max: function() { return this.parent().maxPoints; }
    },
    feedback: {
      type: String,
      maxlength: [1000, 'Feedback cannot be more than 1000 characters']
    },
    status: {
      type: String,
      enum: ['submitted', 'graded', 'late'],
      default: 'submitted'
    }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  allowLateSubmissions: {
    type: Boolean,
    default: true
  },
  instructions: {
    type: String,
    maxlength: [5000, 'Instructions cannot be more than 5000 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
AssignmentSchema.index({ instructor: 1 });
AssignmentSchema.index({ course: 1 });
AssignmentSchema.index({ dueDate: 1 });
AssignmentSchema.index({ isPublished: 1 });
AssignmentSchema.index({ 'submissions.student': 1 });

export default mongoose.models.Assignment || mongoose.model<IAssignment>('Assignment', AssignmentSchema);
