"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import ResetPasswordForm from "./ResetPasswordForm";

export default function AuthTabs() {
  const [tab, setTab] = useState<"signin" | "signup" | "reset">("signin");

  return (
    <Tabs value={tab} onValueChange={(val) => setTab(val as any)} className="space-y-4">
      <TabsList className="grid grid-cols-2">
        <TabsTrigger value="signin">Sign In</TabsTrigger>
        <TabsTrigger value="signup">Sign Up</TabsTrigger>
      </TabsList>

      <TabsContent value="signin"><SignInForm /></TabsContent>
      <TabsContent value="signup"><SignUpForm /></TabsContent>
      <TabsContent value="reset"><ResetPasswordForm goBack={() => setTab("signin")} /></TabsContent>
    </Tabs>
  );
}
