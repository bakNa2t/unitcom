import { FC, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

type SidebarContainerProps = {
  children: ReactNode;
  title: string;
  trigger: ReactNode;
};

export const SidebarContainer: FC<SidebarContainerProps> = ({
  children,
  title,
  trigger,
}) => {
  const router = useRouter();

  const handleRouteToChats = () => router.push("/chats");

  return (
    <ScrollArea className="h-full">
      <div className="px-4">
        <div className="flex items-center justify-between mt-10">
          <Button
            variant="ghost"
            onClick={handleRouteToChats}
            className="text-2xl font-bold"
          >
            {title}
          </Button>
          <div>{trigger}</div>
        </div>

        <div className="flex items-center my-4 h-8 p-2 bg-gray-200 dark:bg-gray-800 rounded-xl">
          <Search className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full h-8 p-2 rounded-lg focus:outline-none bg-gray-200 dark:bg-gray-800"
          />
        </div>

        {children}
      </div>
    </ScrollArea>
  );
};
