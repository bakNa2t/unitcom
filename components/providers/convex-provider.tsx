"use client";

import { ReactNode } from "react";
import { ClerkProvider, useAuth, SignInButton } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import {
  Authenticated,
  ConvexReactClient,
  Unauthenticated,
} from "convex/react";
import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export const ConvexClientProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <Authenticated>{children}</Authenticated>
        <Unauthenticated>
          <div className="grid place-content-center bg-slate-900 w-svw h-dvh">
            <div className="flex flex-col items-center space-y-8">
              <Image
                src="/logo-title-dark.svg"
                width="400"
                height="150"
                alt="logo-title"
                className="dark:hidden"
              />

              <h1 className="text-4xl font-bold text-primary-main">
                Welcome to Unitcom!
              </h1>

              <Card className="bg-slate-800 w-[350px] border-none shadow-xl">
                <CardHeader className="text-muted-foreground">
                  <CardTitle>Sign in to start messaging</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <SignInButton mode="modal">
                    <Button className="w-full bg-slate-600">Sign In</Button>
                  </SignInButton>
                </CardContent>
              </Card>
            </div>
          </div>
        </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
