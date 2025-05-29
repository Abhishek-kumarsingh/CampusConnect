import Link from 'next/link';
import { Button } from './ui/button';
import { Facebook, Twitter, Instagram, Linkedin, Github } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Product",
      links: [
        { name: "Features", href: "#features" },
        { name: "Testimonials", href: "#testimonials" },
        { name: "Pricing", href: "#pricing" },
        { name: "FAQs", href: "#faqs" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Blog", href: "#blog" },
        { name: "Contact", href: "#contact" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "Community", href: "#community" },
        { name: "Help Center", href: "#help" },
        { name: "Privacy", href: "#privacy" },
        { name: "Terms", href: "#terms" },
      ]
    },
  ];
  
  const socialLinks = [
    { icon: <Facebook size={18} />, href: "#", label: "Facebook" },
    { icon: <Twitter size={18} />, href: "#", label: "Twitter" },
    { icon: <Instagram size={18} />, href: "#", label: "Instagram" },
    { icon: <Linkedin size={18} />, href: "#", label: "LinkedIn" },
    { icon: <Github size={18} />, href: "#", label: "GitHub" },
  ];

  return (
    <footer className="bg-slate-100 dark:bg-slate-900 pt-16 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">Campus</span>
              <span className="text-2xl font-bold text-slate-800 dark:text-white">Connect</span>
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-md">
              Empowering academic communities with integrated tools for communication, collaboration, and campus engagement.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Button key={index} variant="outline" size="icon" asChild className="rounded-full h-9 w-9">
                  <Link href={social.href} aria-label={social.label}>
                    {social.icon}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
          
          {/* Links Columns */}
          {footerLinks.map((column, index) => (
            <div key={index}>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
                {column.title}
              </h3>
              <ul className="space-y-3">
                {column.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.href} 
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 md:mb-0">
              © {currentYear} CampusConnect. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#privacy" className="text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400">
                Privacy Policy
              </Link>
              <Link href="#terms" className="text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400">
                Terms of Service
              </Link>
              <Link href="#cookies" className="text-slate-500 dark:text-slate-400 text-sm hover:text-indigo-600 dark:hover:text-indigo-400">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}