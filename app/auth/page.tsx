import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthTabs from "@/components/auth/AuthTabs";
import { Toaster } from "sonner";

export default function AuthPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary p-4">
        <div className="max-w-md mx-auto pt-8">
          <Card className="shadow-lg">
            <CardHeader className="text-center"><CardTitle className="text-2xl font-bold">Welcome</CardTitle></CardHeader>
            <CardContent><AuthTabs /></CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
