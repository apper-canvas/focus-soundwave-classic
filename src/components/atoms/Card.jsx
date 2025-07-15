import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "rounded-lg border border-gray-700 bg-surface shadow-lg backdrop-blur-sm",
        className
      )}
      {...props}
    />
  );
});

Card.displayName = "Card";

export default Card;