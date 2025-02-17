"use client";

import { FC, ReactNode, useMemo } from "react";
import { usePathname } from "next/navigation";
import { MessageCircle, Phone } from "lucide-react";

type NavigationBarProps = {
  trigger: ReactNode;
};

export const NavigationBar: FC<NavigationBarProps> = () => {
  const pathName = usePathname();

  const menuItems = useMemo(
    () => [
      { icon: MessageCircle, label: "Chat", path: "/cahts" },
      { icon: Phone, label: "Call", path: "/calls" },
    ],
    []
  );

  return (
    <div className="flex md:flex-col items-center justify-between bottom-0 md:top-0 left-0 md:w-24 w-full md:h-screen h-20 bg-white dark:bg-slate-950 border-r md:border-r-gray-400 md:dark:border-r-gray-800 py-5 fixed z-10 ">
      <div className="md:pt-10"></div>
    </div>
  );
};
