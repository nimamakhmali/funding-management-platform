import { cn } from "@/lib/utils";
import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
}

export default function Container({ children, className, ...props }: Props) {
  return (
    <div
      className={cn(
        "container",
        " mx-auto flex flex-col gap-8",
        " mx-auto",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
