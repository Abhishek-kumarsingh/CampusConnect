// Mock data service for demo purposes when MongoDB is not available

export const mockUsers = [
  {
    _id: 'demo-student',
    name: 'John Student',
    email: 'student@campusconnect.edu',
    role: 'student',
    department: 'Computer Science',
    studentId: 'CS2024001',
    isActive: true,
    isDemo: true
  },
  {
    _id: 'demo-faculty',
    name: 'Dr. Jane Faculty',
    email: 'faculty@campusconnect.edu',
    role: 'faculty',
    department: 'Computer Science',
    facultyId: 'FAC2024001',
    isActive: true,
    isDemo: true
  },
  {
    _id: 'demo-admin',
    name: 'Admin User',
    email: 'admin@campusconnect.edu',
    role: 'admin',
    department: 'Administration',
    isActive: true,
    isDemo: true
  }
];

export const mockEvents = [
  {
    _id: 'event-1',
    title: "Tech Innovators Summit 2024",
    description: "Join the biggest tech event on campus with industry leaders, innovative showcases, and networking opportunities. Learn about the latest trends in AI, blockchain, and web development.",
    date: new Date('2024-12-25').toISOString(),
    time: "10:00",
    location: "Student Center Ballroom",
    category: "conference",
    organizer: {
      _id: 'demo-faculty',
      name: 'Dr. Jane Faculty',
      email: 'faculty@campusconnect.edu',
      role: 'faculty'
    },
    attendees: [],
    tags: ["technology", "innovation", "networking"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 200,
    image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-2',
    title: "AI & Machine Learning Workshop",
    description: "Hands-on workshop covering the fundamentals of artificial intelligence and machine learning. Build your first neural network and explore practical applications.",
    date: new Date('2024-12-28').toISOString(),
    time: "14:00",
    location: "Computer Science Lab 301",
    category: "workshop",
    organizer: {
      _id: 'demo-faculty',
      name: 'Dr. Jane Faculty',
      email: 'faculty@campusconnect.edu',
      role: 'faculty'
    },
    attendees: [],
    tags: ["AI", "machine learning", "programming"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 50,
    image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-3',
    title: "Campus Hackathon 2024",
    description: "48-hour coding marathon where students collaborate to build innovative solutions. Prizes for best projects in various categories including sustainability and social impact.",
    date: new Date('2024-12-30').toISOString(),
    time: "18:00",
    location: "Engineering Building",
    category: "hackathon",
    organizer: {
      _id: 'demo-admin',
      name: 'Admin User',
      email: 'admin@campusconnect.edu',
      role: 'admin'
    },
    attendees: [],
    tags: ["coding", "competition", "innovation"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 100,
    image: "https://images.pexels.com/photos/3182781/pexels-photo-3182781.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-4',
    title: "Career Fair: Tech Edition",
    description: "Connect with top tech companies and startups. Bring your resume and portfolio for on-the-spot interviews and networking opportunities.",
    date: new Date('2025-01-05').toISOString(),
    time: "09:00",
    location: "Main Auditorium",
    category: "seminar",
    organizer: {
      _id: 'demo-admin',
      name: 'Admin User',
      email: 'admin@campusconnect.edu',
      role: 'admin'
    },
    attendees: [],
    tags: ["career", "jobs", "networking"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 300,
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-5',
    title: "Spring Music Festival",
    description: "Annual music celebration featuring student bands, professional artists, and open mic sessions. Food trucks and activities for all ages.",
    date: new Date('2025-01-10').toISOString(),
    time: "17:00",
    location: "Campus Amphitheater",
    category: "social",
    organizer: {
      _id: 'demo-faculty',
      name: 'Dr. Jane Faculty',
      email: 'faculty@campusconnect.edu',
      role: 'faculty'
    },
    attendees: [],
    tags: ["music", "festival", "entertainment"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 500,
    image: "https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'event-6',
    title: "Campus Basketball Tournament",
    description: "Inter-department basketball championship. Form your teams and compete for the trophy. Registration includes team jersey and refreshments.",
    date: new Date('2025-01-15').toISOString(),
    time: "16:00",
    location: "Sports Complex",
    category: "sports",
    organizer: {
      _id: 'demo-admin',
      name: 'Admin User',
      email: 'admin@campusconnect.edu',
      role: 'admin'
    },
    attendees: [],
    tags: ["basketball", "sports", "competition"],
    isApproved: true,
    isPublic: true,
    maxAttendees: 80,
    image: "https://images.pexels.com/photos/2990644/pexels-photo-2990644.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// In-memory storage for demo
let eventsStore = [...mockEvents];
let usersStore = [...mockUsers];

export const mockDatabase = {
  events: {
    find: (query: any = {}) => {
      let filtered = [...eventsStore];
      
      if (query.category && query.category !== 'all') {
        filtered = filtered.filter(event => event.category === query.category);
      }
      
      if (query.search) {
        const searchLower = query.search.toLowerCase();
        filtered = filtered.filter(event => 
          event.title.toLowerCase().includes(searchLower) ||
          event.description.toLowerCase().includes(searchLower) ||
          event.tags.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }
      
      return filtered;
    },
    
    findById: (id: string) => {
      return eventsStore.find(event => event._id === id);
    },
    
    updateRsvp: (eventId: string, userId: string, action: 'add' | 'remove') => {
      const eventIndex = eventsStore.findIndex(event => event._id === eventId);
      if (eventIndex === -1) return null;
      
      const event = eventsStore[eventIndex];
      const user = usersStore.find(u => u._id === userId);
      if (!user) return null;
      
      if (action === 'add') {
        if (!event.attendees.some(a => a._id === userId)) {
          event.attendees.push(user);
        }
      } else {
        event.attendees = event.attendees.filter(a => a._id !== userId);
      }
      
      eventsStore[eventIndex] = event;
      return event;
    }
  },
  
  users: {
    findByEmail: (email: string) => {
      return usersStore.find(user => user.email === email);
    },
    
    findById: (id: string) => {
      return usersStore.find(user => user._id === id);
    }
  }
};
