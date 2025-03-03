import { FC } from "react";
import Image from "next/image";
import Link from "next/link";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const ChatTypeContent: FC<{ type: string; content: string[] }> = ({
  type,
  content,
}) => {
  return (
    <AspectRatio ratio={1 / 1}>
      {type === "image" && (
        <Image
          src={content[0]}
          width={450}
          height={235}
          alt="file"
          className="rounded-md object-cover"
        />
      )}
      {type === "audio" && (
        <audio src={content[0]} className="w-full h-full" controls />
      )}
      {type === "pdf" && (
        <Link
          className="bg-primary-main"
          href={content[0]}
          target="_blank"
          rel="noopener noreferrer"
        >
          <p className="underline">PDF Document</p>
        </Link>
      )}
    </AspectRatio>
  );
};
