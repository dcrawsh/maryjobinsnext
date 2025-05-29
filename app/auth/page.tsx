import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthTabs from "@/components/auth/AuthTabs";
import { Toaster } from "sonner";

export default function AuthPage() {
  return (
    <>
      <Toaster position="top-right" />
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-gradient-to-b from-background to-secondary px-4">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">Welcome</CardTitle>
            </CardHeader>
            <CardContent>
              <AuthTabs />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
