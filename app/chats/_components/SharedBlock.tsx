"use client";

import { FC, ReactNode, useEffect, useState } from "react";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
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

        <ResizablePanel className="!overflow-y-auto my-60 2xl:my-[30rem]">
          <div className="hidden md:block"></div>
          {children}
        </ResizablePanel>
      </ResizablePanelGroup>

      <div className="md:hidden">{children}</div>
    </>
  );
};
