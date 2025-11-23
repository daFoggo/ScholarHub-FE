import type React from "react";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { useGetPersonal } from "@/features/user_profile";
import { cn } from "@/lib/utils";
import { ArrowUp, Loader2, Sparkles, Square } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useGetChat, usePostChat } from "../hooks/use-chatbot";
import { ChatMessage } from "./chat-messages";
import { TypingIndicator } from "./typing-indicator";

interface IChatInterfaceProps {
  userId: string;
  threadId?: string;
  onNewThread: () => void;
  hasThreads: boolean;
}

export function ChatInterface({
  userId,
  threadId,
  onNewThread,
  hasThreads,
}: IChatInterfaceProps) {
  const { data: personalData } = useGetPersonal();
  const [message, setMessage] = useState("");
  const [optimisticMessage, setOptimisticMessage] = useState<any>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: messages, isLoading: isLoadingChat } = useGetChat({
    user_id: userId,
    thread_id: threadId || "",
  });

  const { mutateAsync: postChat, isPending: isSubmitting } = usePostChat();

  // Auto-scroll messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, optimisticMessage, isTyping]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!message.trim() || !threadId || !userId || isSubmitting) return;

    const messageText = message.trim();
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Show optimistic message immediately
    const optimisticMsg = {
      question: messageText,
      answer: "",
      created_at: new Date().toISOString(),
    };
    setOptimisticMessage(optimisticMsg);
    setIsTyping(true);

    try {
      await postChat({
        user_id: userId,
        thread_id: threadId,
        question: messageText,
      });

      // Clear optimistic state after successful response
      setOptimisticMessage(null);
      setIsTyping(false);

      // Focus back to textarea
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
        }
      }, 100);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Clear optimistic state on error
      setOptimisticMessage(null);
      setIsTyping(false);
      // Restore message on error
      setMessage(messageText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    const newHeight = Math.min(e.target.scrollHeight, 200);
    e.target.style.height = `${newHeight}px`;
  };

  if (!threadId) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex flex-1 justify-center items-center p-8">
          <div className="max-w-xl text-center">
            <div className="bg-linear-to-br from-primary/10 to-primary/20 shadow-lg mx-auto mb-6 p-6 rounded-full w-fit">
              <Sparkles className="w-12 h-12 text-primary" />
            </div>

            <h2 className="mb-3 font-semibold text-2xl tracking-tight">
              {hasThreads
                ? "Select a conversation"
                : `Welcome, ${personalData?.last_name || "User"}!`}
            </h2>

            <p className="mb-6 text-muted-foreground leading-relaxed">
              {hasThreads
                ? "Choose an existing conversation from the sidebar or start a new one."
                : "Get scholarship information and application guidance with ScholarHub's AI assistant."}
            </p>

            <Button
              onClick={onNewThread}
              size="lg"
              className="gap-2 shadow-md hover:shadow-lg transition-shadow"
            >
              <Sparkles className="w-4 h-4" />
              Start new conversation
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const sortedMessages = messages
    ? [...messages].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    : [];

  // Combine real messages with optimistic message
  const allMessages = optimisticMessage
    ? [...sortedMessages, optimisticMessage]
    : sortedMessages;

  return (
    <div className="flex flex-col bg-gradient-to-b from-background to-muted/20 h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {isLoadingChat ? (
            <div className="flex justify-center items-center h-full">
              <div className="flex flex-col items-center">
                <div className="bg-primary/10 mb-4 p-4 rounded-full">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Loading messages...
                </p>
              </div>
            </div>
          ) : !allMessages?.length && !isTyping ? (
            <div className="flex justify-center items-center p-8 h-full">
              <div className="text-center">
                <div className="bg-gradient-to-br from-primary/10 to-primary/20 shadow-lg mx-auto mb-4 p-6 rounded-full w-fit">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h3 className="mb-2 font-medium text-lg tracking-tight">
                  How can I help you today?
                </h3>
                <p className="max-w-md text-muted-foreground text-sm leading-relaxed">
                  Ask me about scholarships, application processes, or any
                  academic guidance you need.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 sm:p-6">
              <div className="space-y-6 mx-auto max-w-4xl">
                {allMessages.map((msg, index) => (
                  <ChatMessage
                    key={`message-${msg.created_at}-${index}`}
                    message={msg}
                    isOptimistic={msg === optimisticMessage}
                  />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </div>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Input Area */}
      <div className="bg-background/80 backdrop-blur-sm p-4 sm:p-6 border-t">
        <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
          <div className="relative">
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about scholarships, applications, or academic guidance..."
              className={cn(
                "bg-background/50 disabled:opacity-50 shadow-sm backdrop-blur-sm px-4 py-3 pr-12 border border-input rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ring-offset-background focus-visible:ring-offset-2 w-full placeholder:text-muted-foreground text-sm resize-none disabled:cursor-not-allowed",
                "min-h-[52px] max-h-[200px] transition-all duration-200"
              )}
              disabled={isSubmitting}
              rows={1}
            />

            <div className="right-2 bottom-2.5 absolute">
              {isSubmitting ? (
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="hover:bg-destructive/10 w-8 h-8 hover:text-destructive"
                  disabled
                >
                  <Square className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="shadow-md hover:shadow-lg w-8 h-8 transition-all duration-200"
                  disabled={!message.trim()}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-2 text-muted-foreground text-xs text-center">
            Press{" "}
            <kbd className="bg-muted px-1.5 py-0.5 border rounded text-xs">
              Enter
            </kbd>{" "}
            to send •
            <kbd className="bg-muted ml-1 px-1.5 py-0.5 border rounded text-xs">
              Shift + Enter
            </kbd>{" "}
            for new line
          </div>
        </form>
      </div>
    </div>
  );
}
