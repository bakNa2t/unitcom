"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useSidebarWidth } from "@/hooks/useSidebarWidth";

type SharedBlockProps = {
  children: ReactNode;
  SidebarComponent: FC<any>;
  SidebarProps?: any;
};

export const SharedBlock: FC<SharedBlockProps> = ({
  children,
  SidebarComponent,
  SidebarProps,
}) => {
  const pathName = usePathname();
  const [isRendered, setIsRendered] = useState(false);
  const { sidebarWidth, setSidebarWidth } = useSidebarWidth();

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
          className="border-r border-r-gray-400 dark:border-r-gray-800"
        />

        <ResizablePanel className="!overflow-y-auto my-20 bg-slate-200">
          <div className="hidden md:block"></div>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="md:hidden">{children}</div>
    </>
  );
};
