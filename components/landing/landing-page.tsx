import { HeroSection } from './hero-section';
import { FeaturesSection } from './features-section';
import { StatsSection } from './stats-section';
import { TestimonialsSection } from './testimonials-section';
import { Navbar } from '../navbar';
import { Footer } from '../footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}