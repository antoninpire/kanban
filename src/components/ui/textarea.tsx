import * as React from "react";

import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    // const [content, setContent] = React.useState("");
    // const rows = Math.max(1, Math.round(content.length / 40));
    return (
      <textarea
        className={cn(
          "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        // style={{ height: `${rows * 45}px` }}
        ref={ref}
        // value={content}
        // rows={rows}
        // onChange={(e) => setContent(e.target.value)}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
