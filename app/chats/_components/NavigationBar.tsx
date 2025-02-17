"use client";

import { FC, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";
import Link from "next/link";

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

import { cn, isRouteActivePath } from "@/lib/utils";

type NavigationBarProps = {
  trigger: ReactNode;
};

export const NavigationBar: FC<NavigationBarProps> = () => {
  const pathname = usePathname();

  const menuItems = useMemo(
    () => [
      { icon: MessageCircle, label: "Chat", path: "/cahts" },
      { icon: Phone, label: "Call", path: "/calls" },
    ],
    []
  );

  return (
    <div className="flex md:flex-col items-center justify-between bottom-0 md:top-0 left-0 md:w-24 w-full md:h-screen h-20 bg-white dark:bg-slate-950 border-r md:border-r-gray-400 md:dark:border-r-gray-800 py-5 fixed z-10 ">
      <div className="md:pt-10">
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
                          "hover:dark:bg-gray-600 hover:bg-gray-200": !isActive,
                        })}
                      >
                        <Icon size={18} fill={isActive ? "#131313" : "none"} />
                      </NavigationMenuItem>
                    </Link>
                  </TooltipTrigger>

                  <TooltipContent
                    side="right"
                    className="bg-gray-50 dark:bg-gray-700 rounded-xl"
                  >
                    <p>{label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  );
};
