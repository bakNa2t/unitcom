"use client";

import Image from "next/image";
import Link from "next/link";
import { SignInButton, UserButton } from "@clerk/clerk-react";
import { useConvexAuth } from "convex/react";

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
import { Spinner } from "@/components/spinner";

export const StartPage = () => {
  const isDesktop = useIsDesktop();
  const { isAuthenticated, isLoading } = useConvexAuth();

  return (
    <>
      <div className="fixed flex items-center justify-end gap-4 bg-transparent top-0 w-full p-4 md:p-6">
        {isLoading && (
          <Spinner size="lg" className="text-primary-main dark:text-slate-50" />
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant="ghost" size="sm">
              <Link href="/chats">Let&apos;s chat</Link>
            </Button>
            <UserButton afterSwitchSessionUrl="/" />
          </>
        )}

        {!isAuthenticated && !isLoading && (
          <SignInButton mode="modal">
            <Button
              variant="outline"
              className="bg-slate-200 hover:bg-teal-100 dark:hover:bg-primary-main dark:hover:text-slate-950 dark:bg-slate-800 border-slate-400 dark:border-slate-950  hover:border-primary-main dark:hover:border-primary-main"
            >
              Sign In
            </Button>
          </SignInButton>
        )}

        <ThemeModeToggle />
      </div>

      <div className="grid place-content-center bg-slate-50 dark:bg-slate-900 w-svw h-dvh">
        <div className="flex flex-col items-center space-y-8">
          <Image
            src="/logo-title-light.svg"
            width={isDesktop ? 400 : 300}
            height="150"
            alt="logo-title"
            className="dark:hidden"
          />
          <Image
            src="/logo-title-dark.svg"
            width={isDesktop ? 400 : 300}
            height="150"
            alt="logo-title"
            className="hidden dark:block"
          />

          <h1 className="text-3xl md:text-5xl font-bold text-primary-main">
            Welcome to{" "}
            <span className="letter-spacing tracking-widest">Unitcom!</span>
          </h1>

          <Card className="bg-slate-300 dark:bg-slate-800 w-[300px] md:w-[450px] border-none shadow-xl">
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

              {isLoading && (
                <Button className="w-full md:text-lg bg-slate-600 hover:bg-primary-main hover:text-indigo-950">
                  <Spinner
                    size="2xl"
                    className="text-primary-main dark:text-slate-50"
                  />
                </Button>
              )}

              {isAuthenticated && !isLoading && (
                <Link href="/chats">
                  <Button className="w-full md:text-lg bg-slate-600 hover:bg-primary-main hover:text-indigo-950">
                    Let&apos;s chat
                  </Button>
                </Link>
              )}

              {!isAuthenticated && !isLoading && (
                <SignInButton mode="modal">
                  <Button className="w-full md:text-lg bg-slate-600 hover:bg-primary-main hover:text-indigo-950">
                    Join
                  </Button>
                </SignInButton>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
