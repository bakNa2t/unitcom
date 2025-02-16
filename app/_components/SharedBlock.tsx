"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type SharedBlockProps = {
  children: ReactNode;
  SidebarComponent: FC<any>;
  SidebarProps?: any;
};

export const SharedBlock: FC<SharedBlockProps> = ({ children }) => {
  const pathName = usePathname();
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  if (!isRendered) return null;

  return (
    <>
      <div className="md:hidden">{children}</div>
    </>
  );
};
