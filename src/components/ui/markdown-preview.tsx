import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
  className?: string;
}

export const MarkdownPreview = ({
  content,
  className,
}: MarkdownPreviewProps) => {
  return (
    <div
      className={cn("dark:prose-invert max-w-none prose prose-sm", className)}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="mt-4 mb-2 font-bold text-xl">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="mt-3 mb-2 font-semibold text-lg">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="mt-2 mb-1 font-medium text-base">{children}</h3>
          ),
          code: ({ inline, children }: any) =>
            inline ? (
              <code className="bg-muted px-1 py-0.5 rounded font-mono text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-muted p-3 rounded-md overflow-x-auto">
                <code className="font-mono text-sm">{children}</code>
              </pre>
            ),
          hr: () => <hr className="my-4 border-muted-foreground/20" />,
          blockquote: ({ children }) => (
            <blockquote className="pl-4 border-muted-foreground/20 border-l-4 italic">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="space-y-1 list-disc list-inside">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="space-y-1 list-decimal list-inside">{children}</ol>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};
