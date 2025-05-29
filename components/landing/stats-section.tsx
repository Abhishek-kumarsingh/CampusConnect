"use client"

import { useEffect, useState } from 'react';
import { GraduationCap as Graduation, Users, CalendarDays, MessagesSquare } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  suffix?: string;
  delay: string;
  duration: number;
};

function StatCard({ icon, label, value, suffix = "", delay, duration }: StatCardProps) {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let start = 0;
    const end = Math.min(value, 9999);
    const incrementTime = Math.max(duration / end, 5);
    
    const timer = setInterval(() => {
      const step = Math.ceil((end - start) / 10);
      start = Math.min(start + step, end);
      setCount(start);
      
      if (start === end) {
        clearInterval(timer);
      }
    }, incrementTime);
    
    return () => clearInterval(timer);
  }, [value, duration]);

  return (
    <div 
      className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700"
      data-aos="fade-up"
      data-aos-delay={delay}
    >
      <div className="flex items-center mb-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mr-4">
          {icon}
        </div>
        <h3 className="text-lg font-medium text-slate-600 dark:text-slate-300">{label}</h3>
      </div>
      <p className="text-3xl font-bold text-slate-900 dark:text-white">{count.toLocaleString()}{suffix}</p>
    </div>
  );
}

export function StatsSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const stats = [
    {
      icon: <Users className="w-6 h-6" />,
      label: "Students",
      value: 12500,
      suffix: "+",
      delay: "0",
      duration: 2000,
    },
    {
      icon: <Graduation className="w-6 h-6" />,
      label: "Faculty Members",
      value: 450,
      suffix: "+",
      delay: "100",
      duration: 2000,
    },
    {
      icon: <CalendarDays className="w-6 h-6" />,
      label: "Events Hosted",
      value: 320,
      suffix: "",
      delay: "200",
      duration: 2000,
    },
    {
      icon: <MessagesSquare className="w-6 h-6" />,
      label: "Forum Posts",
      value: 8600,
      suffix: "+",
      delay: "300",
      duration: 2000,
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            Our Growing Community
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Join thousands of students and faculty already transforming their campus experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatCard 
              key={index}
              icon={stat.icon}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              delay={stat.delay}
              duration={stat.duration}
            />
          ))}
        </div>
      </div>
    </section>
  );
}