import { cn } from "@heroui/react";
import React from "react";

interface HeadingProps {
  children: React.ReactNode;
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

const baseStyles = {
  1: "text-4xl font-bold",
  2: "text-3xl font-semibold",
  3: "text-2xl font-semibold",
  4: "text-xl font-medium",
  5: "text-lg font-medium",
  6: "text-base font-medium"
};

export const Heading: React.FC<HeadingProps> = ({
  children,
  className,
  level = 2
}) => {
  const Tag = "h" + level;

  return React.createElement(
    Tag,
    {
      className: cn(baseStyles[level], className)
    },
    children
  );
};
