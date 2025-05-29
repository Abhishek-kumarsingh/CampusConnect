"use client"

import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MessageSquare, 
  Book, 
  Video, 
  Mail,
  Phone,
  Clock,
  Search,
  ExternalLink,
  FileText,
  Users,
  Lightbulb
} from 'lucide-react';

export default function HelpPage() {
  const { user } = useAuth();

  const faqItems = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking the 'Forgot Password' link on the login page, or by going to Settings > Security and updating your password there.",
      category: "Account"
    },
    {
      question: "How do I submit an assignment?",
      answer: "Navigate to the Assignments section in your dashboard, find the assignment you want to submit, and click the 'Submit' button. You can upload files or enter text depending on the assignment type.",
      category: "Academic"
    },
    {
      question: "How do I join a study group?",
      answer: "Go to the Groups section, browse available groups, and click 'Join Group' on any group you're interested in. Some groups may require approval from the group admin.",
      category: "Groups"
    },
    {
      question: "How do I check my grades?",
      answer: "Your grades are available in the Assignments section. Click on any completed assignment to view your grade and feedback from your instructor.",
      category: "Academic"
    },
    {
      question: "How do I register for events?",
      answer: "Visit the Events page, find an event you want to attend, and click the 'Register' button. You'll receive a confirmation email with event details.",
      category: "Events"
    },
    {
      question: "How do I contact my instructor?",
      answer: "You can contact your instructor through the course discussion forum, or find their contact information in the course details section.",
      category: "Communication"
    }
  ];

  const helpResources = [
    {
      title: "Getting Started Guide",
      description: "Complete guide for new users to navigate CampusConnect",
      type: "guide",
      icon: Book,
      url: "#"
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video tutorials for common tasks",
      type: "video",
      icon: Video,
      url: "#"
    },
    {
      title: "User Manual",
      description: "Comprehensive documentation for all features",
      type: "manual",
      icon: FileText,
      url: "#"
    },
    {
      title: "Community Forum",
      description: "Ask questions and get help from other users",
      type: "community",
      icon: Users,
      url: "#"
    }
  ];

  const contactOptions = [
    {
      title: "Email Support",
      description: "Get help via email within 24 hours",
      icon: Mail,
      contact: "support@campusconnect.edu",
      availability: "24/7"
    },
    {
      title: "Phone Support",
      description: "Speak directly with our support team",
      icon: Phone,
      contact: "+1 (555) 123-4567",
      availability: "Mon-Fri 9AM-5PM"
    },
    {
      title: "Live Chat",
      description: "Get instant help through live chat",
      icon: MessageSquare,
      contact: "Available in app",
      availability: "Mon-Fri 9AM-9PM"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Help & Support</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          Find answers to your questions and get the help you need
        </p>
      </div>

      {/* Quick Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search for help articles, guides, or FAQs..."
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="faq">FAQ</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="faq" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      <div className="flex items-center gap-2">
                        <span>{item.question}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-600 dark:text-slate-400">
                        {item.answer}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {helpResources.map((resource, index) => {
              const Icon = resource.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900">
                        <Icon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{resource.title}</CardTitle>
                        <CardDescription>{resource.description}</CardDescription>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400" />
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
              <CardDescription>Helpful tips to get the most out of CampusConnect</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Enable notifications</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Stay updated with assignment deadlines and important announcements
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Join study groups</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Collaborate with classmates and improve your learning experience
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Use the calendar</p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Keep track of all your assignments, events, and deadlines in one place
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      <CardTitle className="text-lg">{option.title}</CardTitle>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="font-medium">{option.contact}</p>
                      <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
                        <Clock className="h-4 w-4" />
                        <span>{option.availability}</span>
                      </div>
                    </div>
                    <Button className="w-full mt-4">Contact Now</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Technical Support</CardTitle>
              <CardDescription>For technical issues and bug reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                If you're experiencing technical difficulties or have found a bug, please provide as much detail as possible to help us resolve the issue quickly.
              </p>
              <Button variant="outline">Report a Bug</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send Feedback</CardTitle>
              <CardDescription>Help us improve CampusConnect with your suggestions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="feedbackType">Feedback Type</Label>
                <select 
                  id="feedbackType"
                  className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-800"
                >
                  <option>General Feedback</option>
                  <option>Feature Request</option>
                  <option>Bug Report</option>
                  <option>User Experience</option>
                  <option>Performance Issue</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" placeholder="Brief description of your feedback" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Please provide detailed feedback..."
                  rows={5}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (optional)</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="your.email@example.com"
                  defaultValue={user?.email}
                />
              </div>

              <Button className="w-full">Send Feedback</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
