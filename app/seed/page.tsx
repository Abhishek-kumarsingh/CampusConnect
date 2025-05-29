'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SeedPage() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<any>(null);
  const { toast } = useToast();

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);

    try {
      const response = await fetch('/api/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setSeedResult(data);
        toast({
          title: 'Success',
          description: 'Database seeded successfully!',
        });
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to seed database',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while seeding the database',
        variant: 'destructive',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Database Seeding
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Initialize the CampusConnect database with demo data
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Seed Database
              </CardTitle>
              <CardDescription>
                This will populate the database with demo users, events, assignments, and notifications.
                All existing data will be cleared.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800 dark:text-amber-200">Warning</h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      This action will delete all existing data and replace it with demo data.
                      Make sure you want to proceed.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-900 dark:text-white">Demo Credentials:</h3>
                <div className="grid gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-medium text-sm text-slate-900 dark:text-white">Student Account</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Email: student@campusconnect.edu<br />
                      Password: student123
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-medium text-sm text-slate-900 dark:text-white">Faculty Account</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Email: faculty@campusconnect.edu<br />
                      Password: faculty123
                    </div>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3">
                    <div className="font-medium text-sm text-slate-900 dark:text-white">Admin Account</div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      Email: admin@campusconnect.edu<br />
                      Password: admin123
                    </div>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSeed} 
                disabled={isSeeding}
                className="w-full"
                size="lg"
              >
                {isSeeding ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Seeding Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Seed Database
                  </>
                )}
              </Button>

              {seedResult && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800 dark:text-green-200">
                        Database Seeded Successfully!
                      </h3>
                      <div className="text-sm text-green-700 dark:text-green-300 mt-2">
                        <p>Created:</p>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                          <li>{seedResult.data.users} demo users</li>
                          <li>{seedResult.data.events} events</li>
                          <li>{seedResult.data.assignments} assignments</li>
                          <li>{seedResult.data.notifications} notifications</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center">
                <Button variant="outline" asChild>
                  <a href="/login">Go to Login</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
