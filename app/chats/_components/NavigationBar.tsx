"use client";

import { FC, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useUser } from "@clerk/clerk-react";

import ProfileDialogContent from "./ProfileDialogContent";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { cn, isRouteActivePath } from "@/lib/utils";

type NavigationBarProps = {
  trigger: ReactNode;
};

export const NavigationBar: FC<NavigationBarProps> = ({ trigger }) => {
  const pathname = usePathname();

  const { user } = useUser();

  const menuItems = useMemo(
    () => [
      { icon: MessageCircle, label: "Chat", path: "/chats" },
      { icon: Phone, label: "Call", path: "/calls" },
    ],
    []
  );

  return (
    <>
      <div className="flex md:flex-col items-center justify-between bottom-0 md:top-0 left-0 md:w-24 w-full md:h-screen h-20 bg-teal-50 md:bg-gray-50 dark:bg-slate-900 border-r md:border-r-indigo-950 md:dark:border-r-primary-main py-5 fixed z-10 ">
        <div className="md:pt-2 flex flex-col items-center gap-9">
          <div className="hidden md:block">
            <Image
              src="/logo-light.svg"
              width="28"
              height="28"
              alt="logo"
              className="dark:hidden"
            />
            <Image
              src="/logo-dark.svg"
              width="28"
              height="28"
              alt="logo"
              className="hidden dark:block"
            />
          </div>

          <NavigationMenu orientation="vertical">
            <NavigationMenuList className="flex md:flex-col items-center justify-between !w-svw md:!w-fit px-5 md:px-0 md:space-y-4">
              {menuItems.map(({ icon: Icon, label, path }) => {
                const isActive = isRouteActivePath(pathname, path);

                return (
                  <Tooltip key={path}>
                    <TooltipTrigger>
                      <Link href={path}>
                        <NavigationMenuItem
                          className={cn("px-5 py-2 cursor-pointer rounded-xl", {
                            "dark:bg-gray-700 bg-gray-300": isActive,
                            "hover:dark:bg-gray-600 hover:bg-gray-200":
                              !isActive,
                          })}
                        >
                          <Icon
                            size={18}
                            fill={isActive ? "#131313" : "none"}
                          />
                        </NavigationMenuItem>
                      </Link>
                    </TooltipTrigger>

                    <TooltipContent
                      side="right"
                      className="bg-gray-500 dark:bg-gray-700 rounded-xl"
                    >
                      <p>{label}</p>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        <div className="hidden md:block">
          <Dialog>
            <NavigationMenu orientation="vertical">
              <DialogTrigger>
                <Avatar>
                  <AvatarImage src={user?.imageUrl} />
                  <AvatarFallback>User</AvatarFallback>
                </Avatar>
              </DialogTrigger>

              <DialogContent>
                <ProfileDialogContent />
              </DialogContent>
            </NavigationMenu>
          </Dialog>
        </div>
      </div>

      <div className="md:hidden fixed flex justify-between items-center w-svw top-0 left-0 h-20 z-10 px-10 bg-teal-50 dark:bg-slate-900">
        <NavigationMenu orientation="horizontal">
          <NavigationMenuList>
            <NavigationMenuItem>
              <Dialog>
                <NavigationMenu orientation="vertical">
                  <DialogTrigger>
                    <Avatar>
                      <AvatarImage src={user?.imageUrl} />
                      <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                  </DialogTrigger>

                  <DialogContent>
                    <ProfileDialogContent />
                  </DialogContent>
                </NavigationMenu>
              </Dialog>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {trigger}
      </div>
    </>
  );
};
