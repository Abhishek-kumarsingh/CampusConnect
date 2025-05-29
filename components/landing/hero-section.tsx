"use client"

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { GraduationCap as Graduation, Users, ChevronRight } from 'lucide-react';

export function HeroSection() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <section className="py-20 md:py-32 px-4 relative overflow-hidden">
      {/* Background gradient decorations */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-up">
            <div className="inline-block mb-4 px-4 py-1.5 bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 rounded-full text-sm font-medium">
              Reimagining Campus Connectivity
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-slate-900 dark:text-slate-50">
              Your All-in-One <span className="text-indigo-600 dark:text-indigo-400">Campus</span> Collaboration Platform
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl">
              Connect, collaborate, and communicate with students, faculty, and staff in a unified digital campus environment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-lg text-base">
                <Link href="/register">
                  Get Started <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-lg text-base">
                <Link href="/login">
                  Log In
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="lg:mt-0 mt-10" data-aos="fade-left" data-aos-delay="200">
            <div className="relative">
              <div className="w-full h-full rounded-xl bg-indigo-100 dark:bg-indigo-950/30 p-6 sm:p-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center bg-indigo-600 text-white">
                      <Graduation className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-50">Campus Event</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">Today at 2:00 PM</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="rounded-lg">RSVP</Button>
                </div>
                
                <div className="mb-6 p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h3 className="font-medium text-slate-900 dark:text-slate-50">Discussion Forum</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">12 new posts</p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50">Assignments</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">2 due soon</p>
                  </div>
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <h4 className="font-medium text-sm text-slate-900 dark:text-slate-50">Notifications</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">5 unread</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}