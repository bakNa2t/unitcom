"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) return null;

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={30} maxSize={40}>
          <SidebarComponent {...SidebarProps} />
        </ResizablePanel>

        <ResizableHandle
          withHandle={pathName === "/chats"}
          className="border-r border-r-gray-400 dark:border-r-gray-800"
        />
      </ResizablePanelGroup>

      <div className="md:hidden">{children}</div>
    </>
  );
};
