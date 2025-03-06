import { FC, ReactNode } from "react";
import Link from "next/link";
import { format } from "date-fns";

import { cn } from "@/lib/utils";
import Image from "next/image";

type ChatMessageItemProps = {
  createdAt: number;
  fromCurrentUser: boolean;
  senderImage?: string;
  senderName: string;
  lastByUser: boolean;
  content: string[];
  type: string;
  seen?: ReactNode;
};

export const ChatMessageItem: FC<ChatMessageItemProps> = (
  createdAt,
  fromCurrentUser,
  senderImage,
  senderName,
  lastByUser,
  content,
  type,
  seen
) => {
  const formatTime = (timestamp: number) => format(timestamp, "HH:mm");

  return (
    <div
      className={cn("flex flex-col w-full mx-2", {
        "justify-end": fromCurrentUser,
      })}
    >
      <div
        className={cn("flex flex-col w-full mx-2", {
          "order-1 items-end": fromCurrentUser,
          "order-2 items-start": !fromCurrentUser,
        })}
      >
        <div
          className={cn(
            "flex flex-col items-center justify-between py-1 space-x-2 rounded-lg max-w-[80%]",
            {
              "bg-blue-700 text-primary-foreground":
                fromCurrentUser && type === "text",
              "bg-secondary text-secondary-foreground":
                !fromCurrentUser && type === "text",
              "rounded-br-none": !lastByUser && fromCurrentUser,
              "rounded-bl-none": !lastByUser && !fromCurrentUser,
            }
          )}
        >
          {type === "text" && (
            <p className="text-wrap break-words whitespace-pre-wrap break-all">
              {content}
            </p>
          )}

          {type === "audio" && (
            <audio className="max-w-44 md:max-w-full" controls>
              <source src={content[0]} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          )}

          {type === "image" && (
            <Link
              href={content[0]}
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                src={content[0]}
                alt="file"
                width={240}
                height={112}
                className="w-60 h-28 object-cover rounded-lg"
              />
            </Link>
          )}

          {type === "pdf" && (
            <Link href={content[0]} target="_blank" rel="noopener noreferrer">
              <p className="text-blue-700 underline">PDF Document</p>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
