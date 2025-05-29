import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import Event from '@/lib/models/Event';
import { hashPassword, DEMO_CREDENTIALS } from '@/lib/auth';

export async function POST() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});

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

    const demoEvents = [
      {
        title: "Tech Innovators Summit 2024",
        description: "Join the biggest tech event on campus with industry leaders, innovative showcases, and networking opportunities. Learn about the latest trends in AI, blockchain, and web development.",
        date: new Date('2024-12-25'),
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
        date: new Date('2024-12-28'),
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
        date: new Date('2024-12-30'),
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
        date: new Date('2025-01-05'),
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
        date: new Date('2025-01-10'),
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
        date: new Date('2025-01-15'),
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

    for (const eventData of demoEvents) {
      const event = new Event(eventData);
      await event.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Demo data seeded successfully',
      data: {
        users: demoUsers.length,
        events: demoEvents.length
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
