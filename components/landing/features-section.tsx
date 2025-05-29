"use client"

import { useEffect } from 'react';
import { 
  CalendarDays, 
  MessageSquare, 
  Users, 
  PenTool, 
  Bell, 
  BarChart3 
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: string;
};

function FeatureCard({ icon, title, description, delay }: FeatureCardProps) {
  return (
    <div 
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-100 dark:border-slate-700"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300">{description}</p>
    </div>
  );
}

export function FeaturesSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const features = [
    {
      icon: <CalendarDays className="w-6 h-6" />,
      title: "Event Management",
      description: "Create, discover, and RSVP to campus events. Get reminders and share with friends.",
      delay: "0"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Discussion Forums",
      description: "Engage in academic discussions, ask questions, and share knowledge with peers.",
      delay: "100"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Collaborative Groups",
      description: "Form study groups, club teams, or project collaborations with real-time updates.",
      delay: "200"
    },
    {
      icon: <PenTool className="w-6 h-6" />,
      title: "Assignment Tracking",
      description: "Stay on top of deadlines with assignment reminders and progress tracking.",
      delay: "0"
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: "Smart Notifications",
      description: "Get personalized alerts for events, discussions, and important announcements.",
      delay: "100"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Academic Analytics",
      description: "Track performance, attendance, and engagement with intuitive visualizations.",
      delay: "200"
    }
  ];

  return (
    <section className="py-20 px-4 bg-slate-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Everything You Need in One Place
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            CampusConnect streamlines communication and collaboration with these powerful features
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={feature.delay}
            />
          ))}
        </div>
      </div>
    </section>
  );
}