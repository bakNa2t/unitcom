import { Id } from "@/convex/_generated/dataModel";
import { FC } from "react";

export const ChatContent: FC<{ chatId: Id<"conversations"> }> = ({
  chatId,
}) => {
  return (
    <>
      <h1 className="text-3xl font-bold">Welcome to {chatId}</h1>
    </>
  );
};
