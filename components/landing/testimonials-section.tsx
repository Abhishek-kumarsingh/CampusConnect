"use client"

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

type Testimonial = {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar: string;
};

export function TestimonialsSection() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "CampusConnect has completely transformed how our student council organizes events. It's so much easier to coordinate and get participants!",
      author: "Jessica Chen",
      role: "Student Council President",
      avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 2,
      quote: "As a professor, I can now communicate with my students more efficiently. The discussion forums have greatly improved engagement in my classes.",
      author: "Dr. Michael Thompson",
      role: "Associate Professor, Computer Science",
      avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 3,
      quote: "The platform has made administrative tasks so much more streamlined. We've seen a 40% increase in event attendance since adoption.",
      author: "Sarah Johnson",
      role: "Dean of Student Affairs",
      avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150"
    },
    {
      id: 4,
      quote: "CampusConnect helped me find study groups and connect with peers in my major. My grades have improved and I've made great friends!",
      author: "David Rodriguez",
      role: "Engineering Student",
      avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  const nextTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const prevTestimonial = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setActiveIndex((prevIndex) => 
        prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
      );
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  return (
    <section className="py-20 px-4 bg-indigo-50 dark:bg-slate-800/50" data-aos="fade-up">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900 dark:text-white">
            What Our Users Say
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300">
            Hear from students and faculty who have transformed their campus experience
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="absolute -top-10 -left-10 text-indigo-300 dark:text-indigo-700 opacity-50">
            <Quote size={80} />
          </div>
          
          <Card className="border-none shadow-lg bg-white dark:bg-slate-800 overflow-hidden">
            <CardContent className="p-0">
              <div className="relative overflow-hidden">
                <div 
                  className={`flex transition-transform duration-500 ease-in-out ${isAnimating ? 'opacity-50' : 'opacity-100'}`}
                  style={{ transform: `translateX(-${activeIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="w-full flex-shrink-0 p-8 md:p-12">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                          <img 
                            src={testimonial.avatar} 
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-lg md:text-xl text-slate-700 dark:text-slate-200 mb-6 italic">
                            "{testimonial.quote}"
                          </p>
                          <div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-white">
                              {testimonial.author}
                            </h4>
                            <p className="text-indigo-600 dark:text-indigo-400">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8 gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={prevTestimonial}
              disabled={isAnimating}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Previous</span>
            </Button>
            
            <div className="flex items-center gap-2 mx-4">
              {testimonials.map((_, index) => (
                <button 
                  key={index} 
                  className={`w-2.5 h-2.5 rounded-full ${activeIndex === index ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-300 dark:bg-slate-600'}`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full"
              onClick={nextTestimonial}
              disabled={isAnimating}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}