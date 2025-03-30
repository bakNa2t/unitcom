import Image from "next/image";
import { SignInButton } from "@clerk/clerk-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThemeModeToggle } from "@/components/theme-mode-toggle";

import { useIsDesktop } from "@/hooks/useIsDesktop";

export const StartPage = () => {
  const isDesktop = useIsDesktop();

  return (
    <>
      <div className="absolute top-4 right-4">
        <ThemeModeToggle />
      </div>

      <div className="grid place-content-center bg-slate-900 w-svw h-dvh">
        <div className="flex flex-col items-center space-y-8">
          <Image
            src="/logo-title-dark.svg"
            width={isDesktop ? 400 : 300}
            height="150"
            alt="logo-title"
            className="dark:hidden"
          />

          <h1 className="text-3xl md:text-4xl font-bold text-primary-main">
            Welcome to Unitcom!
          </h1>

          <Card className="bg-slate-800 w-[300px] md:w-[350px] border-none shadow-xl">
            <CardHeader className="text-muted-foreground">
              <CardTitle>Sign in to start messaging</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <SignInButton mode="modal">
                <Button className="w-full bg-slate-600 hover:bg-primary-main hover:text-indigo-950">
                  Sign In
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
