import mongoose, { Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  title: string;
  code: string;
  description: string;
  instructor: mongoose.Types.ObjectId;
  department: string;
  credits: number;
  semester: string;
  year: number;
  schedule: {
    days: string[];
    time: string;
    location: string;
  };
  enrolledStudents: mongoose.Types.ObjectId[];
  maxStudents?: number;
  prerequisites?: string[];
  syllabus?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CourseSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  code: {
    type: String,
    required: [true, 'Course code is required'],
    trim: true,
    uppercase: true,
    unique: true,
    maxlength: [20, 'Course code cannot be more than 20 characters']
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Instructor is required']
  },
  department: {
    type: String,
    required: [true, 'Department is required'],
    trim: true,
    maxlength: [100, 'Department cannot be more than 100 characters']
  },
  credits: {
    type: Number,
    required: [true, 'Credits are required'],
    min: [1, 'Credits must be at least 1'],
    max: [10, 'Credits cannot exceed 10']
  },
  semester: {
    type: String,
    enum: ['Fall', 'Spring', 'Summer'],
    required: [true, 'Semester is required']
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [2020, 'Year must be 2020 or later'],
    max: [2030, 'Year cannot exceed 2030']
  },
  schedule: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    time: {
      type: String,
      required: [true, 'Schedule time is required'],
      match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM-HH:MM format']
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [100, 'Location cannot be more than 100 characters']
    }
  },
  enrolledStudents: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  maxStudents: {
    type: Number,
    min: [1, 'Maximum students must be at least 1'],
    max: [500, 'Maximum students cannot exceed 500']
  },
  prerequisites: [{
    type: String,
    trim: true,
    maxlength: [50, 'Prerequisite cannot be more than 50 characters']
  }],
  syllabus: {
    type: String,
    maxlength: [5000, 'Syllabus cannot be more than 5000 characters']
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better performance
CourseSchema.index({ code: 1 });
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ department: 1 });
CourseSchema.index({ semester: 1, year: 1 });

export default mongoose.models.Course || mongoose.model<ICourse>('Course', CourseSchema);
