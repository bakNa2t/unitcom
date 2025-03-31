import Image from "next/image";
import { SignInButton } from "@clerk/clerk-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

      <div className="grid place-content-center bg-slate-50 dark:bg-slate-900 w-svw h-dvh">
        <div className="flex flex-col items-center space-y-8">
          <Image
            src="/logo-title-dark.svg"
            width={isDesktop ? 400 : 300}
            height="150"
            alt="logo-title"
            className="dark:hidden"
          />

          <h1 className="text-3xl md:text-5xl font-bold text-primary-main">
            Welcome to{" "}
            <span className="letter-spacing tracking-widest">Unitcom!</span>
          </h1>

          <Card className="bg-slate-800 w-[300px] md:w-[450px] border-none shadow-xl">
            <CardHeader className="text-muted-foreground">
              <CardTitle className="text-lg md:text-2xl text-center">
                Connect Effortlessly, Communicate Limitlessly with Unitcom
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-center gap-6">
              <CardDescription className="text-muted-foreground text-center md:text-base">
                Create, join, and manage group conversations with ease. Add
                text, images, and voice notes to your messages.
              </CardDescription>
              <SignInButton mode="modal">
                <Button className="w-full md:text-lg bg-slate-600 hover:bg-primary-main hover:text-indigo-950">
                  Join
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
