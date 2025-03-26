"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { cn } from "@/lib/utils";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";

type SharedBlockProps = {
  children: ReactNode;
  SidebarComponent: FC<() => JSX.Element>;
  SidebarProps?: any;
};

export const SharedBlock: FC<SharedBlockProps> = ({
  children,
  SidebarComponent,
  SidebarProps,
}) => {
  const [isRendered, setIsRendered] = useState(false);
  const { sidebarWidth, setSidebarWidth } = useSidebarWidth();
  const pathname = usePathname();

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) return null;

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          onResize={(width) => setSidebarWidth(width)}
          defaultSize={sidebarWidth}
          maxSize={40}
          minSize={20}
        >
          <SidebarComponent {...SidebarProps} />
        </ResizablePanel>

        <ResizableHandle
          withHandle
          className="border-r border-r-indigo-950 dark:border-r-primary-main"
        />

        <ResizablePanel
          className={cn(
            "!overflow-y-auto",
            pathname === "/chats" ? "my-60 2xl:my-[30rem]" : "my-20"
          )}
        >
          <div className="hidden md:block">{children}</div>
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="md:hidden">{children}</div>
    </>
  );
};
