'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, LogOut } from "lucide-react";
import JobSearchForm from "@/components/job/JobSearchForm";
import { useSession } from "@/hooks/useSession";

export default function Home() {
  const { session, signOut } = useSession();
  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <div className="flex justify-end mb-4">
          <Button variant="outline" onClick={signOut}>
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto bg-primary rounded-full w-12 h-12 flex items-center justify-center">
              <Briefcase className="text-primary-foreground w-6 h-6" />
            </div>
            <CardTitle className="text-2xl font-bold">Find Your Dream Job</CardTitle>
            <p className="text-muted-foreground">Tell us about the job you’re looking for</p>
          </CardHeader>

          <CardContent>
            <JobSearchForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
