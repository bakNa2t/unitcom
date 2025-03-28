import { Loader } from "lucide-react";

import { cn } from "@/lib/utils";
import { cva, VariantProps } from "class-variance-authority";

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "w-4 h-4",
      sm: "w-3 h-3",
      lg: "w-5 h-5",
      xl: "w-6 h-6",
      "2xl": "w-8 h-8",
      icon: "w-10 h-10",
    },
    defaultVariants: {
      size: "default",
    },
  },
});

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}

export const Spinner = ({ className, size }: SpinnerProps) => {
  return <Loader className={cn(spinnerVariants({ size }), className)} />;
};
