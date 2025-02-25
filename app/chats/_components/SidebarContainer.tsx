import { FC, ReactNode } from "react";
import { ScrollArea } from "../../../components/ui/scroll-area";
import { Search } from "lucide-react";

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
  return (
    <ScrollArea className="h-full">
      <div className="px-4">
        <div className="flex items-center justify-between mt-10">
          <h2 className="text-2xl font-bold">{title}</h2>
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
