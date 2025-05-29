import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import Assignment from '@/lib/models/Assignment';
import Notification from '@/lib/models/Notification';
import { hashPassword, DEMO_CREDENTIALS } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    await Assignment.deleteMany({});
    await Notification.deleteMany({});

    // Create demo users
    const demoUsers = [];

    for (const [role, credentials] of Object.entries(DEMO_CREDENTIALS)) {
      const hashedPassword = await hashPassword(credentials.password);

      const userData: any = {
        name: credentials.name,
        email: credentials.email,
        password: hashedPassword,
        role: credentials.role,
        department: credentials.department,
        isActive: true
      };

      if ('studentId' in credentials) {
        userData.studentId = credentials.studentId;
      }
      if ('facultyId' in credentials) {
        userData.facultyId = credentials.facultyId;
      }

      const user = new User(userData);
      await user.save();
      demoUsers.push(user);
    }

    // Create demo events
    const facultyUser = demoUsers.find(u => u.role === 'faculty');
    const adminUser = demoUsers.find(u => u.role === 'admin');

    // Create future dates
    const today = new Date();
    const futureDate1 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 1 week from now
    const futureDate2 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
    const futureDate3 = new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000); // 3 weeks from now
    const futureDate4 = new Date(today.getTime() + 28 * 24 * 60 * 60 * 1000); // 4 weeks from now
    const futureDate5 = new Date(today.getTime() + 35 * 24 * 60 * 60 * 1000); // 5 weeks from now
    const futureDate6 = new Date(today.getTime() + 42 * 24 * 60 * 60 * 1000); // 6 weeks from now

    const demoEvents = [
      {
        title: "Tech Innovators Summit 2024",
        description: "Join the biggest tech event on campus with industry leaders, innovative showcases, and networking opportunities. Learn about the latest trends in AI, blockchain, and web development.",
        date: futureDate1,
        time: "10:00",
        location: "Student Center Ballroom",
        category: "conference",
        organizer: facultyUser._id,
        tags: ["technology", "innovation", "networking"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 200,
        image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        title: "AI & Machine Learning Workshop",
        description: "Hands-on workshop covering the fundamentals of artificial intelligence and machine learning. Build your first neural network and explore practical applications.",
        date: futureDate2,
        time: "14:00",
        location: "Computer Science Lab 301",
        category: "workshop",
        organizer: facultyUser._id,
        tags: ["AI", "machine learning", "programming"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 50,
        image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        title: "Campus Hackathon 2024",
        description: "48-hour coding marathon where students collaborate to build innovative solutions. Prizes for best projects in various categories including sustainability and social impact.",
        date: futureDate3,
        time: "18:00",
        location: "Engineering Building",
        category: "hackathon",
        organizer: adminUser._id,
        tags: ["coding", "competition", "innovation"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 100,
        image: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        title: "Career Fair: Tech Edition",
        description: "Connect with top tech companies and startups. Bring your resume and portfolio for on-the-spot interviews and networking opportunities.",
        date: futureDate4,
        time: "09:00",
        location: "Main Auditorium",
        category: "seminar",
        organizer: adminUser._id,
        tags: ["career", "jobs", "networking"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 300,
        image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        title: "Spring Music Festival",
        description: "Annual music celebration featuring student bands, professional artists, and open mic sessions. Food trucks and activities for all ages.",
        date: futureDate5,
        time: "17:00",
        location: "Campus Amphitheater",
        category: "social",
        organizer: facultyUser._id,
        tags: ["music", "festival", "entertainment"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 500,
        image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      },
      {
        title: "Campus Basketball Tournament",
        description: "Inter-department basketball championship. Form your teams and compete for the trophy. Registration includes team jersey and refreshments.",
        date: futureDate6,
        time: "16:00",
        location: "Sports Complex",
        category: "sports",
        organizer: adminUser._id,
        tags: ["basketball", "sports", "competition"],
        isApproved: true,
        isPublic: true,
        maxAttendees: 80,
        image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
      }
    ];

    const createdEvents = [];
    for (const eventData of demoEvents) {
      const event = new Event(eventData);
      await event.save();
      createdEvents.push(event);
    }

    // Create demo assignments
    const demoAssignments = [
      {
        title: 'Data Structures Project',
        description: 'Implement a binary search tree with insertion, deletion, and traversal operations. Include comprehensive test cases and documentation.',
        course: 'CS 301 - Data Structures',
        instructor: facultyUser._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        maxPoints: 100,
        submissionType: 'file',
        isPublished: true,
        allowLateSubmission: false,
        instructions: 'Submit your code as a ZIP file with proper documentation and test cases.',
        submissions: []
      },
      {
        title: 'Database Design Assignment',
        description: 'Design and implement a relational database schema for a library management system. Include entity-relationship diagrams and normalization analysis.',
        course: 'CS 401 - Database Systems',
        instructor: facultyUser._id,
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        maxPoints: 80,
        submissionType: 'both',
        isPublished: true,
        allowLateSubmission: true,
        instructions: 'Submit both the database schema file and a written report explaining your design decisions.',
        submissions: []
      },
      {
        title: 'Algorithm Analysis Report',
        description: 'Analyze the time and space complexity of various sorting algorithms. Implement at least three different sorting methods and compare their performance.',
        course: 'CS 301 - Data Structures',
        instructor: facultyUser._id,
        dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
        maxPoints: 90,
        submissionType: 'both',
        isPublished: true,
        allowLateSubmission: true,
        instructions: 'Submit code implementation and a detailed analysis report.',
        submissions: []
      }
    ];

    const createdAssignments = [];
    for (const assignmentData of demoAssignments) {
      const assignment = new Assignment(assignmentData);
      await assignment.save();
      createdAssignments.push(assignment);
    }

    // Create demo notifications
    const studentUser = demoUsers.find(u => u.role === 'student');
    const demoNotifications = [
      {
        title: 'Welcome to CampusConnect!',
        message: 'Your account has been created successfully. Explore the platform and connect with your campus community.',
        type: 'system',
        sender: adminUser._id,
        recipients: [studentUser._id, facultyUser._id],
        priority: 'medium',
        isRead: []
      },
      {
        title: 'New Assignment Posted',
        message: 'A new assignment "Data Structures Project" has been posted for CS 301.',
        type: 'assignment',
        sender: facultyUser._id,
        recipients: [studentUser._id],
        priority: 'high',
        isRead: [],
        relatedEntity: {
          entityType: 'assignment',
          entityId: createdAssignments[0]._id
        }
      },
      {
        title: 'Event Registration Confirmed',
        message: 'You have successfully registered for the Tech Innovators Summit 2024.',
        type: 'event',
        sender: adminUser._id,
        recipients: [studentUser._id],
        priority: 'medium',
        isRead: [],
        relatedEntity: {
          entityType: 'event',
          entityId: createdEvents[0]._id
        }
      }
    ];

    for (const notificationData of demoNotifications) {
      const notification = new Notification(notificationData);
      await notification.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully with comprehensive content',
      data: {
        users: demoUsers.length,
        events: createdEvents.length,
        assignments: createdAssignments.length,
        notifications: demoNotifications.length
      }
    });

  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: 'Failed to seed data' },
      { status: 500 }
    );
  }
}
